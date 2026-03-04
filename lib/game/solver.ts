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
      const moves = getValidMoves(piece, pieces);
      
      for (const movePos of moves) {
        // Determine direction
        let direction: 'up' | 'down' | 'left' | 'right' | null = null;
        if (movePos.x === piece.x && movePos.y < piece.y) direction = 'up';
        else if (movePos.x === piece.x && movePos.y > piece.y) direction = 'down';
        else if (movePos.x < piece.x && movePos.y === piece.y) direction = 'left';
        else if (movePos.x > piece.x && movePos.y === piece.y) direction = 'right';

        if (direction) {
          // Apply move
          const newPieces = clonePieces(pieces);
          const movedPiece = newPieces.find(p => p.id === piece.id)!;
          movedPiece.x = movePos.x;
          movedPiece.y = movePos.y;

          const key = serialize(newPieces);
          if (!visited.has(key)) {
            visited.add(key);
            queue.push({
              pieces: newPieces,
              path: [...path, { pieceId: piece.id, direction }]
            });
          }
        }
      }
    }
  }

  return null;
}
