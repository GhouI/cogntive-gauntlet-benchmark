// ============================================================================
// SCORING SYSTEM - MULTI-STAGE
// ============================================================================

import type { 
  GameState, 
  GameScore, 
  SubScores, 
  MultiStageGameState,
} from '../types/index.js';
import { shortestPathDistance, GOAL, START } from './board.js';
import { STAGE_COMPLETION_BONUS, BOSS_DEFEAT_BONUS } from './stages.js';

// ----------------------------------------------------------------------------
// Score Calculation
// ----------------------------------------------------------------------------

/**
 * Calculate the complete score for a game
 * 
 * Formula from spec:
 * Score = (Progress * 10) + (Lives * 20) + (Complexity * 5) - (Errors)
 */
export function calculateScore(state: GameState): GameScore {
  // -------------------------------------------------------------------------
  // Progress Score
  // -------------------------------------------------------------------------
  // Based on shortest path distance traveled toward goal
  const startDistance = shortestPathDistance(START, GOAL, state.board.voids);
  const currentDistance = shortestPathDistance(state.currentPosition, GOAL, state.board.voids);
  
  // Progress is how much closer we got (0 to startDistance)
  // If we reached the goal, progress = startDistance
  const progress = state.won 
    ? startDistance 
    : Math.max(0, startDistance - currentDistance);
  
  // -------------------------------------------------------------------------
  // Lives Score
  // -------------------------------------------------------------------------
  const livesRemaining = state.lives;
  
  // -------------------------------------------------------------------------
  // Complexity Score
  // -------------------------------------------------------------------------
  // Based on average difficulty of questions answered correctly
  let totalDifficulty = 0;
  let questionsWithDifficulty = 0;
  
  for (const move of state.moveHistory) {
    if (move.question && move.correct) {
      totalDifficulty += move.question.difficulty;
      questionsWithDifficulty++;
    }
  }
  
  const complexity = questionsWithDifficulty > 0 
    ? totalDifficulty / questionsWithDifficulty 
    : 0;
  
  // -------------------------------------------------------------------------
  // Error Penalties
  // -------------------------------------------------------------------------
  // Errors = wrong answers + illegal moves + invalid JSON
  const errors = (state.questionsAnswered - state.questionsCorrect) 
    + state.illegalMoves 
    + state.invalidJsonCount;
  
  // -------------------------------------------------------------------------
  // Calculate Sub-Scores (0-100 scale)
  // -------------------------------------------------------------------------
  const subScores = calculateSubScores(state);
  
  // -------------------------------------------------------------------------
  // Final Score
  // -------------------------------------------------------------------------
  const total = Math.round(
    (progress * 10) + 
    (livesRemaining * 20) + 
    (complexity * 5) - 
    (errors * 10)
  );
  
  return {
    total: Math.max(0, total), // Don't go negative
    progress,
    livesRemaining,
    complexity: Math.round(complexity * 10) / 10,
    errors,
    subScores,
  };
}

// ----------------------------------------------------------------------------
// Sub-Score Calculation
// ----------------------------------------------------------------------------

