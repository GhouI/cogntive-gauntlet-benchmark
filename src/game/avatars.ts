// ============================================================================
// AVATAR MOVEMENT SYSTEM
// ============================================================================

import type { Avatar, AvatarName, Board, Coordinate } from '../types/index.js';
import { 
  parseCoordinate, 
  makeCoordinate, 
  getColIndex, 
  getRowIndex,
  COLUMNS, 
  ROWS 
} from './board.js';

// ----------------------------------------------------------------------------
// Avatar Definitions
// ----------------------------------------------------------------------------

/**
 * Vector: Move exactly 2 squares orthogonally (up, down, left, right)
 */
function getVectorMoves(from: Coordinate, board: Board): Coordinate[] {
  const parsed = parseCoordinate(from)!;
  const colIdx = getColIndex(parsed.col);
  const rowIdx = getRowIndex(parsed.row);
  const moves: Coordinate[] = [];
  
  // Orthogonal directions, exactly 2 squares
  const directions = [
    [0, 2],   // up
    [0, -2],  // down
    [2, 0],   // right
    [-2, 0],  // left
  ];
  
  for (const [dc, dr] of directions) {
    const newColIdx = colIdx + dc;
    const newRowIdx = rowIdx + dr;
    
    if (newColIdx >= 0 && newColIdx < 8 && newRowIdx >= 0 && newRowIdx < 8) {
      const newCoord = makeCoordinate(COLUMNS[newColIdx], ROWS[newRowIdx]);
      // Can't move to void
      if (!board.voids.has(newCoord)) {
        moves.push(newCoord);
      }
    }
  }
  
  return moves;
}

/**
 * Bias: Move exactly 1 square diagonally
 */
function getBiasMoves(from: Coordinate, board: Board): Coordinate[] {
  const parsed = parseCoordinate(from)!;
  const colIdx = getColIndex(parsed.col);
  const rowIdx = getRowIndex(parsed.row);
  const moves: Coordinate[] = [];
  
  // Diagonal directions, exactly 1 square
  const directions = [
    [1, 1],   // up-right
    [1, -1],  // down-right
    [-1, 1],  // up-left
    [-1, -1], // down-left
  ];
  
  for (const [dc, dr] of directions) {
    const newColIdx = colIdx + dc;
    const newRowIdx = rowIdx + dr;
    
    if (newColIdx >= 0 && newColIdx < 8 && newRowIdx >= 0 && newRowIdx < 8) {
      const newCoord = makeCoordinate(COLUMNS[newColIdx], ROWS[newRowIdx]);
      if (!board.voids.has(newCoord)) {
        moves.push(newCoord);
      }
    }
  }
  
  return moves;
}

/**
 * Tensor: Move in L-shape (2 squares one direction, 1 square perpendicular)
 * Like a chess knight
 */
function getTensorMoves(from: Coordinate, board: Board): Coordinate[] {
  const parsed = parseCoordinate(from)!;
  const colIdx = getColIndex(parsed.col);
  const rowIdx = getRowIndex(parsed.row);
  const moves: Coordinate[] = [];
  
  // L-shape moves (knight moves)
  const directions = [
    [2, 1], [2, -1],   // right 2, up/down 1
    [-2, 1], [-2, -1], // left 2, up/down 1
    [1, 2], [-1, 2],   // up 2, left/right 1
    [1, -2], [-1, -2], // down 2, left/right 1
  ];
  
  for (const [dc, dr] of directions) {
    const newColIdx = colIdx + dc;
    const newRowIdx = rowIdx + dr;
    
    if (newColIdx >= 0 && newColIdx < 8 && newRowIdx >= 0 && newRowIdx < 8) {
      const newCoord = makeCoordinate(COLUMNS[newColIdx], ROWS[newRowIdx]);
      if (!board.voids.has(newCoord)) {
        moves.push(newCoord);
      }
    }
  }
  
  return moves;
}

/**
 * Scalar: Move exactly 1 square in any direction (including diagonal)
 */
