// ============================================================================
// BOARD GENERATION
// ============================================================================

import type { 
  Board, 
  Square, 
  Coordinate, 
  Column, 
  Row, 
  Domain, 
  Tier,
  VoidPattern,
} from '../types/index.js';

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------

export const COLUMNS: Column[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export const ROWS: Row[] = [1, 2, 3, 4, 5, 6, 7, 8];
export const DOMAINS: Domain[] = ['math', 'physics', 'code', 'logic', 'medicine'];
export const START: Coordinate = 'A1';
export const GOAL: Coordinate = 'H8';

// ----------------------------------------------------------------------------
// Seeded Random Number Generator (Mulberry32)
// ----------------------------------------------------------------------------

export function createRNG(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ----------------------------------------------------------------------------
// Coordinate Utilities
// ----------------------------------------------------------------------------

export function parseCoordinate(coord: string): { col: Column; row: Row } | null {
  const match = coord.match(/^([A-H])([1-8])$/i);
  if (!match) return null;
  return {
    col: match[1].toUpperCase() as Column,
    row: parseInt(match[2]) as Row,
  };
}

export function makeCoordinate(col: Column, row: Row): Coordinate {
  return `${col}${row}` as Coordinate;
}

export function isValidCoordinate(coord: string): coord is Coordinate {
  return parseCoordinate(coord) !== null;
}

export function getColIndex(col: Column): number {
  return COLUMNS.indexOf(col);
}

export function getRowIndex(row: Row): number {
  return ROWS.indexOf(row);
}

export function getAllCoordinates(): Coordinate[] {
  const coords: Coordinate[] = [];
  for (const col of COLUMNS) {
    for (const row of ROWS) {
      coords.push(makeCoordinate(col, row));
    }
  }
  return coords;
}

// ----------------------------------------------------------------------------
// Distance Calculation (Manhattan)
// ----------------------------------------------------------------------------

export function manhattanDistance(from: Coordinate, to: Coordinate): number {
  const fromParsed = parseCoordinate(from)!;
  const toParsed = parseCoordinate(to)!;
  const colDist = Math.abs(getColIndex(fromParsed.col) - getColIndex(toParsed.col));
  const rowDist = Math.abs(getRowIndex(fromParsed.row) - getRowIndex(toParsed.row));
  return colDist + rowDist;
}

// ----------------------------------------------------------------------------
// Shortest Path Distance (BFS avoiding voids)
// ----------------------------------------------------------------------------

export function shortestPathDistance(
  from: Coordinate, 
  to: Coordinate, 
  voids: Set<Coordinate>
): number {
  if (from === to) return 0;
  
  const queue: [Coordinate, number][] = [[from, 0]];
  const visited = new Set<Coordinate>([from]);
  
  while (queue.length > 0) {
    const [current, dist] = queue.shift()!;
    const parsed = parseCoordinate(current)!;
    const colIdx = getColIndex(parsed.col);
    const rowIdx = getRowIndex(parsed.row);
    
    // Check all 8 directions (including diagonals for accurate pathfinding)
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1],  // orthogonal
      [-1, -1], [-1, 1], [1, -1], [1, 1]  // diagonal
    ];
    
    for (const [dc, dr] of directions) {
      const newColIdx = colIdx + dc;
      const newRowIdx = rowIdx + dr;
      
      if (newColIdx >= 0 && newColIdx < 8 && newRowIdx >= 0 && newRowIdx < 8) {
        const newCoord = makeCoordinate(COLUMNS[newColIdx], ROWS[newRowIdx]);
        
        if (newCoord === to) {
          return dist + 1;
        }
        
        if (!visited.has(newCoord) && !voids.has(newCoord)) {
          visited.add(newCoord);
          queue.push([newCoord, dist + 1]);
        }
      }
    }
  }
  
  // No path found (shouldn't happen with reasonable void placement)
  return Infinity;
}

// ----------------------------------------------------------------------------
// Get Adjacent Coordinates
// ----------------------------------------------------------------------------

