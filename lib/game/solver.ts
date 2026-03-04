import { Piece, Position, BOARD_WIDTH, BOARD_HEIGHT, INITIAL_PIECES } from './types';
import { getValidMoves, checkWin } from './engine';

// Serialize state to a canonical string for visited set
// We treat pieces of the same type and dimension as identical to reduce state space
// But we need to be careful: V-Generals are identical, Soldiers are identical.
// Cao Cao and H-General (only 1) are unique.
function serialize(pieces: Piece[]): string {
  // Create a 5x4 grid
  const grid = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill('.'));

  // Sort pieces to ensure canonical order for identical pieces?
  // Actually, filling the grid with types is enough.
  
  for (const p of pieces) {
    let char = '';
    if (p.type === 'cao-cao') char = 'C';
    else if (p.type === 'h-general') char = 'H';
    else if (p.type === 'v-general') char = 'V';
    else if (p.type === 'soldier') char = 'S';
    
    for (let y = 0; y < p.height; y++) {
      for (let x = 0; x < p.width; x++) {
        grid[p.y + y][p.x + x] = char;
      }
    }
  }

  return grid.map(row => row.join('')).join('');
}

// Deep clone pieces
function clonePieces(pieces: Piece[]): Piece[] {
  return pieces.map(p => ({ ...p }));
}

interface Node {
  pieces: Piece[];
  path: { pieceId: string, direction: 'up' | 'down' | 'left' | 'right' }[];
}

// BFS Solver
// Returns a sequence of moves to reach the goal
// This can be slow, so it should be used carefully or with a max depth/time
export function solvePuzzle(initialPieces: Piece[], maxNodes = 30000): { pieceId: string, direction: 'up' | 'down' | 'left' | 'right' }[] | null {
  const startKey = serialize(initialPieces);
  const queue: Node[] = [{ pieces: initialPieces, path: [] }];
  const visited = new Set<string>();
  visited.add(startKey);

  let nodesExplored = 0;

  while (queue.length > 0) {
    const { pieces, path } = queue.shift()!;
    nodesExplored++;

    if (checkWin(pieces)) {
      return path;
    }

    if (nodesExplored > maxNodes) {
      console.warn("Solver exceeded max nodes");
      return null;
    }

    // Generate moves
    for (const piece of pieces) {
      // 獲取該棋子能到達的所有合法目標位置
      const moves = getValidMoves(piece, pieces);
      
      for (const movePos of moves) {
        // 判對移動方向
        let direction: 'up' | 'down' | 'left' | 'right' | null = null;
        if (movePos.x === piece.x && movePos.y < piece.y) direction = 'up';
        else if (movePos.x === piece.x && movePos.y > piece.y) direction = 'down';
        else if (movePos.x < piece.x && movePos.y === piece.y) direction = 'left';
        else if (movePos.x > piece.x && movePos.y === piece.y) direction = 'right';

        if (direction) {
          // ⚠️ 關鍵修復：
          // getValidMoves 可能回傳多步移動的結果（如滑到底）。
          // 但 demo 的循環邏輯每次只移動 1 個單位 (dx/dy = +/-1)。
          // 我們需要將「長距離移動」拆解為多個單步移動，
          // 確保 demo 演示時能保持一致的步率與狀態檢查。
          
          const steps = Math.abs(movePos.x - piece.x) + Math.abs(movePos.y - piece.y);
          const currentPath = [...path];
          let currentPieces = clonePieces(pieces);

          for (let s = 1; s <= steps; s++) {
            const stepX = piece.x + (s * (movePos.x - piece.x) / steps);
            const stepY = piece.y + (s * (movePos.y - piece.y) / steps);
            
            currentPieces = currentPieces.map(p => 
              p.id === piece.id ? { ...p, x: stepX, y: stepY } : p
            );
            currentPath.push({ pieceId: piece.id, direction });
          }

          const key = serialize(currentPieces);
          if (!visited.has(key)) {
            visited.add(key);
            queue.push({
              pieces: currentPieces,
              path: currentPath
            });
          }
        }
      }
    }
  }

  return null;
}
