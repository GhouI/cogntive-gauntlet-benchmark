// ============================================================================
// GAME ENGINE - MULTI-STAGE
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
  APIUsage,
  MultiStageGameState,
  StageResult,
  BossFight,
} from '../types/index.js';

import { 
  generateStageBoard,
  START, 
  GOAL, 
  getAdjacentCoordinates,
  shortestPathDistance,
  isValidCoordinate,
} from './board.js';

import { 
  getAvailableAvatars, 
  isValidAvatarName,
  isValidMove,
} from './avatars.js';

import { 
  getQuestionForSquare, 
  validateAnswer, 
  getBossQuestions,
  resetUsedQuestions,
} from './questions.js';

import {
  sendMessage,
  buildMultiStageSystemPrompt,
  buildStageTurnPrompt,
  buildQuestionPrompt,
  buildBossFightPrompt,
  type Message,
} from '../api/openrouter.js';

import { 
  TOTAL_STAGES, 
  getStage, 
  getStageSeed,
  STAGE_COMPLETION_BONUS,
  BOSS_DEFEAT_BONUS,
} from './stages.js';

import { MultiStageLogger } from '../output/logger.js';

// ----------------------------------------------------------------------------
// Single Stage Game Initialization
// ----------------------------------------------------------------------------

export function initializeStageGame(
  baseSeed: number, 
  stageNumber: number,
  startingLives: number
): GameState {
  const stage = getStage(stageNumber);
  const stageSeed = getStageSeed(baseSeed, stageNumber);
  const board = generateStageBoard(stageSeed, stage.voidPattern);
  
  return {
    board,
    currentPosition: START,
    lives: startingLives,
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
// Multi-Stage Game Initialization
// ----------------------------------------------------------------------------

export function initializeMultiStageGame(baseSeed: number): MultiStageGameState {
  return {
    baseSeed,
    currentStage: 1,
    stages: [],
    currentStageState: null,
    totalScore: 0,
    lives: 5,
    totalQuestionsAnswered: 0,
    totalQuestionsCorrect: 0,
    totalTurns: 0,
    isComplete: false,
    finalStage: 0,
    bossDefeated: false,
    bossFight: null,
    startTime: Date.now(),
  };
}

// ----------------------------------------------------------------------------
// Visible State (Fog of War)
// ----------------------------------------------------------------------------

export function getVisibleState(
  state: GameState, 
  stageNumber: number, 
  stageName: string
): VisibleState {
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
    stage: stageNumber,
    stageName,
  };
}

// ----------------------------------------------------------------------------
// Parse Model Response
// ----------------------------------------------------------------------------

export function parseModelResponse(response: string): ParsedMove {
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
    
    if (!parsed.avatar || !parsed.target) {
      return {
        valid: false,
        avatar: null,
        target: null,
        reasoning: parsed.reasoning || '',
        error: 'Missing required fields: avatar and/or target',
      };
    }
    
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
  let jsonStr = response.trim();
  
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }
  
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
    const answerMatch = response.match(/answer[:\s]+([^\n,}]+)/i);
    return {
      answer: answerMatch ? answerMatch[1].trim() : response.trim(),
      reasoning: response,
    };
  }
}

// ----------------------------------------------------------------------------
// Parse Boss Fight Response
// ----------------------------------------------------------------------------

export function parseBossFightResponse(response: string): {
  answers: string[];
  reasoning: string;
  valid: boolean;
} {
  let jsonStr = response.trim();
  
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }
  
  const objMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (objMatch) {
    jsonStr = objMatch[0];
  }
  
  try {
    const parsed = JSON.parse(jsonStr);
    const answers = [
      String(parsed.answer1 || '').trim(),
      String(parsed.answer2 || '').trim(),
      String(parsed.answer3 || '').trim(),
    ];
    
    return {
      answers,
      reasoning: String(parsed.reasoning || '').trim(),
      valid: true,
    };
  } catch {
    return {
      answers: ['', '', ''],
      reasoning: response,
      valid: false,
    };
  }
}

// ----------------------------------------------------------------------------
// Run Single Stage
// ----------------------------------------------------------------------------

export interface StageGameResult {
  state: GameState;
  stageResult: StageResult;
  apiUsage: APIUsage;
}

