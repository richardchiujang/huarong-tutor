import { Piece } from '@/lib/game/types';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface GamePieceProps {
  piece: Piece;
  onSelect: (piece: Piece) => void;
  isSelected: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  movePiece: (piece: Piece, direction: 'up' | 'down' | 'left' | 'right') => void;
}

export function GamePiece({
  piece,
  onSelect,
  isSelected,
  canMoveUp,
  canMoveDown,
  canMoveLeft,
  canMoveRight,
  movePiece,
}: GamePieceProps) {
  // Calculate position percentage
  // Board is 4x5. Each cell is 25% width (relative to container) and 20% height.
  const left = `${piece.x * 25}%`;
  const top = `${piece.y * 20}%`;
  const width = `${piece.width * 25}%`;
  const height = `${piece.height * 20}%`;

  const getStyles = (type: string) => {
    switch (type) {
      case 'cao-cao':
        return 'bg-red-600 text-white border-red-800 z-10';
      case 'v-general':
      case 'h-general':
        return 'bg-stone-200 text-stone-700 border-stone-300';
      case 'soldier':
        return 'bg-stone-300 text-stone-700 border-stone-400';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <motion.div
      layout
      initial={false}
      animate={{ left, top }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'absolute p-1 box-border cursor-pointer touch-none',
      )}
      style={{ width, height }}
      onClick={() => onSelect(piece)}
    >
      <div
        className={cn(
          'w-full h-full rounded-lg border-b-4 flex items-center justify-center shadow-sm transition-all duration-200',
          getStyles(piece.type),
          isSelected ? 'ring-4 ring-blue-400/50 scale-[1.02] shadow-lg z-20' : 'hover:brightness-105'
        )}
      >
        <span className={cn(
          "font-bold select-none",
          piece.type === 'cao-cao' ? 'text-2xl' : 'text-lg'
        )}>
          {piece.label}
        </span>
        
        {/* Direction Indicators for Selected Piece - Clickable */}
        {isSelected && (
          <>
            {canMoveUp && (
              <div 
                className="absolute -top-6 left-0 w-full h-6 flex items-center justify-center cursor-pointer hover:bg-stone-200/50 rounded-t-sm"
                onClick={(e) => { e.stopPropagation(); movePiece(piece, 'up'); }}
              >
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-stone-800" />
              </div>
            )}
            {canMoveDown && (
              <div 
                className="absolute -bottom-6 left-0 w-full h-6 flex items-center justify-center cursor-pointer hover:bg-stone-200/50 rounded-b-sm"
                onClick={(e) => { e.stopPropagation(); movePiece(piece, 'down'); }}
              >
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-stone-800" />
              </div>
            )}
            {canMoveLeft && (
              <div 
                className="absolute top-0 -left-6 h-full w-6 flex items-center justify-center cursor-pointer hover:bg-stone-200/50 rounded-l-sm"
                onClick={(e) => { e.stopPropagation(); movePiece(piece, 'left'); }}
              >
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-stone-800" />
              </div>
            )}
            {canMoveRight && (
              <div 
                className="absolute top-0 -right-6 h-full w-6 flex items-center justify-center cursor-pointer hover:bg-stone-200/50 rounded-r-sm"
                onClick={(e) => { e.stopPropagation(); movePiece(piece, 'right'); }}
              >
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-stone-800" />
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
