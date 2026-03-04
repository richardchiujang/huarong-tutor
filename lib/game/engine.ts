import { Piece, Position, BOARD_WIDTH, BOARD_HEIGHT } from './types';

// Check if a position is within bounds
export function isWithinBounds(pos: Position, width: number, height: number): boolean {
  return (
    pos.x >= 0 &&
    pos.y >= 0 &&
    pos.x + width <= BOARD_WIDTH &&
    pos.y + height <= BOARD_HEIGHT
  );
}

// Check if a piece collides with any other piece
export function hasCollision(
  targetPiece: Piece,
  allPieces: Piece[],
  ignorePieceId?: string
): boolean {
  for (const other of allPieces) {
    if (ignorePieceId && other.id === ignorePieceId) continue;

    const isOverlapping =
      targetPiece.x < other.x + other.width &&
      targetPiece.x + targetPiece.width > other.x &&
      targetPiece.y < other.y + other.height &&
      targetPiece.y + targetPiece.height > other.y;

    if (isOverlapping) return true;
  }
  return false;
}

// Get valid moves for a piece
export function getValidMoves(piece: Piece, allPieces: Piece[]): Position[] {
  const moves: Position[] = [];
  const directions = [
    { x: 0, y: -1 }, // Up
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }, // Left
    { x: 1, y: 0 },  // Right
  ];

  for (const dir of directions) {
    // 1. 嘗試單步移動 (對應 Ctrl + 方向鍵)
    const singleStepPos = calculateMovePosition(piece, dir, allPieces, true);
    if (singleStepPos.x !== piece.x || singleStepPos.y !== piece.y) {
      moves.push(singleStepPos);
    }

    // 2. 嘗試滑動到底 (對應普通方向鍵)
    const slidePos = calculateMovePosition(piece, dir, allPieces, false);
    
    // 如果滑動的位置有效，且與單步移動的位置不同（避免重複），則加入
    if ((slidePos.x !== piece.x || slidePos.y !== piece.y) && 
        (slidePos.x !== singleStepPos.x || slidePos.y !== singleStepPos.y)) {
      moves.push(slidePos);
    }
  }

  return moves;
}

// Check win condition (Cao Cao at bottom center)
export function checkWin(pieces: Piece[]): boolean {
  const cao = pieces.find((p) => p.type === 'cao-cao');
  if (!cao) return false;
  // Cao Cao (2x2) needs to be at (1, 3) to cover (1,3), (2,3), (1,4), (2,4)
  // Wait, board is 0-4. Bottom row is 4.
  // Cao Cao top-left at (1,3) means it occupies x:1-2, y:3-4.
  // That is the exit.
  return cao.x === 1 && cao.y === 3;
}

// 計算棋子在特定方向上的最終位置
// 支援滑動到底 (預設) 或單步移動 (當 singleStep 為 true 時)
export function calculateMovePosition(
  piece: Piece,
  direction: Position,
  allPieces: Piece[],
  singleStep: boolean = false
): Position {
  let currentPos = { x: piece.x, y: piece.y };

  while (true) {
    const nextPos = { x: currentPos.x + direction.x, y: currentPos.y + direction.y };
    const testPiece = { ...piece, ...nextPos };

    if (isWithinBounds(nextPos, piece.width, piece.height) && !hasCollision(testPiece, allPieces, piece.id)) {
      currentPos = nextPos;
      if (singleStep) break;
    } else {
      break;
    }
  }

  return currentPos;
}