export function getAdjacentCoordinates(coord: Coordinate): Coordinate[] {
  const parsed = parseCoordinate(coord)!;
  const colIdx = getColIndex(parsed.col);
  const rowIdx = getRowIndex(parsed.row);
  const adjacent: Coordinate[] = [];
  
  // All 8 directions
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],  // orthogonal
    [-1, -1], [-1, 1], [1, -1], [1, 1]  // diagonal
  ];
  
  for (const [dc, dr] of directions) {
    const newColIdx = colIdx + dc;
    const newRowIdx = rowIdx + dr;
    
    if (newColIdx >= 0 && newColIdx < 8 && newRowIdx >= 0 && newRowIdx < 8) {
      adjacent.push(makeCoordinate(COLUMNS[newColIdx], ROWS[newRowIdx]));
    }
  }
  
  return adjacent;
}

// ----------------------------------------------------------------------------
// Void Pattern Generators
// ----------------------------------------------------------------------------

/**
 * Scattered: Random voids spread across the board
 */
function generateScatteredVoids(rng: () => number): Set<Coordinate> {
  const voids = new Set<Coordinate>();
  const available: Coordinate[] = [];
  
  for (const col of COLUMNS) {
    for (const row of ROWS) {
      const coord = makeCoordinate(col, row);
      if (coord !== START && coord !== GOAL) {
        available.push(coord);
      }
    }
  }
  
  // Shuffle
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }
  
  // Pick 8 voids, ensuring path exists
  for (const coord of available) {
    if (voids.size >= 8) break;
    voids.add(coord);
    if (shortestPathDistance(START, GOAL, voids) === Infinity) {
      voids.delete(coord);
    }
  }
  
  return voids;
}

/**
 * Corridor: Voids create narrow pathways
 */
function generateCorridorVoids(rng: () => number): Set<Coordinate> {
  const voids = new Set<Coordinate>();
  const barrierCols: Column[] = ['C', 'E', 'G'];
  
  for (const col of barrierCols) {
    const rowsToBlock = [2, 3, 4, 5, 6, 7] as Row[];
    
    // Shuffle
    for (let i = rowsToBlock.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [rowsToBlock[i], rowsToBlock[j]] = [rowsToBlock[j], rowsToBlock[i]];
    }
    
    // Block 4 of the 6 middle rows
    for (let i = 0; i < 4; i++) {
      const coord = makeCoordinate(col, rowsToBlock[i]);
      voids.add(coord);
      if (shortestPathDistance(START, GOAL, voids) === Infinity) {
        voids.delete(coord);
      }
    }
  }
  
  return voids;
}

/**
 * Maze: Complex pattern with dead ends
 */
function generateMazeVoids(rng: () => number): Set<Coordinate> {
  const voids = new Set<Coordinate>();
  
  const lShapes: Coordinate[][] = [
    ['B6', 'B7', 'C7'] as Coordinate[],
    ['D4', 'E4', 'E5'] as Coordinate[],
    ['F6', 'G6', 'G7'] as Coordinate[],
    ['C2', 'D2', 'D3'] as Coordinate[],
  ];
  
  // Shuffle
  for (let i = lShapes.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [lShapes[i], lShapes[j]] = [lShapes[j], lShapes[i]];
  }
  
  const numShapes = 2 + Math.floor(rng() * 2);
  for (let i = 0; i < numShapes; i++) {
    for (const coord of lShapes[i]) {
      if (coord !== START && coord !== GOAL) {
        voids.add(coord);
        if (shortestPathDistance(START, GOAL, voids) === Infinity) {
          voids.delete(coord);
        }
      }
    }
  }
  
  // Add extra random voids
  const available: Coordinate[] = [];
  for (const col of COLUMNS) {
    for (const row of ROWS) {
      const coord = makeCoordinate(col, row);
      if (coord !== START && coord !== GOAL && !voids.has(coord)) {
        available.push(coord);
      }
    }
  }
  
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }
  
  const extraVoids = 2 + Math.floor(rng() * 3);
  for (let i = 0; i < extraVoids && i < available.length; i++) {
    voids.add(available[i]);
    if (shortestPathDistance(START, GOAL, voids) === Infinity) {
      voids.delete(available[i]);
    }
  }
  
  return voids;
}

