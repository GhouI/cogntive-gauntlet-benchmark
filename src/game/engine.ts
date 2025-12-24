// ============================================================================
// GAME ENGINE
// ============================================================================

import type {
  Board,
  GameState,
  Coordinate,
  AvatarName,
  MoveRecord,
  ParsedMove,
  VisibleState,
  VisibleNeighbor,
  Question,
  Domain,
  Tier,
  APIUsage,
} from '../types/index.js';

import { 
  generateBoard, 
  START, 
  GOAL, 
  getAdjacentCoordinates,
  shortestPathDistance,
  isValidCoordinate,
} from './board.js';

import { 
  AVATARS, 
  getAvailableAvatars, 
  isValidAvatarName,
  isValidMove,
} from './avatars.js';

import { getQuestionForSquare, validateAnswer } from './questions.js';

import {
  sendMessage,
  buildSystemPrompt,
  buildTurnPrompt,
  buildQuestionPrompt,
  type Message,
} from '../api/openrouter.js';

import { GameLogger } from '../output/logger.js';

// ----------------------------------------------------------------------------
// Game Initialization
// ----------------------------------------------------------------------------

export function initializeGame(seed?: number): GameState {
  const board = generateBoard(seed);
  
  return {
    board,
    currentPosition: START,
    lives: 5,
    turn: 0,
    lastUsedAvatar: null,
    questionsAnswered: 0,
    questionsCorrect: 0,
    illegalMoves: 0,
    invalidJsonCount: 0,
    moveHistory: [],
    startTime: Date.now(),
    isComplete: false,
    won: false,
  };
}

// ----------------------------------------------------------------------------
// Visible State (Fog of War)
// ----------------------------------------------------------------------------

export function getVisibleState(state: GameState): VisibleState {
  const adjacent = getAdjacentCoordinates(state.currentPosition);
  const visibleNeighbors: VisibleNeighbor[] = [];
  
  for (const coord of adjacent) {
    const square = state.board.squares.get(coord);
    if (square) {
      let domain: Domain | 'void' | 'goal';
      if (square.domain === 'void') {
        domain = 'void';
      } else if (square.domain === 'goal') {
        domain = 'goal';
      } else if (square.domain === 'start') {
        // Show start as a passable square (no question needed)
        domain = 'math'; // arbitrary, won't be asked
      } else {
        domain = square.domain as Domain;
      }
      visibleNeighbors.push({ coordinate: coord, domain });
    }
  }
  
  const distanceToGoal = shortestPathDistance(
    state.currentPosition, 
    GOAL, 
    state.board.voids
  );
  
  return {
    currentPosition: state.currentPosition,
    lives: state.lives,
    turn: state.turn,
    availableAvatars: getAvailableAvatars(state.lastUsedAvatar),
    lastUsedAvatar: state.lastUsedAvatar,
    visibleNeighbors,
    distanceToGoal,
  };
}

// ----------------------------------------------------------------------------
// Parse Model Response
// ----------------------------------------------------------------------------

export function parseModelResponse(response: string): ParsedMove {
  // Try to extract JSON from the response
  let jsonStr = response.trim();
  
  // Handle markdown code blocks
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }
  
  // Try to find JSON object
  const objMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (objMatch) {
    jsonStr = objMatch[0];
  }
  
  try {
    const parsed = JSON.parse(jsonStr);
    
    // Validate required fields
    if (!parsed.avatar || !parsed.target) {
      return {
        valid: false,
        avatar: null,
        target: null,
        reasoning: parsed.reasoning || '',
        error: 'Missing required fields: avatar and/or target',
      };
    }
    
    // Validate avatar name
    const avatarName = parsed.avatar.trim();
    if (!isValidAvatarName(avatarName)) {
      return {
        valid: false,
        avatar: null,
        target: null,
        reasoning: parsed.reasoning || '',
        error: `Invalid avatar name: ${avatarName}`,
      };
    }
    
    // Validate coordinate
    const target = parsed.target.trim().toUpperCase();
    if (!isValidCoordinate(target)) {
      return {
        valid: false,
        avatar: avatarName as AvatarName,
        target: null,
        reasoning: parsed.reasoning || '',
        error: `Invalid coordinate: ${target}`,
      };
    }
    
    return {
      valid: true,
      avatar: avatarName as AvatarName,
      target: target as Coordinate,
      reasoning: parsed.reasoning || '',
    };
  } catch (e) {
    return {
      valid: false,
      avatar: null,
      target: null,
      reasoning: '',
      error: `Invalid JSON: ${e instanceof Error ? e.message : 'parse error'}`,
    };
  }
}