function getScalarMoves(from: Coordinate, board: Board): Coordinate[] {
  const parsed = parseCoordinate(from)!;
  const colIdx = getColIndex(parsed.col);
  const rowIdx = getRowIndex(parsed.row);
  const moves: Coordinate[] = [];
  
  // All 8 directions, exactly 1 square
  const directions = [
    [0, 1], [0, -1],   // up, down
    [1, 0], [-1, 0],   // right, left
    [1, 1], [1, -1],   // up-right, down-right
    [-1, 1], [-1, -1], // up-left, down-left
  ];
  
  for (const [dc, dr] of directions) {
    const newColIdx = colIdx + dc;
    const newRowIdx = rowIdx + dr;
    
    if (newColIdx >= 0 && newColIdx < 8 && newRowIdx >= 0 && newRowIdx < 8) {
      const newCoord = makeCoordinate(COLUMNS[newColIdx], ROWS[newRowIdx]);
      if (!board.voids.has(newCoord)) {
        moves.push(newCoord);
      }
    }
  }
  
  return moves;
}

/**
 * Epoch: Move exactly 3 squares forward (toward row 8 only)
 */
function getEpochMoves(from: Coordinate, board: Board): Coordinate[] {
  const parsed = parseCoordinate(from)!;
  const colIdx = getColIndex(parsed.col);
  const rowIdx = getRowIndex(parsed.row);
  const moves: Coordinate[] = [];
  
  // Forward only (toward row 8), exactly 3 squares
  const newRowIdx = rowIdx + 3;
  
  if (newRowIdx >= 0 && newRowIdx < 8) {
    const newCoord = makeCoordinate(COLUMNS[colIdx], ROWS[newRowIdx]);
    if (!board.voids.has(newCoord)) {
      moves.push(newCoord);
    }
  }
  
  return moves;
}

// ----------------------------------------------------------------------------
// Avatar Registry
// ----------------------------------------------------------------------------

export const AVATARS: Record<AvatarName, Avatar> = {
  Vector: {
    name: 'Vector',
    description: 'Move exactly 2 squares orthogonally (up, down, left, right)',
    getValidMoves: getVectorMoves,
  },
  Bias: {
    name: 'Bias',
    description: 'Move exactly 1 square diagonally',
    getValidMoves: getBiasMoves,
  },
  Tensor: {
    name: 'Tensor',
    description: 'Move in L-shape (2 squares one direction, 1 square perpendicular)',
    getValidMoves: getTensorMoves,
  },
  Scalar: {
    name: 'Scalar',
    description: 'Move exactly 1 square in any direction (including diagonal)',
    getValidMoves: getScalarMoves,
  },
  Epoch: {
    name: 'Epoch',
    description: 'Move exactly 3 squares forward (toward row 8 only)',
    getValidMoves: getEpochMoves,
  },
};

export const AVATAR_NAMES: AvatarName[] = ['Vector', 'Bias', 'Tensor', 'Scalar', 'Epoch'];

// ----------------------------------------------------------------------------
// Avatar Utilities
// ----------------------------------------------------------------------------

export function isValidAvatarName(name: string): name is AvatarName {
  return AVATAR_NAMES.includes(name as AvatarName);
}

export function getAvailableAvatars(lastUsed: AvatarName | null): AvatarName[] {
  if (!lastUsed) {
    return [...AVATAR_NAMES];
  }
  return AVATAR_NAMES.filter(name => name !== lastUsed);
}

export function isValidMove(
  avatar: AvatarName,
  from: Coordinate,
  to: Coordinate,
  board: Board,
  lastUsedAvatar: AvatarName | null
): { valid: boolean; error?: string } {
  // Check cooldown
  if (lastUsedAvatar === avatar) {
    return { valid: false, error: `${avatar} is on cooldown (used last turn)` };
  }
  
  // Check if target is a void
  if (board.voids.has(to)) {
    return { valid: false, error: `Cannot move to void square ${to}` };
  }
  
  // Check if move is valid for avatar
  const validMoves = AVATARS[avatar].getValidMoves(from, board);
  if (!validMoves.includes(to)) {
    return { 
      valid: false, 
      error: `${avatar} cannot move from ${from} to ${to}. Valid moves: ${validMoves.join(', ') || 'none'}` 
    };
  }
  
  return { valid: true };
}