async function runSingleStage(
  modelId: string,
  baseSeed: number,
  stageNumber: number,
  startingLives: number,
  messages: Message[],
  logger: MultiStageLogger
): Promise<StageGameResult> {
  const stage = getStage(stageNumber);
  const state = initializeStageGame(baseSeed, stageNumber, startingLives);
  
  const apiUsage: APIUsage = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    totalCost: 0,
    totalTimeMs: 0,
  };
  
  const maxTurns = 100;
  
  logger.logStageStart(stageNumber, stage.name, state.board);
  
  // Add stage system prompt
  messages.push({
    role: 'system',
    content: buildMultiStageSystemPrompt(stageNumber, stage.name),
  });
  
  while (!state.isComplete && state.turn < maxTurns && state.lives > 0) {
    state.turn++;
    const visibleState = getVisibleState(state, stageNumber, stage.name);
    
    const turnPrompt = buildStageTurnPrompt(visibleState);
    messages.push({ role: 'user', content: turnPrompt });
    
    logger.logTurnStart(state, visibleState);
    
    // Get model's move
    let moveResponse;
    try {
      moveResponse = await sendMessage(modelId, messages);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.logError(`API Error: ${errorMsg}`);
      state.isComplete = true;
      break;
    }
    
    apiUsage.inputTokens += moveResponse.inputTokens;
    apiUsage.outputTokens += moveResponse.outputTokens;
    apiUsage.totalTokens += moveResponse.totalTokens;
    apiUsage.totalCost += moveResponse.cost;
    apiUsage.totalTimeMs += moveResponse.responseTimeMs;
    
    messages.push({ role: 'assistant', content: moveResponse.content });
    
    const parsedMove = parseModelResponse(moveResponse.content);
    logger.logModelResponse(moveResponse.content, parsedMove);
    
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
      logger.logInvalidJson(parsedMove.error || 'Unknown error', state.lives);
      
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
      logger.logIllegalMove(moveValidation.error || 'Invalid move', state.lives);
      
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
      logger.logGoalReached(stageNumber);
      break;
    }
    
    // Get the question for the target square
    const targetSquare = state.board.squares.get(parsedMove.target!);
    if (!targetSquare || targetSquare.domain === 'void' || targetSquare.domain === 'start') {
      state.currentPosition = parsedMove.target!;
      state.lastUsedAvatar = parsedMove.avatar;
      moveRecord.correct = true;
      state.moveHistory.push(moveRecord);
      continue;
    }
    
    // Get question
    const question = getQuestionForSquare(targetSquare.domain as Domain);
    moveRecord.question = question;
    
    // Send question to model
    const questionPrompt = buildQuestionPrompt(question);
    messages.push({ role: 'user', content: questionPrompt });
    
    logger.logQuestion(question);
    
    let answerResponse;
    try {
      answerResponse = await sendMessage(modelId, messages);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.logError(`API Error: ${errorMsg}`);
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
    
    const { answer, reasoning } = parseAnswerResponse(answerResponse.content);
    moveRecord.modelAnswer = answer;
    moveRecord.reasoning += `\n\nAnswer reasoning: ${reasoning}`;
    
    state.questionsAnswered++;
    
    const isCorrect = validateAnswer(question, answer);
    moveRecord.correct = isCorrect;
    
    logger.logAnswer(answer, question.answer, isCorrect, state.lives - (isCorrect ? 0 : 1));
    
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
  
  // Calculate stage result
  const stageResult: StageResult = {
    stage: stageNumber,
    stageName: stage.name,
    completed: state.won,
    score: 0, // Will be calculated by scoring module
    bonus: state.won ? STAGE_COMPLETION_BONUS[stageNumber] : 0,
    finalPosition: state.currentPosition,
    questionsAnswered: state.questionsAnswered,
    questionsCorrect: state.questionsCorrect,
    turnsUsed: state.turn,
    bossAttempted: false,
    bossDefeated: false,
  };
  
  logger.logStageEnd(stageNumber, state, stageResult);
  
  return { state, stageResult, apiUsage };
}

// ----------------------------------------------------------------------------
// Run Boss Fight
// ----------------------------------------------------------------------------

