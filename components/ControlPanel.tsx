import { RotateCcw, Undo2, Redo2, HelpCircle } from 'lucide-react';

interface ControlPanelProps {
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function ControlPanel({ onUndo, onRedo, onReset, canUndo, canRedo }: ControlPanelProps) {
  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-white border-t border-stone-200">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-3 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-stone-700"
        title="Undo"
      >
        <Undo2 size={24} />
      </button>

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl font-medium transition-colors"
      >
        <RotateCcw size={18} />
        Reset
      </button>

      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-3 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-stone-700"
        title="Redo"
      >
        <Redo2 size={24} />
      </button>
    </div>
  );
}
