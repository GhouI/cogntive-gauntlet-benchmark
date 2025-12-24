// ============================================================================
// MULTI-STAGE CONFIGURATION
// ============================================================================

import type { Stage } from '../types/index.js';

// ----------------------------------------------------------------------------
// Stage Definitions
// ----------------------------------------------------------------------------

export const STAGES: Stage[] = [
  {
    number: 1,
    name: 'The Awakening',
    voidPattern: 'scattered',
    hasBoss: false,
  },
  {
    number: 2,
    name: 'The Labyrinth',
    voidPattern: 'corridor',
    hasBoss: false,
  },
  {
    number: 3,
    name: 'The Maze',
    voidPattern: 'maze',
    hasBoss: false,
  },
  {
    number: 4,
    name: 'The Final Stand',
    voidPattern: 'fortress',
    hasBoss: true,
  },
];

export const TOTAL_STAGES = STAGES.length;

// ----------------------------------------------------------------------------
// Stage Bonuses
// ----------------------------------------------------------------------------

export const STAGE_COMPLETION_BONUS: Record<number, number> = {
  1: 100,
  2: 200,
  3: 300,
  4: 400,
};

export const BOSS_DEFEAT_BONUS = 500;

// ----------------------------------------------------------------------------
// Get Stage by Number
// ----------------------------------------------------------------------------

export function getStage(stageNumber: number): Stage {
  const stage = STAGES.find(s => s.number === stageNumber);
  if (!stage) {
    throw new Error(`Invalid stage number: ${stageNumber}`);
  }
  return stage;
}

// ----------------------------------------------------------------------------
// Stage Seed Calculation
// ----------------------------------------------------------------------------

export function getStageSeed(baseSeed: number, stageNumber: number): number {
  return baseSeed + (stageNumber - 1);
}