/**
 * Fortress: Voids protect the boss at H8
 */
function generateFortressVoids(rng: () => number): Set<Coordinate> {
  const voids = new Set<Coordinate>();
  
  // Inner fortress wall
  const innerWall: Coordinate[] = ['F7', 'F8', 'G6', 'H6'] as Coordinate[];
  const outerDefense: Coordinate[] = ['E6', 'E7', 'E8', 'D7', 'D8'] as Coordinate[];
  
  // Add inner wall
  for (const coord of innerWall) {
    if (coord !== GOAL) {
      voids.add(coord);
      if (shortestPathDistance(START, GOAL, voids) === Infinity) {
        voids.delete(coord);
      }
    }
  }
  
  // Shuffle and add some outer defense
  for (let i = outerDefense.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [outerDefense[i], outerDefense[j]] = [outerDefense[j], outerDefense[i]];
  }
  
  const numOuter = 2 + Math.floor(rng() * 2);
  for (let i = 0; i < numOuter; i++) {
    voids.add(outerDefense[i]);
    if (shortestPathDistance(START, GOAL, voids) === Infinity) {
      voids.delete(outerDefense[i]);
    }
  }
  
  // Scattered voids in rest of board
  const available: Coordinate[] = [];
  for (const col of COLUMNS.slice(0, 5)) {
    for (const row of ROWS) {
      const coord = makeCoordinate(col, row);
      if (coord !== START && !voids.has(coord)) {
        available.push(coord);
      }
    }
  }
  
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }
  
  const extraVoids = 3 + Math.floor(rng() * 2);
  for (let i = 0; i < extraVoids && i < available.length; i++) {
    voids.add(available[i]);
    if (shortestPathDistance(START, GOAL, voids) === Infinity) {
      voids.delete(available[i]);
    }
  }
  
  return voids;
}

/**
 * Generate voids based on pattern type
 */
export function generateVoidsByPattern(
  pattern: VoidPattern, 
  rng: () => number
): Set<Coordinate> {
  switch (pattern) {
    case 'scattered':
      return generateScatteredVoids(rng);
    case 'corridor':
      return generateCorridorVoids(rng);
    case 'maze':
      return generateMazeVoids(rng);
    case 'fortress':
      return generateFortressVoids(rng);
    default:
      return generateScatteredVoids(rng);
  }
}

// ----------------------------------------------------------------------------
// Board Generation (Original - scattered pattern)
// ----------------------------------------------------------------------------

export function generateBoard(seed?: number): Board {
  const actualSeed = seed ?? Math.floor(Math.random() * 1000000);
  const rng = createRNG(actualSeed);
  
  const voids = generateScatteredVoids(rng);
  
  return createBoardWithVoids(actualSeed, voids, rng);
}

// ----------------------------------------------------------------------------
// Board Generation with Pattern (Multi-stage)
// ----------------------------------------------------------------------------

export function generateStageBoard(seed: number, pattern: VoidPattern): Board {
  const rng = createRNG(seed);
  const voids = generateVoidsByPattern(pattern, rng);
  
  // Create new RNG for domain assignment (to keep it deterministic)
  const domainRng = createRNG(seed + 1000);
  
  return createBoardWithVoids(seed, voids, domainRng);
}

// ----------------------------------------------------------------------------
// Create Board with Given Voids
// ----------------------------------------------------------------------------