// ----------------------------------------------------------------------------
// Parse Answer Response
// ----------------------------------------------------------------------------

export function parseAnswerResponse(response: string): { answer: string; reasoning: string } {
  // Try to extract JSON from the response
  let jsonStr = response.trim();
  
  // Handle markdown code blocks
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }
  
  // Try to find JSON object
  const objMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (objMatch) {
    jsonStr = objMatch[0];
  }
  
  try {
    const parsed = JSON.parse(jsonStr);
    return {
      answer: String(parsed.answer || '').trim(),
      reasoning: String(parsed.reasoning || '').trim(),
    };
  } catch {
    // If JSON parsing fails, try to extract the answer directly
    // Look for patterns like "answer: X" or just return the whole response
    const answerMatch = response.match(/answer[:\s]+([^\n,}]+)/i);
    return {
      answer: answerMatch ? answerMatch[1].trim() : response.trim(),
      reasoning: response,
    };
  }
}

// ----------------------------------------------------------------------------
// Run Single Game
// ----------------------------------------------------------------------------

export interface GameResult {
  state: GameState;
  apiUsage: APIUsage;
}

export async function runGame(
  modelId: string,
  seed?: number,
  logger?: GameLogger
): Promise<GameResult> {
  const state = initializeGame(seed);
  const messages: Message[] = [
    { role: 'system', content: buildSystemPrompt() },
  ];
  
  const apiUsage: APIUsage = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    totalCost: 0,
    totalTimeMs: 0,
  };
  
  const maxTurns = 100; // Safety limit
  
  logger?.logHeader(modelId, state.board.seed);
  
  while (!state.isComplete && state.turn < maxTurns) {
    state.turn++;
    const visibleState = getVisibleState(state);
    
    // Build turn prompt
    const turnPrompt = buildTurnPrompt(visibleState);
    messages.push({ role: 'user', content: turnPrompt });
    
    logger?.logTurnStart(state, visibleState);
    
    // Get model's move
    let moveResponse;
    try {
      moveResponse = await sendMessage(modelId, messages);
    } catch (error) {
      // API failure - stop benchmark
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger?.logError(`API Error: ${errorMsg}`);
      state.isComplete = true;
      break;
    }
    
    apiUsage.inputTokens += moveResponse.inputTokens;
    apiUsage.outputTokens += moveResponse.outputTokens;
    apiUsage.totalTokens += moveResponse.totalTokens;
    apiUsage.totalCost += moveResponse.cost;
    apiUsage.totalTimeMs += moveResponse.responseTimeMs;
    
    messages.push({ role: 'assistant', content: moveResponse.content });
    
    // Parse the move
    const parsedMove = parseModelResponse(moveResponse.content);
    
    logger?.logModelResponse(moveResponse.content, parsedMove);
    
    // Create move record
    const moveRecord: MoveRecord = {
      turn: state.turn,
      fromPosition: state.currentPosition,
      toPosition: null,
      avatar: null,
      question: null,
      modelAnswer: null,
      correct: null,
      illegal: false,
      invalidJson: false,
      reasoning: parsedMove.reasoning,
      responseTimeMs: moveResponse.responseTimeMs,
    };
    
    // Handle invalid JSON
    if (!parsedMove.valid) {
      moveRecord.invalidJson = true;
      state.invalidJsonCount++;
      state.lives--;
      logger?.logInvalidJson(parsedMove.error || 'Unknown error', state.lives);
      
      if (state.lives <= 0) {
        state.isComplete = true;
        state.won = false;
      }
      
      state.moveHistory.push(moveRecord);
      continue;
    }
    
    moveRecord.avatar = parsedMove.avatar;
    moveRecord.toPosition = parsedMove.target;
    
    // Validate the move
    const moveValidation = isValidMove(
      parsedMove.avatar!,
      state.currentPosition,
      parsedMove.target!,
      state.board,
      state.lastUsedAvatar
    );
    
    if (!moveValidation.valid) {
      moveRecord.illegal = true;
      state.illegalMoves++;
      state.lives--;
      logger?.logIllegalMove(moveValidation.error || 'Invalid move', state.lives);
      
      if (state.lives <= 0) {
        state.isComplete = true;
        state.won = false;
      }
      
      state.moveHistory.push(moveRecord);
      continue;
    }
    
    // Move is valid - check if it's the goal
    if (parsedMove.target === GOAL) {
      state.currentPosition = GOAL;
      state.lastUsedAvatar = parsedMove.avatar;
      state.isComplete = true;
      state.won = true;
      moveRecord.correct = true;
      state.moveHistory.push(moveRecord);
      logger?.logGoalReached();
      break;
    }
    
    // Get the question for the target square
    const targetSquare = state.board.squares.get(parsedMove.target!);
    if (!targetSquare || targetSquare.domain === 'void' || targetSquare.domain === 'start') {
      // Shouldn't happen, but handle it
      state.currentPosition = parsedMove.target!;
      state.lastUsedAvatar = parsedMove.avatar;
      moveRecord.correct = true;
      state.moveHistory.push(moveRecord);
      continue;
    }
    
    // Get question
    const question = getQuestionForSquare(
      targetSquare.domain as Domain,
      targetSquare.tier as Tier,
      state.board.seed + state.turn
    );
    
    moveRecord.question = question;
    
    // Send question to model
    const questionPrompt = buildQuestionPrompt(question);
    messages.push({ role: 'user', content: questionPrompt });
    
    logger?.logQuestion(question);
    
    let answerResponse;
    try {
      answerResponse = await sendMessage(modelId, messages);
    } catch (error) {
      // API failure - stop benchmark
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger?.logError(`API Error: ${errorMsg}`);
      state.isComplete = true;
      break;
    }
    
    apiUsage.inputTokens += answerResponse.inputTokens;
    apiUsage.outputTokens += answerResponse.outputTokens;
    apiUsage.totalTokens += answerResponse.totalTokens;
    apiUsage.totalCost += answerResponse.cost;
    apiUsage.totalTimeMs += answerResponse.responseTimeMs;
    moveRecord.responseTimeMs += answerResponse.responseTimeMs;
    
    messages.push({ role: 'assistant', content: answerResponse.content });
    
    // Parse and validate answer
    const { answer, reasoning } = parseAnswerResponse(answerResponse.content);
    moveRecord.modelAnswer = answer;
    moveRecord.reasoning += `\n\nAnswer reasoning: ${reasoning}`;
    
    state.questionsAnswered++;
    
    const isCorrect = validateAnswer(question, answer);
    moveRecord.correct = isCorrect;
    
    logger?.logAnswer(answer, question.answer, isCorrect, state.lives - (isCorrect ? 0 : 1));
    
    if (isCorrect) {
      state.questionsCorrect++;
      state.currentPosition = parsedMove.target!;
      state.lastUsedAvatar = parsedMove.avatar;
    } else {
      state.lives--;
      if (state.lives <= 0) {
        state.isComplete = true;
        state.won = false;
      }
    }
    
    state.moveHistory.push(moveRecord);
  }
  
  // Log game over
  logger?.logGameOver(state);
  
  return { state, apiUsage };
}