async function runBossFight(
  modelId: string,
  messages: Message[],
  logger: MultiStageLogger
): Promise<{ bossFight: BossFight; apiUsage: APIUsage }> {
  const questions = getBossQuestions();
  
  const apiUsage: APIUsage = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    totalCost: 0,
    totalTimeMs: 0,
  };
  
  logger.logBossFightStart(questions);
  
  // Send boss fight prompt
  const bossPrompt = buildBossFightPrompt(questions);
  messages.push({ role: 'user', content: bossPrompt });
  
  const startTime = Date.now();
  
  let bossResponse;
  try {
    bossResponse = await sendMessage(modelId, messages);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.logError(`Boss Fight API Error: ${errorMsg}`);
    
    return {
      bossFight: {
        questions,
        modelAnswers: ['', '', ''],
        modelReasoning: '',
        correct: [false, false, false],
        defeated: false,
        responseTimeMs: Date.now() - startTime,
      },
      apiUsage,
    };
  }
  
  apiUsage.inputTokens += bossResponse.inputTokens;
  apiUsage.outputTokens += bossResponse.outputTokens;
  apiUsage.totalTokens += bossResponse.totalTokens;
  apiUsage.totalCost += bossResponse.cost;
  apiUsage.totalTimeMs += bossResponse.responseTimeMs;
  
  messages.push({ role: 'assistant', content: bossResponse.content });
  
  const parsed = parseBossFightResponse(bossResponse.content);
  
  // Validate each answer
  const correct = questions.map((q, i) => validateAnswer(q, parsed.answers[i]));
  const defeated = correct.every(c => c);
  
  const bossFight: BossFight = {
    questions,
    modelAnswers: parsed.answers,
    modelReasoning: parsed.reasoning,
    correct,
    defeated,
    responseTimeMs: bossResponse.responseTimeMs,
  };
  
  logger.logBossFightEnd(bossFight);
  
  return { bossFight, apiUsage };
}

// ----------------------------------------------------------------------------
// Run Multi-Stage Game
// ----------------------------------------------------------------------------

export interface MultiStageGameResult {
  state: MultiStageGameState;
  apiUsage: APIUsage;
}

export async function runMultiStageGame(
  modelId: string,
  baseSeed: number,
  logger: MultiStageLogger
): Promise<MultiStageGameResult> {
  const state = initializeMultiStageGame(baseSeed);
  const messages: Message[] = [];
  
  const apiUsage: APIUsage = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    totalCost: 0,
    totalTimeMs: 0,
  };
  
  logger.logHeader(modelId, baseSeed);
  
  // Reset question tracking for this game
  resetUsedQuestions();
  
  // Run through each stage
  for (let stageNum = 1; stageNum <= TOTAL_STAGES; stageNum++) {
    state.currentStage = stageNum;
    
    const stageResult = await runSingleStage(
      modelId,
      baseSeed,
      stageNum,
      state.lives,
      messages,
      logger
    );
    
    // Accumulate API usage
    apiUsage.inputTokens += stageResult.apiUsage.inputTokens;
    apiUsage.outputTokens += stageResult.apiUsage.outputTokens;
    apiUsage.totalTokens += stageResult.apiUsage.totalTokens;
    apiUsage.totalCost += stageResult.apiUsage.totalCost;
    apiUsage.totalTimeMs += stageResult.apiUsage.totalTimeMs;
    
    // Update state
    state.lives = stageResult.state.lives;
    state.totalQuestionsAnswered += stageResult.state.questionsAnswered;
    state.totalQuestionsCorrect += stageResult.state.questionsCorrect;
    state.totalTurns += stageResult.state.turn;
    state.currentStageState = stageResult.state;
    state.stages.push(stageResult.stageResult);
    state.finalStage = stageNum;
    
    // Check if stage was completed
    if (!stageResult.stageResult.completed) {
      // Game over - didn't complete stage
      state.isComplete = true;
      break;
    }
    
    // Stage 4 completed - run boss fight
    if (stageNum === TOTAL_STAGES && stageResult.stageResult.completed) {
      const bossResult = await runBossFight(modelId, messages, logger);
      
      // Accumulate API usage
      apiUsage.inputTokens += bossResult.apiUsage.inputTokens;
      apiUsage.outputTokens += bossResult.apiUsage.outputTokens;
      apiUsage.totalTokens += bossResult.apiUsage.totalTokens;
      apiUsage.totalCost += bossResult.apiUsage.totalCost;
      apiUsage.totalTimeMs += bossResult.apiUsage.totalTimeMs;
      
      state.bossFight = bossResult.bossFight;
      state.bossDefeated = bossResult.bossFight.defeated;
      
      // Update last stage result with boss info
      const lastStage = state.stages[state.stages.length - 1];
      lastStage.bossAttempted = true;
      lastStage.bossDefeated = bossResult.bossFight.defeated;
      
      if (bossResult.bossFight.defeated) {
        lastStage.bonus += BOSS_DEFEAT_BONUS;
      }
      
      state.isComplete = true;
    }
  }
  
  // Mark complete if not already
  if (!state.isComplete) {
    state.isComplete = true;
  }
  
  logger.logGameOver(state);
  
  return { state, apiUsage };
}