function createBoardWithVoids(
  seed: number, 
  voids: Set<Coordinate>, 
  rng: () => number
): Board {
  const squares = new Map<Coordinate, Square>();
  const allCoords = getAllCoordinates();
  
  for (const coord of allCoords) {
    let domain: Domain | 'void' | 'start' | 'goal';
    let tier: Tier | null = null;
    let difficulty = 0;
    let questionId: string | null = null;
    
    if (coord === START) {
      domain = 'start';
    } else if (coord === GOAL) {
      domain = 'goal';
    } else if (voids.has(coord)) {
      domain = 'void';
    } else {
      // Assign domain based on weighted random
      domain = DOMAINS[Math.floor(rng() * DOMAINS.length)];
      
      // ALL TIER 3 - Maximum difficulty for multi-stage
      tier = 3;
      difficulty = Math.floor(rng() * 3) + 8; // 8-10
      
      questionId = `${domain}-${tier}-${coord}`;
    }
    
    squares.set(coord, {
      coordinate: coord,
      domain,
      tier,
      difficulty,
      questionId,
    });
  }
  
  return {
    seed,
    squares,
    voids,
  };
}

// ----------------------------------------------------------------------------
// Board Visualization (for debugging)
// ----------------------------------------------------------------------------

export function visualizeBoard(board: Board, stageName?: string): string {
  const lines: string[] = [];
  
  if (stageName) {
    lines.push(`  Stage: ${stageName} (Seed: ${board.seed})`);
    lines.push('');
  }
  
  lines.push('    A   B   C   D   E   F   G   H');
  lines.push('  +---+---+---+---+---+---+---+---+');
  
  for (let row = 8; row >= 1; row--) {
    let line = `${row} |`;
    for (const col of COLUMNS) {
      const coord = makeCoordinate(col, row as Row);
      const square = board.squares.get(coord)!;
      
      let symbol: string;
      switch (square.domain) {
        case 'start': symbol = ' S '; break;
        case 'goal': symbol = ' G '; break;
        case 'void': symbol = ' X '; break;
        case 'math': symbol = ' M '; break;
        case 'physics': symbol = ' P '; break;
        case 'code': symbol = ' C '; break;
        case 'logic': symbol = ' L '; break;
        case 'medicine': symbol = ' D '; break;
        default: symbol = ' ? ';
      }
      line += symbol + '|';
    }
    lines.push(line);
    lines.push('  +---+---+---+---+---+---+---+---+');
  }
  
  lines.push('');
  lines.push('Legend: S=Start, G=Goal, X=Void, M=Math, P=Physics, C=Code, L=Logic, D=Medicine');
  
  return lines.join('\n');
}

// ----------------------------------------------------------------------------
// Board Visualization with Current Position (for model prompts)
// ----------------------------------------------------------------------------

/**
 * Visualize board with current position marked with *
 * e.g., if position is C4 with Math domain, shows *M* instead of  M 
 */
export function visualizeBoardWithPosition(board: Board, currentPosition: Coordinate): string {
  const lines: string[] = [];
  
  lines.push('    A   B   C   D   E   F   G   H');
  lines.push('  +---+---+---+---+---+---+---+---+');
  
  for (let row = 8; row >= 1; row--) {
    let line = `${row} |`;
    for (const col of COLUMNS) {
      const coord = makeCoordinate(col, row as Row);
      const square = board.squares.get(coord)!;
      const isCurrentPosition = coord === currentPosition;
      
      let symbol: string;
      switch (square.domain) {
        case 'start': symbol = isCurrentPosition ? '*S*' : ' S '; break;
        case 'goal': symbol = isCurrentPosition ? '*G*' : ' G '; break;
        case 'void': symbol = ' X '; break;
        case 'math': symbol = isCurrentPosition ? '*M*' : ' M '; break;
        case 'physics': symbol = isCurrentPosition ? '*P*' : ' P '; break;
        case 'code': symbol = isCurrentPosition ? '*C*' : ' C '; break;
        case 'logic': symbol = isCurrentPosition ? '*L*' : ' L '; break;
        case 'medicine': symbol = isCurrentPosition ? '*D*' : ' D '; break;
        default: symbol = ' ? ';
      }
      line += symbol + '|';
    }
    lines.push(line);
    lines.push('  +---+---+---+---+---+---+---+---+');
  }
  
  lines.push('');
  lines.push('Legend: S=Start, G=Goal, X=Void (impassable), M=Math, P=Physics, C=Code, L=Logic, D=Medicine');
  lines.push('Your position is marked with * (e.g., *M* means you are on a Math square)');
  
  return lines.join('\n');
}
