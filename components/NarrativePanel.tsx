import { TutorialPhase } from '@/lib/game/tutorial';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, AlertTriangle, Eye, Target, BookOpen, PlayCircle } from 'lucide-react';

interface NarrativePanelProps {
  phase: TutorialPhase;
  stepCount: number;
  onAskAI: () => void;
  onDemoPhase: () => void;
  isAiLoading: boolean;
  isDemoing: boolean;
  aiHint: string | null;
}

export function NarrativePanel({ phase, stepCount, onAskAI, onDemoPhase, isAiLoading, isDemoing, aiHint }: NarrativePanelProps) {
  return (
    <div className="h-full flex flex-col bg-stone-50 border-l border-stone-200 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-stone-200 bg-white">
        <div className="flex items-center gap-2 text-stone-500 text-sm font-mono mb-2">
          <BookOpen size={16} />
          <span>戰術指導</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-stone-900 leading-tight">
          {phase.title}
        </h2>
      </div>

      {/* Phase Content */}
      <div className="p-6 space-y-6 flex-1">
        {/* Goal */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm uppercase tracking-wider">
            <Target size={16} />
            當前戰略
          </div>
          <p className="text-lg text-stone-800 font-medium leading-relaxed">
            {phase.goal}
          </p>
        </div>

        {/* Key Idea */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-2">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
            <Lightbulb size={16} />
            兵法核心
          </div>
          <p className="text-stone-700 text-sm leading-relaxed">
            {phase.keyIdea}
          </p>
        </div>

        {/* Observation */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-stone-500 font-bold text-xs uppercase tracking-wider">
            <Eye size={16} />
            戰場觀察
          </div>
          <p className="text-stone-600 text-sm italic">
            &quot;{phase.observation}&quot;
          </p>
        </div>

        {/* Trap */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 space-y-2">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle size={16} />
            兵家大忌
          </div>
          <p className="text-stone-700 text-sm leading-relaxed">
            {phase.trap}
          </p>
        </div>

        {/* AI Hint Section */}
        <div className="pt-6 border-t border-stone-200 space-y-3">
           <button
            onClick={onAskAI}
            disabled={isAiLoading}
            className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAiLoading ? (
              <span className="animate-pulse">軍師推演中...</span>
            ) : (
              <>
                <Lightbulb size={18} />
                尋求軍師妙計
              </>
            )}
          </button>

          <button
            onClick={onDemoPhase}
            disabled={isDemoing}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDemoing ? (
              <span className="animate-pulse">演示中...</span>
            ) : (
              <>
                <PlayCircle size={18} />
                演示本章通關
              </>
            )}
          </button>
          
          <AnimatePresence>
            {aiHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-white rounded-xl border border-stone-200 shadow-sm"
              >
                <div className="text-xs font-bold text-stone-400 uppercase mb-2">軍師曰：</div>
                <p className="text-stone-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {aiHint}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Footer */}
      <div className="p-6 bg-stone-100 border-t border-stone-200">
        <div className="flex justify-between text-xs font-mono text-stone-500 mb-2">
          <span>階段進度</span>
          <span>{Math.min(stepCount, phase.maxStep)} / {phase.maxStep}</span>
        </div>
        <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-stone-900"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (stepCount / 81) * 100)}%` }} // Overall progress
          />
        </div>
      </div>
    </div>
  );
}
