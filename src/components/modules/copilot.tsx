'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  X, Send, Bot, User, Sparkles, Loader2, Trash2, Mic, MicOff,
  Volume2, VolumeX, ImagePlus, Search, Zap, Brain, ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { ChatMessage, SearchResultItem } from '@/lib/types';

// ── Slash Command Parser ──
function parseSlashCommand(input: string): { type: string; args: string } | null {
  const match = input.match(/^\/(\w+)(?:\s+(.*))?$/);
  if (!match) return null;
  return { type: match[1], args: match[2] || '' };
}

// ── Audio Context for TTS ──
let currentAudio: HTMLAudioElement | null = null;

export default function CopilotPanel() {
  const {
    copilotOpen, toggleCopilot, chatMessages, addChatMessage,
    chatLoading, setChatLoading, clearChat,
    copilotSkills, setCopilotSkills,
    copilotMemories, setCopilotMemories,
    voiceRecording, setVoiceRecording,
    copilotInitialized, setCopilotInitialized,
  } = useAppStore();

  const [input, setInput] = useState('');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState('');
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [imageGenerating, setImageGenerating] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [asrLoading, setAsrLoading] = useState(false);
  const [ttsLoadingId, setTtsLoadingId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const slashMenuRef = useRef<HTMLDivElement>(null);

  // ── Load Skills & Memory on mount ──
  useEffect(() => {
    if (!copilotOpen || copilotInitialized) return;

    const loadData = async () => {
      try {
        const [skillsRes, memoryRes] = await Promise.all([
          fetch('/api/skills'),
          fetch('/api/memory'),
        ]);

        if (skillsRes.ok) {
          const skillsData = await skillsRes.json();
          const skills = (skillsData.skills || []).map((s: Record<string, unknown>) => ({
            id: s.id as string,
            name: s.name as string,
            slug: s.slug as string,
            description: s.description as string,
            category: s.category as string || 'general',
            triggerPhrase: s.triggerPhrase as string || null,
            tags: Array.isArray(s.tags) ? s.tags as string[] : [],
          }));
          setCopilotSkills(skills);
        }
      } catch {
        // Skills load failed silently
      }

      try {
        if (memoryRes.ok) {
          const memData = await memoryRes.json();
          const mems = (memData.memories || []).map((m: Record<string, unknown>) => ({
            id: m.id as string,
            key: m.key as string,
            content: m.content as string,
            type: m.type as string || 'memory',
            importance: m.importance as number || 5,
          }));
          setCopilotMemories(mems);
        }
      } catch {
        // Memory load failed silently
      }

      setCopilotInitialized(true);
    };

    loadData();
  }, [copilotOpen, copilotInitialized, setCopilotSkills, setCopilotMemories, setCopilotInitialized]);

  // ── Auto-scroll ──
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, imageGenerating, searchLoading]);

  // ── Focus input when opened ──
  useEffect(() => {
    if (copilotOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [copilotOpen]);

  // ── Click outside slash menu ──
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (slashMenuRef.current && !slashMenuRef.current.contains(e.target as Node)) {
        setShowSlashMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Auto-learn after every 5 messages ──
  const triggerAutoLearn = useCallback((messages: ChatMessage[]) => {
    if (messages.length > 0 && messages.length % 5 === 0) {
      fetch('/api/skills/auto-learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          sessionId: 'web-copilot',
        }),
      }).catch(() => {
        // Auto-learn fails silently
      });
    }
  }, []);

  // ── Send Chat Message to /api/ai/chat ──
  const sendChatMessage = useCallback(async (messageText: string, skillName?: string) => {
    if (!messageText.trim() || chatLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
      type: skillName ? 'skill' : 'text',
      skillName,
    };

    addChatMessage(userMessage);
    setInput('');
    setShowSlashMenu(false);
    setChatLoading(true);

    try {
      // Build memory context for system prompt
      const memoryContext = copilotMemories.length > 0
        ? `\n\n## User Memory Context\n${copilotMemories.map(m => `- ${m.key}: ${m.content}`).join('\n')}`
        : '';

      const systemPrompt = `You are GangNiaga AI Copilot — an autonomous business intelligence assistant built into GangNiaga AI OS. You are an expert in business planning, financial forecasting, market research, and AI-powered automation for ASEAN SMEs.${memoryContext}`;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText.trim(),
          history: chatMessages.slice(-20).map(m => ({ role: m.role, content: m.content })),
          systemPrompt,
        }),
      });

      if (!response.ok) throw new Error('Chat request failed');

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        type: 'text',
      };

      addChatMessage(assistantMessage);

      // Trigger auto-learn
      const updatedMessages = [...chatMessages, userMessage, assistantMessage];
      triggerAutoLearn(updatedMessages);
    } catch {
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m currently experiencing connectivity issues. Please try again in a moment.',
        timestamp: new Date().toISOString(),
        type: 'text',
      });
    } finally {
      setChatLoading(false);
    }
  }, [chatLoading, chatMessages, copilotMemories, addChatMessage, setChatLoading, triggerAutoLearn]);

  // ── Handle Slash Commands ──
  const handleSlashCommand = useCallback(async (type: string, args: string) => {
    switch (type) {
      case 'image': {
        if (!args.trim()) {
          toast.error('Please provide an image description, e.g., /image Professional dashboard hero');
          return;
        }
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: `/image ${args.trim()}`,
          timestamp: new Date().toISOString(),
          type: 'skill',
          skillName: 'Image Generation',
        };
        addChatMessage(userMsg);
        setImageGenerating(true);
        setChatLoading(true);

        try {
          const res = await fetch('/api/ai/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: args.trim() }),
          });

          if (!res.ok) throw new Error('Image generation failed');

          const data = await res.json();
          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Here's the generated image for: "${args.trim()}"`,
            timestamp: new Date().toISOString(),
            type: 'image',
            imageBase64: data.image,
          });
        } catch {
          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'I couldn\'t generate that image. Please try again with a different description.',
            timestamp: new Date().toISOString(),
            type: 'text',
          });
        } finally {
          setImageGenerating(false);
          setChatLoading(false);
        }
        break;
      }

      case 'search': {
        if (!args.trim()) {
          toast.error('Please provide a search query, e.g., /search ASEAN SME market size 2024');
          return;
        }
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: `/search ${args.trim()}`,
          timestamp: new Date().toISOString(),
          type: 'skill',
          skillName: 'Web Search',
        };
        addChatMessage(userMsg);
        setSearchLoading(true);
        setChatLoading(true);

        try {
          const res = await fetch('/api/ai/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: args.trim() }),
          });

          if (!res.ok) throw new Error('Search failed');

          const data = await res.json();
          const results: SearchResultItem[] = Array.isArray(data.results)
            ? data.results.map((r: Record<string, unknown>) => ({
                title: r.title || r.name || 'Result',
                url: r.url || r.link || '#',
                snippet: r.snippet || r.content || '',
              }))
            : [];

          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: results.length > 0
              ? `Here are the search results for "${args.trim()}":`
              : `No results found for "${args.trim()}".`,
            timestamp: new Date().toISOString(),
            type: 'search',
            searchResults: results,
          });
        } catch {
          addChatMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Search failed. Please try again later.',
            timestamp: new Date().toISOString(),
            type: 'text',
          });
        } finally {
          setSearchLoading(false);
          setChatLoading(false);
        }
        break;
      }

      default: {
        // Try matching a skill from the skills list
        const matchedSkill = copilotSkills.find(
          s => s.slug === type || s.triggerPhrase === `/${type}`
        );
        if (matchedSkill) {
          const fullPrompt = args.trim()
            ? `${matchedSkill.name}: ${args.trim()}`
            : `Run the ${matchedSkill.name} skill`;
          await sendChatMessage(fullPrompt, matchedSkill.name);
        } else {
          // Unknown slash command — send as regular message
          await sendChatMessage(`/${type} ${args}`.trim());
        }
        break;
      }
    }
  }, [addChatMessage, chatMessages, copilotSkills, sendChatMessage, setChatLoading, triggerAutoLearn]);

  // ── Main Send Handler ──
  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || chatLoading) return;

    // Check for slash command
    const slashCmd = parseSlashCommand(trimmed);
    if (slashCmd) {
      await handleSlashCommand(slashCmd.type, slashCmd.args);
    } else {
      await sendChatMessage(trimmed);
    }
  }, [input, chatLoading, handleSlashCommand, sendChatMessage]);

  // ── Key Down Handler ──
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showSlashMenu) return;
      handleSend();
    }
    if (e.key === 'Escape') {
      setShowSlashMenu(false);
    }
  };

  // ── Input Change Handler (detect slash commands) ──
  const handleInputChange = (value: string) => {
    setInput(value);
    if (value.startsWith('/')) {
      setShowSlashMenu(true);
      setSlashFilter(value.slice(1).toLowerCase());
    } else {
      setShowSlashMenu(false);
    }
  };

  // ── Voice Recording ──
  const toggleVoiceRecording = async () => {
    if (voiceRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setVoiceRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setAsrLoading(true);
          setChatLoading(true);

          try {
            const res = await fetch('/api/ai/asr', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audio: base64Audio, format: 'webm' }),
            });

            if (!res.ok) throw new Error('ASR failed');

            const data = await res.json();
            const transcription = typeof data.transcription === 'string'
              ? data.transcription
              : data.transcription?.text || data.transcription?.transcription || '';

            if (transcription) {
              // Send the transcribed text through the chat
              const slashCmd = parseSlashCommand(transcription);
              if (slashCmd) {
                await handleSlashCommand(slashCmd.type, slashCmd.args);
              } else {
                await sendChatMessage(transcription);
              }
            } else {
              toast.error('Could not transcribe audio. Please try again.');
            }
          } catch {
            toast.error('Voice transcription failed. Please try again.');
          } finally {
            setAsrLoading(false);
            setChatLoading(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setVoiceRecording(true);
      toast.info('Recording... Click the microphone again to stop.');
    } catch {
      toast.error('Microphone access denied. Please allow microphone permissions.');
    }
  };

  // ── TTS Playback ──
  const playTTS = async (text: string, messageId: string) => {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
      setPlayingMessageId(null);
    }

    if (playingMessageId === messageId) return;

    setTtsLoadingId(messageId);

    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.substring(0, 4096), voice: 'nova' }),
      });

      if (!res.ok) throw new Error('TTS failed');

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudio = audio;

      audio.onplay = () => setPlayingMessageId(messageId);
      audio.onended = () => {
        setPlayingMessageId(null);
        currentAudio = null;
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setPlayingMessageId(null);
        currentAudio = null;
        toast.error('Audio playback failed.');
      };

      await audio.play();
    } catch {
      toast.error('Failed to generate speech. Please try again.');
    } finally {
      setTtsLoadingId(null);
    }
  };

  const stopTTS = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    setPlayingMessageId(null);
  };

  // ── Filter skills for slash menu ──
  const filteredSkills = copilotSkills.filter(s =>
    s.slug.includes(slashFilter) || s.name.toLowerCase().includes(slashFilter)
  );

  // Built-in commands
  const builtInCommands = [
    { slug: 'image', name: 'Image Generation', description: 'Generate an image from text prompt', category: 'ai' },
    { slug: 'search', name: 'Web Search', description: 'Search the web for information', category: 'ai' },
  ];

  const allCommands = [...builtInCommands, ...filteredSkills].filter(c =>
    c.slug.includes(slashFilter) || c.name.toLowerCase().includes(slashFilter)
  );

  // ── Memory usage percentage ──
  const memoryPercent = copilotMemories.length > 0
    ? Math.min(100, Math.round((copilotMemories.length / 100) * 100))
    : 0;

  // ── Suggestions ──
  const suggestions = [
    'Analyze my current revenue trends',
    'Generate a SWOT analysis',
    'What are my key financial risks?',
    '/search ASEAN SME market size 2024',
    '/image Professional business dashboard',
  ];

  if (!copilotOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-card/95 backdrop-blur-xl border-l border-border z-50 flex flex-col shadow-2xl"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">GangNiaga AI Copilot</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground">Online</span>
                </div>
                <span className="text-[10px] text-muted-foreground">|</span>
                <div className="flex items-center gap-1">
                  <Brain className="h-2.5 w-2.5 text-amber-500" />
                  <span className="text-[10px] text-muted-foreground">Memory: {memoryPercent}%</span>
                </div>
                <span className="text-[10px] text-muted-foreground">|</span>
                <div className="flex items-center gap-1">
                  <Zap className="h-2.5 w-2.5 text-emerald-500" />
                  <span className="text-[10px] text-muted-foreground">Skills: {copilotSkills.length}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearChat}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear chat</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleCopilot}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── Skills Bar ── */}
        {copilotSkills.length > 0 && (
          <div className="border-b border-border px-3 py-2">
            <ScrollArea className="w-full">
              <div className="flex gap-1.5 pb-1" style={{ minWidth: 0 }}>
                {copilotSkills.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => {
                      setInput(`/${skill.slug} `);
                      inputRef.current?.focus();
                    }}
                    className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/40 transition-colors"
                  >
                    <ChevronRight className="h-2.5 w-2.5" />
                    /{skill.slug}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setInput('/image ');
                    inputRef.current?.focus();
                  }}
                  className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border border-violet-500/20 bg-violet-500/5 text-violet-700 dark:text-violet-400 hover:bg-violet-500/15 hover:border-violet-500/40 transition-colors"
                >
                  <ImagePlus className="h-2.5 w-2.5" />
                  /image
                </button>
                <button
                  onClick={() => {
                    setInput('/search ');
                    inputRef.current?.focus();
                  }}
                  className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border border-cyan-500/20 bg-cyan-500/5 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-500/40 transition-colors"
                >
                  <Search className="h-2.5 w-2.5" />
                  /search
                </button>
              </div>
            </ScrollArea>
          </div>
        )}

        {/* ── Messages ── */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {chatMessages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                }`}>
                  {msg.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>
                <div className={`max-w-[85%] space-y-1.5 ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}>
                  {/* Skill badge */}
                  {msg.skillName && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                      <Zap className="h-2.5 w-2.5 mr-0.5" />
                      {msg.skillName}
                    </Badge>
                  )}

                  {/* Message bubble */}
                  <div className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 border border-border'
                  }`}>
                    {msg.type === 'image' && msg.imageBase64 ? (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">{msg.content}</p>
                        <img
                          src={`data:image/png;base64,${msg.imageBase64}`}
                          alt="AI Generated"
                          className="rounded-lg max-w-full border border-border"
                          loading="lazy"
                        />
                      </div>
                    ) : msg.type === 'search' && msg.searchResults && msg.searchResults.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm">{msg.content}</p>
                        <div className="space-y-1.5">
                          {msg.searchResults.map((result, ri) => (
                            <div
                              key={ri}
                              className="p-2 rounded-lg bg-background/50 border border-border hover:border-emerald-500/30 transition-colors"
                            >
                              <div className="flex items-start gap-1.5">
                                <ExternalLink className="h-3 w-3 mt-0.5 text-emerald-500 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium truncate">{result.title}</p>
                                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{result.snippet}</p>
                                  {result.url && result.url !== '#' && (
                                    <p className="text-[10px] text-emerald-500 truncate mt-0.5">{result.url}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                    )}
                  </div>

                  {/* TTS Play button for assistant messages */}
                  {msg.role === 'assistant' && msg.type !== 'image' && (
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => {
                                if (playingMessageId === msg.id) {
                                  stopTTS();
                                } else {
                                  playTTS(msg.content, msg.id);
                                }
                              }}
                              disabled={ttsLoadingId === msg.id}
                            >
                              {ttsLoadingId === msg.id ? (
                                <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />
                              ) : playingMessageId === msg.id ? (
                                <VolumeX className="h-3 w-3 text-amber-500" />
                              ) : (
                                <Volume2 className="h-3 w-3 text-muted-foreground hover:text-emerald-500" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {playingMessageId === msg.id ? 'Stop audio' : 'Play audio'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Loading States */}
            {chatLoading && !imageGenerating && !searchLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-muted/50 border border-border rounded-xl px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {imageGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-muted/50 border border-border rounded-xl px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <ImagePlus className="h-3.5 w-3.5 animate-pulse text-violet-500" />
                    <span className="text-xs text-muted-foreground">Generating image...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {searchLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-muted/50 border border-border rounded-xl px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 animate-pulse text-cyan-500" />
                    <span className="text-xs text-muted-foreground">Searching the web...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {asrLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-muted/50 border border-border rounded-xl px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <Mic className="h-3.5 w-3.5 animate-pulse text-amber-500" />
                    <span className="text-xs text-muted-foreground">Transcribing audio...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Suggestions ── */}
          {chatMessages.length <= 1 && !chatLoading && (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-emerald-500" />
                Suggested prompts
              </p>
              <div className="grid gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="text-left text-xs px-3 py-2.5 rounded-lg border border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        {/* ── Slash Command Menu ── */}
        <AnimatePresence>
          {showSlashMenu && allCommands.length > 0 && (
            <motion.div
              ref={slashMenuRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="border-t border-border mx-3 mb-1 bg-popover rounded-lg shadow-lg overflow-hidden"
            >
              <ScrollArea className="max-h-48">
                <div className="p-1">
                  {allCommands.map((cmd) => (
                    <button
                      key={cmd.slug}
                      onClick={() => {
                        setInput(`/${cmd.slug} `);
                        setShowSlashMenu(false);
                        inputRef.current?.focus();
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-accent flex items-center gap-2 transition-colors"
                    >
                      <ChevronRight className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-medium">/{cmd.slug}</span>
                        <span className="text-[11px] text-muted-foreground ml-2 truncate">{cmd.description}</span>
                      </div>
                      {cmd.category && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 ml-auto flex-shrink-0">
                          {cmd.category}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Input Bar ── */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            {/* Voice Record Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 rounded-full shrink-0 ${
                      voiceRecording
                        ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-600 animate-pulse'
                        : 'hover:bg-emerald-500/10 hover:text-emerald-500'
                    }`}
                    onClick={toggleVoiceRecording}
                    disabled={chatLoading || asrLoading}
                  >
                    {voiceRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{voiceRecording ? 'Stop recording' : 'Voice input'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Text Input */}
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask GangNiaga AI... (type / for skills)"
                disabled={chatLoading}
                className="w-full bg-muted/30 border-border focus:border-emerald-500 pr-16 h-9 text-sm"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-violet-500/10 hover:text-violet-500"
                        onClick={() => {
                          setInput('/image ');
                          inputRef.current?.focus();
                        }}
                        disabled={chatLoading}
                      >
                        <ImagePlus className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Generate image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-cyan-500/10 hover:text-cyan-500"
                        onClick={() => {
                          setInput('/search ');
                          inputRef.current?.focus();
                        }}
                        disabled={chatLoading}
                      >
                        <Search className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Web search</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!input.trim() || chatLoading}
              size="icon"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shrink-0 h-9 w-9"
            >
              {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
            GangNiaga AI Copilot — Autonomous Business Intelligence
            {voiceRecording && (
              <span className="text-red-500 ml-1.5 animate-pulse">● Recording</span>
            )}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
