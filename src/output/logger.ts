// ============================================================================
// GAME LOGGER - File-based logging for each model's game
// ============================================================================

import * as fs from 'fs';
import * as path from 'path';
import type { 
  GameState, 
  VisibleState, 
  ParsedMove, 
  Question,
} from '../types/index.js';
import { getModelDisplayName } from '../config/models.js';

// ----------------------------------------------------------------------------
// Logger Class
// ----------------------------------------------------------------------------

export class GameLogger {
  private logPath: string;
  private buffer: string[] = [];
  private modelId: string;
  private seed: number;
  
  constructor(modelId: string, seed: number, logsDir = 'logs') {
    this.modelId = modelId;
    this.seed = seed;
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    // Generate filename: model-name_seed_timestamp.log
    const sanitizedModel = modelId.replace(/[/\\:*?"<>|]/g, '-');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${sanitizedModel}_${seed}_${timestamp}.log`;
    
    this.logPath = path.join(logsDir, filename);
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
  // Public Logging Methods
  // --------------------------------------------------------------------------
  
  logHeader(modelId: string, seed: number): void {
    this.writeDivider('=');
    this.writeLine('COGNITIVE GAUNTLET - GAME LOG');
    this.writeDivider('=');
    this.writeLine(`Model: ${getModelDisplayName(modelId)}`);
    this.writeLine(`Model ID: ${modelId}`);
    this.writeLine(`Seed: ${seed}`);
    this.writeLine(`Started: ${new Date().toISOString()}`);
    this.writeDivider('=');
    this.writeLine();
  }
  
  logTurnStart(state: GameState, visible: VisibleState): void {
    this.writeLine(`--- TURN ${state.turn} ---`);
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
    this.writeDivider('-');
    this.writeLine();
  }
  
  logIllegalMove(error: string, livesRemaining: number): void {
    this.writeLine('RESULT: ILLEGAL MOVE');
    this.writeLine(`Error: ${error}`);
    this.writeLine(`Penalty: -1 life`);
    this.writeLine(`Lives Remaining: ${livesRemaining}/5`);
    this.writeLine();
    this.writeDivider('-');
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
    this.writeDivider('-');
    this.writeLine();
  }
  
  logGoalReached(): void {
    this.writeLine('*** GOAL REACHED - H8 ***');
    this.writeLine('The model has successfully navigated to the goal!');
    this.writeLine();
  }
  
  logError(error: string): void {
    this.writeLine('!!! ERROR !!!');
    this.writeLine(error);
    this.writeLine('Benchmark stopped.');
    this.writeLine();
  }
  
  logGameOver(state: GameState): void {
    this.writeLine();
    this.writeDivider('=');
    this.writeLine('GAME OVER');
    this.writeDivider('=');
    this.writeLine();
    this.writeLine(`Final Position: ${state.currentPosition}`);
    this.writeLine(`Result: ${state.won ? 'VICTORY' : 'DEFEAT'}`);
    this.writeLine(`Turns Taken: ${state.turn}`);
    this.writeLine(`Lives Remaining: ${state.lives}/5`);
    this.writeLine();
    this.writeLine('Statistics:');
    this.writeLine(`  Questions Answered: ${state.questionsAnswered}`);
    this.writeLine(`  Questions Correct: ${state.questionsCorrect}`);
    this.writeLine(`  Accuracy: ${state.questionsAnswered > 0 ? Math.round((state.questionsCorrect / state.questionsAnswered) * 100) : 0}%`);
    this.writeLine(`  Illegal Moves: ${state.illegalMoves}`);
    this.writeLine(`  Invalid JSON: ${state.invalidJsonCount}`);
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

export function createLogger(modelId: string, seed: number): GameLogger {
  return new GameLogger(modelId, seed);
}
