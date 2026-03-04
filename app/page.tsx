'use client';

import { useState, useEffect, useRef } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { NarrativePanel } from '@/components/NarrativePanel';
import { ControlPanel } from '@/components/ControlPanel';
import { SevenSegmentDisplay } from '@/components/SevenSegmentDisplay';
import { GameState, INITIAL_PIECES, Piece, TARGET_STEPS } from '@/lib/game/types';
import { checkWin, calculateMovePosition } from '@/lib/game/engine';
import { getCurrentPhase } from '@/lib/game/tutorial';
import { solvePuzzle } from '@/lib/game/solver';

export default function Home() {
  const [history, setHistory] = useState<{ pieces: Piece[], stepCount: number }[]>([
    { pieces: INITIAL_PIECES, stepCount: 0 }
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    pieces: INITIAL_PIECES,
    history: [], // Unused in this local state, managed separately
    historyIndex: 0,
    stepCount: 0,
    isComplete: false,
  });

  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isDemoing, setIsDemoing] = useState(false);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  
  // Ref to stop demo if needed
  const stopDemoRef = useRef(false);

  const currentPhase = getCurrentPhase(gameState.stepCount);

  const handleMove = (newPieces: Piece[]) => {
    if (gameState.isComplete || isDemoing) return;
    
    // ... (rest of handleMove logic)
    const newStepCount = gameState.stepCount + 1;
    const newHistoryEntry = { pieces: newPieces, stepCount: newStepCount };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newHistoryEntry);

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    const isWin = checkWin(newPieces);

    setGameState({
      pieces: newPieces,
      history: [],
      historyIndex: newHistory.length - 1,
      stepCount: newStepCount,
      isComplete: isWin,
    });
    
    setAiHint(null);
  };

  // Internal move handler for demo (bypasses isDemoing check)
  const applyDemoMove = (newPieces: Piece[]) => {
    // Use functional update to ensure we get the latest state even in a loop
    setHistory(prev => {
      const lastStepCount = prev.length > 0 ? prev[prev.length - 1].stepCount : 0;
      const newStepCount = lastStepCount + 1;
      return [...prev, { pieces: newPieces, stepCount: newStepCount }];
    });
    
    setHistoryIndex(prev => prev + 1);

    const isWin = checkWin(newPieces);

    setGameState(prev => ({
      pieces: newPieces,
      history: [],
      historyIndex: prev.historyIndex + 1,
      stepCount: prev.stepCount + 1,
      isComplete: isWin,
    }));
  };

  const handleDemoPhase = async () => {
    if (isDemoing) return;
    setIsDemoing(true);
    stopDemoRef.current = false;
    setAiHint("軍師正在推演最佳路徑...");

    // 1. Run Solver
    // We use a timeout to allow UI to render the loading state
    setTimeout(async () => {
      const solutionPath = solvePuzzle(gameState.pieces);
      
      if (!solutionPath) {
        setAiHint("軍師回報：此局勢複雜，暫時無法推演必勝路徑，請主公自行斟酌。");
        setIsDemoing(false);
        return;
      }

      setAiHint(`軍師回報：已發現通往勝利的 ${solutionPath.length} 步路徑。正在演示本章戰術...`);

      // 2. Determine how many steps to play
      // Play until the end of the current phase
      const targetStep = currentPhase.maxStep;
      const stepsToPlay = Math.min(solutionPath.length, targetStep - gameState.stepCount);
      
      // If we are already past the phase or close to it, maybe play at least 5 steps?
      // Or if stepsToPlay <= 0, play next phase?
      let actualStepsToPlay = stepsToPlay;
      if (actualStepsToPlay <= 0) {
         // We are at the end of a phase, let's play the NEXT phase
         // Find the next phase limit
         const nextPhase = getCurrentPhase(gameState.stepCount + 1);
         actualStepsToPlay = Math.min(solutionPath.length, nextPhase.maxStep - gameState.stepCount);
      }
      
      // Cap at reasonable number for a "demo" (e.g., 20 steps max) to avoid boring the user
      actualStepsToPlay = Math.min(actualStepsToPlay, 20);

      if (actualStepsToPlay <= 0) {
         setAiHint("主公已達本章目標，請繼續自行探索！");
         setIsDemoing(false);
         return;
      }

      // 3. Animate Moves
      let currentPieces = gameState.pieces;
      
      for (let i = 0; i < actualStepsToPlay; i++) {
        if (stopDemoRef.current) break;

        const move = solutionPath[i];
        const piece = currentPieces.find(p => p.id === move.pieceId);
        
        if (!piece) {
          console.error("Piece not found in demo:", move.pieceId);
          break;
        }
        
        const dx = move.direction === 'left' ? -1 : move.direction === 'right' ? 1 : 0;
        const dy = move.direction === 'up' ? -1 : move.direction === 'down' ? 1 : 0;
        
        const newX = piece.x + dx;
        const newY = piece.y + dy;
        
        // 建立一個新狀態，並將目標棋子移到新位置
        const newPieces = currentPieces.map(p => 
          p.id === move.pieceId ? { ...p, x: newX, y: newY } : p
        );
        
        applyDemoMove(newPieces);
        currentPieces = newPieces; // 重要：將更新後的棋子狀態傳入下一次迭代，避免堆疊時發生重疊問題

        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 400)); // 400ms per move
      }

      setIsDemoing(false);
      setAiHint(null);
    }, 100);
  };

  const handleUndo = () => {
    if (isDemoing) return;
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const entry = history[newIndex];
      setHistoryIndex(newIndex);
      setGameState({
        ...gameState,
        pieces: entry.pieces,
        stepCount: entry.stepCount,
        isComplete: false,
      });
    }
  };

  const handleRedo = () => {
    if (isDemoing) return;
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const entry = history[newIndex];
      setHistoryIndex(newIndex);
      setGameState({
        ...gameState,
        pieces: entry.pieces,
        stepCount: entry.stepCount,
        isComplete: checkWin(entry.pieces),
      });
    }
  };

  const handleReset = () => {
    if (isDemoing) {
      stopDemoRef.current = true;
      setIsDemoing(false);
    }
    const initialEntry = { pieces: INITIAL_PIECES, stepCount: 0 };
    setHistory([initialEntry]);
    setHistoryIndex(0);
    setGameState({
      pieces: INITIAL_PIECES,
      history: [],
      historyIndex: 0,
      stepCount: 0,
      isComplete: false,
    });
    setAiHint(null);
    setSelectedPieceId(null);
  };

  const handleAskAI = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pieces: gameState.pieces,
          stepCount: gameState.stepCount,
          phase: currentPhase,
        }),
      });
      const data = await response.json();
      setAiHint(data.hint);
    } catch (error) {
      console.error('Failed to get hint', error);
      setAiHint("主公，請先設法為曹操騰出空間。");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.isComplete || isDemoing || !selectedPieceId) return;

      let direction = { x: 0, y: 0 };
      if (e.key === 'ArrowUp') direction = { x: 0, y: -1 };
      else if (e.key === 'ArrowDown') direction = { x: 0, y: 1 };
      else if (e.key === 'ArrowLeft') direction = { x: -1, y: 0 };
      else if (e.key === 'ArrowRight') direction = { x: 1, y: 0 };
      else return;

      e.preventDefault();

      const piece = gameState.pieces.find(p => p.id === selectedPieceId);
      if (!piece) return;

      const targetPos = calculateMovePosition(
        piece,
        direction,
        gameState.pieces,
        e.ctrlKey
      );

      if (targetPos.x !== piece.x || targetPos.y !== piece.y) {
        const newPieces = gameState.pieces.map(p => 
          p.id === piece.id ? { ...p, ...targetPos } : p
        );
        handleMove(newPieces);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.pieces, selectedPieceId, isDemoing, gameState.isComplete, handleMove]);

  return (
    <main className="flex h-screen w-full bg-stone-100 overflow-hidden">
      {/* ... (Left Game Area) ... */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-6 md:p-8">
           <h1 className="text-3xl font-display font-bold text-stone-900 tracking-tight">
            華容道 <span className="text-stone-400">教練</span>
          </h1>
          
          <div className="flex items-center gap-4">
             <SevenSegmentDisplay 
                value={`${gameState.stepCount}/${TARGET_STEPS}`} 
                label="步數"
                color={gameState.stepCount > TARGET_STEPS ? 'warning' : 'default'}
             />
          </div>
        </div>

        {/* Board Container */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md aspect-[4/5] relative">
             <GameBoard 
                gameState={gameState} 
                onMove={handleMove} 
                onSelectPiece={(p) => !isDemoing && setSelectedPieceId(p?.id || null)}
                selectedPieceId={selectedPieceId}
             />
             
             {/* Win Overlay */}
             {gameState.isComplete && (
               <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
                 <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4 animate-in zoom-in duration-300">
                   <h2 className="text-3xl font-display font-bold text-emerald-600 mb-2">大獲全勝！</h2>
                   <p className="text-stone-600 mb-6">
                     主公已成功突圍！共用步數： <span className="font-mono font-bold text-stone-900">{gameState.stepCount}</span> 步。
                   </p>
                   <button 
                    onClick={handleReset}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
                   >
                     再戰一局
                   </button>
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Bottom Controls */}
        <ControlPanel 
          onUndo={handleUndo} 
          onRedo={handleRedo} 
          onReset={handleReset}
          canUndo={historyIndex > 0 && !isDemoing}
          canRedo={historyIndex < history.length - 1 && !isDemoing}
        />
      </div>

      {/* Right: Narrative Panel (Desktop) */}
      <div className="hidden lg:block w-[400px] h-full shadow-xl z-10">
        <NarrativePanel 
          phase={currentPhase} 
          stepCount={gameState.stepCount}
          onAskAI={handleAskAI}
          onDemoPhase={handleDemoPhase}
          isAiLoading={isAiLoading}
          isDemoing={isDemoing}
          aiHint={aiHint}
        />
      </div>
    </main>
  );
}
