'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Send, Bot, User, Sparkles, Loader2, Minimize2, Maximize2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CopilotPanel() {
  const { copilotOpen, toggleCopilot, chatMessages, addChatMessage, chatLoading, setChatLoading, clearChat } = useAppStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (copilotOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [copilotOpen]);

  const handleSend = async () => {
    if (!input.trim() || chatLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    addChatMessage(userMessage);
    setInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          history: chatMessages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('Chat request failed');

      const data = await response.json();

      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      });
    } catch {
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m currently experiencing connectivity issues. Please try again in a moment. In the meantime, you can explore the dashboard, business plans, financial forecasting, and agent modules directly.',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    'Analyze my current revenue trends',
    'Generate a SWOT analysis',
    'What are my key financial risks?',
    'Create a business plan outline',
    'How can I improve my burn rate?',
  ];

  if (!copilotOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-card/95 backdrop-blur-xl border-l border-border z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">GangNiaga AI Copilot</h3>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearChat}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleCopilot}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {chatMessages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                }`}>
                  {msg.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>
                <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 border border-border'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {chatLoading && (
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
          </div>

          {/* Suggestions */}
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

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask GangNiaga AI..."
              disabled={chatLoading}
              className="flex-1 bg-muted/30 border-border focus:border-emerald-500"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || chatLoading}
              size="icon"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shrink-0"
            >
              {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            GangNiaga AI Copilot — Autonomous Business Intelligence
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