function calculateSubScores(state: GameState): SubScores {
  // -------------------------------------------------------------------------
  // Planning Score (0-100)
  // -------------------------------------------------------------------------
  // Measures pathfinding efficiency
  // - Perfect score if reached goal in optimal moves
  // - Penalize backtracking and inefficient paths
  
  const optimalPathLength = shortestPathDistance(START, GOAL, state.board.voids);
  const actualMoves = state.moveHistory.filter(m => !m.illegal && !m.invalidJson && m.correct !== false).length;
  
  let planning: number;
  if (state.won) {
    // Reached goal - score based on efficiency
    if (actualMoves <= optimalPathLength) {
      planning = 100;
    } else {
      // Penalize extra moves
      const efficiency = optimalPathLength / actualMoves;
      planning = Math.round(efficiency * 100);
    }
  } else {
    // Didn't reach goal - partial credit based on progress
    const progressMade = shortestPathDistance(START, GOAL, state.board.voids) - 
                         shortestPathDistance(state.currentPosition, GOAL, state.board.voids);
    const progressRatio = progressMade / shortestPathDistance(START, GOAL, state.board.voids);
    planning = Math.round(progressRatio * 70); // Max 70 if didn't win
  }
  
  // -------------------------------------------------------------------------
  // Rule Adherence Score (0-100)
  // -------------------------------------------------------------------------
  // Measures compliance with game rules
  // - Valid JSON responses
  // - Legal moves
  
  const totalAttempts = state.moveHistory.length;
  const illegalAttempts = state.illegalMoves + state.invalidJsonCount;
  
  let ruleAdherence: number;
  if (totalAttempts === 0) {
    ruleAdherence = 0;
  } else {
    const validAttempts = totalAttempts - illegalAttempts;
    ruleAdherence = Math.round((validAttempts / totalAttempts) * 100);
  }
  
  // -------------------------------------------------------------------------
  // Domain Accuracy Score (0-100)
  // -------------------------------------------------------------------------
  // Measures question answering accuracy
  
  let domainAccuracy: number;
  if (state.questionsAnswered === 0) {
    domainAccuracy = 0;
  } else {
    domainAccuracy = Math.round((state.questionsCorrect / state.questionsAnswered) * 100);
  }
  
  return {
    planning: Math.min(100, Math.max(0, planning)),
    ruleAdherence: Math.min(100, Math.max(0, ruleAdherence)),
    domainAccuracy: Math.min(100, Math.max(0, domainAccuracy)),
  };
}

// ----------------------------------------------------------------------------
// Score Summary
// ----------------------------------------------------------------------------

export function getScoreSummary(score: GameScore): string {
  return [
    `Total Score: ${score.total}`,
    `Progress: ${score.progress} squares`,
    `Lives Remaining: ${score.livesRemaining}/5`,
    `Avg Complexity: ${score.complexity}`,
    `Errors: ${score.errors}`,
    `---`,
    `Planning: ${score.subScores.planning}%`,
    `Rule Adherence: ${score.subScores.ruleAdherence}%`,
    `Domain Accuracy: ${score.subScores.domainAccuracy}%`,
  ].join('\n');
}

// ----------------------------------------------------------------------------
// Multi-Stage Score Calculation
// ----------------------------------------------------------------------------

export interface MultiStageScore {
  totalScore: number;
  stageScores: number[];
  stageBonuses: number[];
  bossBonus: number;
  accuracy: number;
  planningScore: number;
  ruleScore: number;
}

export function calculateMultiStageScore(state: MultiStageGameState): MultiStageScore {
  let totalScore = 0;
  const stageScores: number[] = [];
  const stageBonuses: number[] = [];
  
  // Calculate score for each stage
  for (const stageResult of state.stages) {
    // Base score for the stage (simplified - based on progress and questions)
    const baseScore = stageResult.questionsCorrect * 20;
    stageScores.push(baseScore);
    stageBonuses.push(stageResult.bonus);
    totalScore += baseScore + stageResult.bonus;
  }
  
  // Boss bonus
  const bossBonus = state.bossDefeated ? BOSS_DEFEAT_BONUS : 0;
  totalScore += bossBonus;
  
  // Accuracy
  const accuracy = state.totalQuestionsAnswered > 0 
    ? Math.round((state.totalQuestionsCorrect / state.totalQuestionsAnswered) * 100)
    : 0;
  
  // Planning score (average across stages)
  let planningTotal = 0;
  let stagesWithPlanning = 0;
  for (const stageResult of state.stages) {
    if (stageResult.completed) {
      planningTotal += 100; // Full marks for completing
    } else {
      // Partial credit
      planningTotal += 50;
    }
    stagesWithPlanning++;
  }
  const planningScore = stagesWithPlanning > 0 
    ? Math.round(planningTotal / stagesWithPlanning)
    : 0;
  
  // Rule adherence (based on total errors across all stages)
  // Estimate from stage data
  let totalErrors = 0;
  for (const stageResult of state.stages) {
    totalErrors += stageResult.questionsAnswered - stageResult.questionsCorrect;
  }
  const ruleScore = state.totalTurns > 0
    ? Math.round(((state.totalTurns - totalErrors) / state.totalTurns) * 100)
    : 0;
  
  return {
    totalScore,
    stageScores,
    stageBonuses,
    bossBonus,
    accuracy,
    planningScore: Math.min(100, Math.max(0, planningScore)),
    ruleScore: Math.min(100, Math.max(0, ruleScore)),
  };
}
