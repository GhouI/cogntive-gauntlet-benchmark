// ============================================================================
// GAME LOGGER - Multi-Stage File-based logging
// ============================================================================

import * as fs from 'fs';
import * as path from 'path';
import type { 
  GameState, 
  VisibleState, 
  ParsedMove, 
  Question,
  Board,
  StageResult,
  BossFight,
  MultiStageGameState,
} from '../types/index.js';
import { getModelDisplayName } from '../config/models.js';
import { visualizeBoard } from '../game/board.js';

// ----------------------------------------------------------------------------
// Multi-Stage Logger Class
// ----------------------------------------------------------------------------

export class MultiStageLogger {
  private logPath: string;
  private buffer: string[] = [];
  
  /**
   * Create a new logger for a model run
   * @param modelId - The model identifier
   * @param baseSeed - The seed used for the run
   * @param runTimestamp - The timestamp for this benchmark run (shared across all models)
   * @param logsDir - Base logs directory (default: 'logs')
   */
  constructor(modelId: string, baseSeed: number, runTimestamp: string, logsDir = 'logs') {
    // Create run-specific folder: logs/2025-12-24_21-39-39/
    const runFolder = path.join(logsDir, runTimestamp);
    if (!fs.existsSync(runFolder)) {
      fs.mkdirSync(runFolder, { recursive: true });
    }
    
    // Simplified filename: model-name_seed.log (no timestamp since folder has it)
    const sanitizedModel = modelId.replace(/[/\\:*?"<>|]/g, '-');
    const filename = `${sanitizedModel}_${baseSeed}.log`;
    
    this.logPath = path.join(runFolder, filename);
  }
  
  // --------------------------------------------------------------------------
  // Internal Methods
  // --------------------------------------------------------------------------
  
  private write(text: string): void {
    this.buffer.push(text);
  }
  
  private writeLine(text = ''): void {
    this.buffer.push(text + '\n');
  }
  
  private writeDivider(char = '=', length = 80): void {
    this.writeLine(char.repeat(length));
  }
  
  // --------------------------------------------------------------------------
  // Header
  // --------------------------------------------------------------------------
  
  logHeader(modelId: string, baseSeed: number): void {
    this.writeDivider('=');
    this.writeLine('COGNITIVE GAUNTLET - MULTI-STAGE GAME LOG');
    this.writeDivider('=');
    this.writeLine(`Model: ${getModelDisplayName(modelId)}`);
    this.writeLine(`Model ID: ${modelId}`);
    this.writeLine(`Base Seed: ${baseSeed}`);
    this.writeLine(`Started: ${new Date().toISOString()}`);
    this.writeLine(`Mode: 4-Stage Challenge with Boss Fight`);
    this.writeDivider('=');
    this.writeLine();
  }
  
  // --------------------------------------------------------------------------
  // Stage Logging
  // --------------------------------------------------------------------------
  
  logStageStart(stageNumber: number, stageName: string, board: Board): void {
    this.writeLine();
    this.writeDivider('=');
    this.writeLine(`STAGE ${stageNumber}/4 - ${stageName.toUpperCase()}`);
    this.writeDivider('=');
    this.writeLine(`Board Seed: ${board.seed}`);
    this.writeLine(`Voids: ${board.voids.size} squares`);
    this.writeLine();
    this.writeLine('Board Layout:');
    this.writeLine(visualizeBoard(board));
    this.writeLine();
  }
  
  logStageEnd(stageNumber: number, state: GameState, result: StageResult): void {
    this.writeLine();
    this.writeDivider('-');
    this.writeLine(`STAGE ${stageNumber} COMPLETE`);
    this.writeDivider('-');
    this.writeLine(`Result: ${result.completed ? 'COMPLETED' : 'FAILED'}`);
    this.writeLine(`Final Position: ${result.finalPosition}`);
    this.writeLine(`Turns Used: ${result.turnsUsed}`);
    this.writeLine(`Questions: ${result.questionsCorrect}/${result.questionsAnswered}`);
    this.writeLine(`Lives Remaining: ${state.lives}/5`);
    if (result.bonus > 0) {
      this.writeLine(`Stage Bonus: +${result.bonus}`);
    }
    this.writeLine();
  }
  
  // --------------------------------------------------------------------------
  // Turn Logging
  // --------------------------------------------------------------------------
  
  logTurnStart(state: GameState, visible: VisibleState): void {
    this.writeLine(`--- STAGE ${visible.stage} | TURN ${state.turn} ---`);
    this.writeLine(`Position: ${state.currentPosition}`);
    this.writeLine(`Lives: ${state.lives}/5`);
    this.writeLine(`Distance to Goal: ${visible.distanceToGoal} squares`);
    this.writeLine(`Available Avatars: ${visible.availableAvatars.join(', ')}`);
    this.writeLine(`Last Used: ${state.lastUsedAvatar || 'None'}`);
    this.writeLine();
    this.writeLine('Visible Neighbors:');
    for (const neighbor of visible.visibleNeighbors) {
      this.writeLine(`  ${neighbor.coordinate}: [${neighbor.domain}]`);
    }
    this.writeLine();
  }
  
  logModelResponse(rawResponse: string, parsed: ParsedMove): void {
    this.writeLine('Model Response (raw):');
    this.writeLine('```');
    this.writeLine(rawResponse);
    this.writeLine('```');
    this.writeLine();
    
    this.writeLine('Parsed Move:');
    this.writeLine(`  Valid: ${parsed.valid}`);
    if (parsed.avatar) this.writeLine(`  Avatar: ${parsed.avatar}`);
    if (parsed.target) this.writeLine(`  Target: ${parsed.target}`);
    if (parsed.reasoning) {
      this.writeLine(`  Reasoning: ${parsed.reasoning.substring(0, 200)}${parsed.reasoning.length > 200 ? '...' : ''}`);
    }
    if (parsed.error) this.writeLine(`  Error: ${parsed.error}`);
    this.writeLine();
  }
  
  logInvalidJson(error: string, livesRemaining: number): void {
    this.writeLine('RESULT: INVALID JSON');
    this.writeLine(`Error: ${error}`);
    this.writeLine(`Penalty: -1 life`);
    this.writeLine(`Lives Remaining: ${livesRemaining}/5`);
    this.writeLine();
    this.writeDivider('-', 40);
    this.writeLine();
  }
  
  logIllegalMove(error: string, livesRemaining: number): void {
    this.writeLine('RESULT: ILLEGAL MOVE');
    this.writeLine(`Error: ${error}`);
    this.writeLine(`Penalty: -1 life`);
    this.writeLine(`Lives Remaining: ${livesRemaining}/5`);
    this.writeLine();
    this.writeDivider('-', 40);
    this.writeLine();
  }
  
  logQuestion(question: Question): void {
    this.writeLine('Question Received:');
    this.writeLine(`  Domain: ${question.domain.toUpperCase()}`);
    this.writeLine(`  Tier: ${question.tier}`);
    this.writeLine(`  Difficulty: ${question.difficulty}/10`);
    this.writeLine(`  Format: ${question.format}`);
    this.writeLine();
    this.writeLine('Question Text:');
    this.writeLine(question.question.split('\n').map(l => '  ' + l).join('\n'));
    this.writeLine();
  }
  
  logAnswer(
    modelAnswer: string, 
    correctAnswer: string, 
    isCorrect: boolean, 
    livesRemaining: number
  ): void {
    this.writeLine(`Model Answer: ${modelAnswer}`);
    this.writeLine(`Correct Answer: ${correctAnswer}`);
    this.writeLine();
    
    if (isCorrect) {
      this.writeLine('RESULT: CORRECT ✓');
      this.writeLine('Move successful - position updated');
    } else {
      this.writeLine('RESULT: INCORRECT ✗');
      this.writeLine('Penalty: -1 life, position unchanged');
    }
    this.writeLine(`Lives Remaining: ${livesRemaining}/5`);
    this.writeLine();
    this.writeDivider('-', 40);
    this.writeLine();
  }
  
  logGoalReached(stageNumber: number): void {
    this.writeLine(`*** STAGE ${stageNumber} GOAL REACHED - H8 ***`);
    if (stageNumber < 4) {
      this.writeLine('Advancing to next stage...');
    } else {
      this.writeLine('All stages complete! Entering BOSS FIGHT...');
    }
    this.writeLine();
  }
  
  logError(error: string): void {
    this.writeLine('!!! ERROR !!!');
    this.writeLine(error);
    this.writeLine('Benchmark stopped.');
    this.writeLine();
  }
  
  // --------------------------------------------------------------------------
  // Boss Fight Logging
  // --------------------------------------------------------------------------
  
  logBossFightStart(questions: Question[]): void {
    this.writeLine();
    this.writeDivider('*');
    this.writeLine('BOSS FIGHT - THE FINAL STAND');
    this.writeDivider('*');
    this.writeLine();
    this.writeLine('The Boss presents 3 questions that must ALL be answered correctly:');
    this.writeLine();
    
    questions.forEach((q, i) => {
      this.writeLine(`BOSS QUESTION ${i + 1} (${q.domain.toUpperCase()}):`);
      this.writeLine(q.question.split('\n').map(l => '  ' + l).join('\n'));
      this.writeLine(`  Answer Format: ${q.format}`);
      this.writeLine();
    });
  }
  
  logBossFightEnd(bossFight: BossFight): void {
    this.writeLine('Model Boss Fight Response:');
    this.writeLine(`  Reasoning: ${bossFight.modelReasoning.substring(0, 300)}${bossFight.modelReasoning.length > 300 ? '...' : ''}`);
    this.writeLine();
    
    this.writeLine('Results:');
    bossFight.questions.forEach((q, i) => {
      const status = bossFight.correct[i] ? '✓ CORRECT' : '✗ INCORRECT';
      this.writeLine(`  Question ${i + 1}: ${status}`);
      this.writeLine(`    Model Answer: ${bossFight.modelAnswers[i]}`);
      this.writeLine(`    Correct Answer: ${q.answer}`);
    });
    this.writeLine();
    
    if (bossFight.defeated) {
      this.writeDivider('*');
      this.writeLine('*** BOSS DEFEATED! VICTORY! ***');
      this.writeDivider('*');
    } else {
      this.writeLine('BOSS WINS - Not all questions answered correctly');
    }
    this.writeLine();
  }
  
  // --------------------------------------------------------------------------
  // Game Over
  // --------------------------------------------------------------------------
  
  logGameOver(state: MultiStageGameState): void {
    this.writeLine();
    this.writeDivider('=');
    this.writeLine('GAME OVER - FINAL RESULTS');
    this.writeDivider('=');
    this.writeLine();
    
    // Overall result
    if (state.bossDefeated) {
      this.writeLine('RESULT: COMPLETE VICTORY!');
      this.writeLine('All 4 stages completed and Boss defeated!');
    } else if (state.finalStage === 4 && state.stages[3]?.completed) {
      this.writeLine('RESULT: BOSS DEFEATED YOU');
      this.writeLine('Reached the Boss but failed to answer all questions correctly.');
    } else {
      this.writeLine(`RESULT: DEFEATED AT STAGE ${state.finalStage}`);
      this.writeLine('Ran out of lives before completing all stages.');
    }
    this.writeLine();
    
    // Stage breakdown
    this.writeLine('Stage Breakdown:');
    for (const stage of state.stages) {
      const status = stage.completed ? '✓' : '✗';
      this.writeLine(`  Stage ${stage.stage} (${stage.stageName}): ${status}`);
      this.writeLine(`    Position: ${stage.finalPosition}`);
      this.writeLine(`    Questions: ${stage.questionsCorrect}/${stage.questionsAnswered}`);
      this.writeLine(`    Bonus: ${stage.bonus}`);
    }
    this.writeLine();
    
    // Totals
    this.writeLine('Totals:');
    this.writeLine(`  Stages Completed: ${state.stages.filter(s => s.completed).length}/${state.stages.length}`);
    this.writeLine(`  Total Turns: ${state.totalTurns}`);
    this.writeLine(`  Questions: ${state.totalQuestionsCorrect}/${state.totalQuestionsAnswered}`);
    this.writeLine(`  Accuracy: ${state.totalQuestionsAnswered > 0 ? Math.round((state.totalQuestionsCorrect / state.totalQuestionsAnswered) * 100) : 0}%`);
    this.writeLine(`  Lives Remaining: ${state.lives}/5`);
    this.writeLine(`  Boss Defeated: ${state.bossDefeated ? 'Yes' : 'No'}`);
    this.writeLine();
    
    const elapsed = Date.now() - state.startTime;
    this.writeLine(`Total Time: ${(elapsed / 1000).toFixed(1)} seconds`);
    this.writeLine(`Ended: ${new Date().toISOString()}`);
    this.writeDivider('=');
  }
  
  // --------------------------------------------------------------------------
  // Save to File
  // --------------------------------------------------------------------------
  
  save(): string {
    const content = this.buffer.join('');
    fs.writeFileSync(this.logPath, content, 'utf-8');
    return this.logPath;
  }
  
  getLogPath(): string {
    return this.logPath;
  }
}

// ----------------------------------------------------------------------------
// Factory Function
// ----------------------------------------------------------------------------

export function createMultiStageLogger(
  modelId: string, 
  baseSeed: number, 
  runTimestamp: string
): MultiStageLogger {
  return new MultiStageLogger(modelId, baseSeed, runTimestamp);
}

// ----------------------------------------------------------------------------
// Generate Run Timestamp
// ----------------------------------------------------------------------------

/**
 * Generate a timestamp string for the current benchmark run.
 * Format: YYYY-MM-DD_HH-MM-SS
 * Call this once at the start of a benchmark run and reuse for all models.
 */
export function generateRunTimestamp(): string {
  return new Date().toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .slice(0, 19);  // "2025-12-24_21-39-39"
}
