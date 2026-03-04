import { useState, useEffect, useCallback } from 'react';
import { GamePiece } from './GamePiece';
import { Piece, GameState, INITIAL_PIECES, BOARD_WIDTH, BOARD_HEIGHT } from '@/lib/game/types';
import { getValidMoves, checkWin, calculateMovePosition } from '@/lib/game/engine';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  gameState: GameState;
  onMove: (newPieces: Piece[]) => void;
  onSelectPiece: (piece: Piece | null) => void;
  selectedPieceId: string | null;
}

export function GameBoard({ gameState, onMove, onSelectPiece, selectedPieceId }: GameBoardProps) {
  const { pieces } = gameState;
  const [isLeftMouseDown, setIsLeftMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) setIsLeftMouseDown(true);
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) setIsLeftMouseDown(false);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMove = useCallback((piece: Piece, direction: 'up' | 'down' | 'left' | 'right', isSingleStepOverride?: boolean) => {
    const dx = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
    const dy = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;

    const dir = { x: dx, y: dy };
    const singleStep = isSingleStepOverride ?? isLeftMouseDown;
    
    // 使用 engine 邏輯計算最終位置
    const targetPos = calculateMovePosition(piece, dir, pieces, singleStep);

    if (targetPos.x === piece.x && targetPos.y === piece.y) return;

    const newPiece = { ...piece, x: targetPos.x, y: targetPos.y };
    const newPieces = pieces.map(p => p.id === piece.id ? newPiece : p);
    
    onMove(newPieces);
  }, [pieces, onMove, isLeftMouseDown]);

  // Handle keyboard navigation globally for the board if a piece is selected
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPieceId) return;
      
      const piece = pieces.find(p => p.id === selectedPieceId);
      if (!piece) return;

      const key = e.key.toLowerCase();
      // 雙重判定：按住 Shift 鍵 OR 瀏覽器偵測到左鍵被按住 (e.buttons === 1)
      const isSingleStep = e.shiftKey || isLeftMouseDown;

      switch(key) {
        case 'w':
          e.preventDefault(); 
          handleMove(piece, 'up', isSingleStep);
          break;
        case 's':
          e.preventDefault(); 
          handleMove(piece, 'down', isSingleStep);
          break;
        case 'a':
          e.preventDefault(); 
          handleMove(piece, 'left', isSingleStep);
          break;
        case 'd':
          e.preventDefault(); 
          handleMove(piece, 'right', isSingleStep);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [selectedPieceId, pieces, handleMove, isLeftMouseDown]);


  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[400px]">
      <div 
        className="relative bg-stone-800 rounded-xl shadow-2xl border-4 border-stone-700 overflow-hidden w-full"
        style={{ 
          aspectRatio: `${BOARD_WIDTH}/${BOARD_HEIGHT}` 
        }}
      >
        {/* Grid Background (Optional) */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-5 pointer-events-none opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="border border-white/20" />
          ))}
        </div>

        {/* Exit Marker */}
        <div className="absolute bottom-0 left-1/4 w-2/4 h-2 bg-green-500/30 rounded-t-lg z-0 animate-pulse" />

        {pieces.map((piece) => {
          const moves = getValidMoves(piece, pieces);
          const canMoveUp = moves.some(m => m.y < piece.y);
          const canMoveDown = moves.some(m => m.y > piece.y);
          const canMoveLeft = moves.some(m => m.x < piece.x);
          const canMoveRight = moves.some(m => m.x > piece.x);

          return (
            <GamePiece
              key={piece.id}
              piece={piece}
              onSelect={onSelectPiece}
              isSelected={selectedPieceId === piece.id}
              canMoveUp={canMoveUp}
              canMoveDown={canMoveDown}
              canMoveLeft={canMoveLeft}
              canMoveRight={canMoveRight}
              movePiece={handleMove}
            />
          );
        })}
      </div>

      {/* 操作說明文字 - 放在容器內但遊戲板外 */}
      <div className="text-stone-500 text-xs flex flex-col gap-1 items-center bg-stone-100/10 p-2 rounded-lg border border-stone-200/20 w-full animate-in fade-in slide-in-from-top-2 duration-500">
        <p className="font-semibold text-stone-400">操作說明</p>
        <div className="flex gap-4">
          <p>• WASD：滑動到底</p>
          <p>• 左鍵按住 + WASD：單步移動</p>
        </div>
      </div>
    </div>
  );
}
