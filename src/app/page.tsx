'use client';

import { useAppStore } from '@/lib/store';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import DashboardModule from '@/components/modules/dashboard';
import BusinessPlansModule from '@/components/modules/business-plans';
import FinancialsModule from '@/components/modules/financials';
import AgentsModule from '@/components/modules/agents';
import WorkflowsModule from '@/components/modules/workflows';
import MemoryModule from '@/components/modules/memory';
import ReportsModule from '@/components/modules/reports';
import PlanActualsModule from '@/components/modules/plan-actuals';
import SettingsModule from '@/components/modules/settings';
import CopilotPanel from '@/components/modules/copilot';
import PitchDeckModule from '@/components/modules/pitch-deck';
import IdeaCanvasModule from '@/components/modules/idea-canvas';
import PlanReviewModule from '@/components/modules/plan-review';
import ResearchModule from '@/components/modules/research';
import CommandPalette from '@/components/layout/command-palette';
import { AnimatePresence, motion } from 'framer-motion';

const moduleComponents: Record<string, React.ComponentType> = {
  dashboard: DashboardModule,
  'business-plans': BusinessPlansModule,
  financials: FinancialsModule,
  agents: AgentsModule,
  workflows: WorkflowsModule,
  memory: MemoryModule,
  reports: ReportsModule,
  'plan-actuals': PlanActualsModule,
  settings: SettingsModule,
  'idea-canvas': IdeaCanvasModule,
  'plan-review': PlanReviewModule,
  'pitch-deck': PitchDeckModule,
  'research': ResearchModule,
};

export default function GangNiagaAIOS() {
  const { activeModule, copilotOpen } = useAppStore();
  const ActiveModule = moduleComponents[activeModule] || DashboardModule;

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <ActiveModule />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* AI Copilot Panel */}
      <AnimatePresence>
        {copilotOpen && <CopilotPanel />}
      </AnimatePresence>

      {/* Command Palette (Cmd+K) */}
      <CommandPalette />
    </div>
  );
}
