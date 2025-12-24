// ============================================================================
// OPENROUTER API CLIENT
// ============================================================================

import OpenAI from 'openai';
import type { APIResponse } from '../types/index.js';

// ----------------------------------------------------------------------------
// OpenRouter Client
// ----------------------------------------------------------------------------

let client: OpenAI | null = null;

export function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error(
        'OPENROUTER_API_KEY not found in environment variables.\n' +
        'Please create a .env file with your API key:\n' +
        'OPENROUTER_API_KEY=your_key_here'
      );
    }

    client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
      defaultHeaders: {
        'HTTP-Referer': 'https://github.com/cognitive-gauntlet',
        'X-Title': 'Cognitive Gauntlet Benchmark',
      },
    });
  }
  return client;
}

// ----------------------------------------------------------------------------
// Pricing (approximate, per 1M tokens)
// ----------------------------------------------------------------------------

const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'anthropic/claude-3.5-sonnet': { input: 3.0, output: 15.0 },
  'anthropic/claude-3-opus': { input: 15.0, output: 75.0 },
  'anthropic/claude-3-haiku': { input: 0.25, output: 1.25 },
  'openai/gpt-4o': { input: 2.5, output: 10.0 },
  'openai/gpt-4o-mini': { input: 0.15, output: 0.6 },
  'openai/gpt-4-turbo': { input: 10.0, output: 30.0 },
  'google/gemini-pro-1.5': { input: 1.25, output: 5.0 },
  'google/gemini-2.0-flash-exp:free': { input: 0, output: 0 },
  'meta-llama/llama-3.3-70b-instruct': { input: 0.4, output: 0.4 },
  'deepseek/deepseek-chat': { input: 0.14, output: 0.28 },
  'mistralai/mistral-large': { input: 2.0, output: 6.0 },
  'qwen/qwen-2.5-72b-instruct': { input: 0.35, output: 0.4 },
};

function estimateCost(modelId: string, inputTokens: number, outputTokens: number): number {
  const pricing = MODEL_PRICING[modelId] || { input: 1.0, output: 2.0 }; // Default fallback
  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

// ----------------------------------------------------------------------------
// Send Message to Model
// ----------------------------------------------------------------------------

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function sendMessage(
  modelId: string,
  messages: Message[]
): Promise<APIResponse> {
  const client = getClient();
  const startTime = Date.now();

  try {
    const response = await client.chat.completions.create({
      model: modelId,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048,
    });

    const responseTimeMs = Date.now() - startTime;
    const content = response.choices[0]?.message?.content || '';
    const usage = response.usage;

    const inputTokens = usage?.prompt_tokens || 0;
    const outputTokens = usage?.completion_tokens || 0;
    const totalTokens = usage?.total_tokens || inputTokens + outputTokens;
    const cost = estimateCost(modelId, inputTokens, outputTokens);

    return {
      content,
      inputTokens,
      outputTokens,
      totalTokens,
      responseTimeMs,
      cost,
    };
  } catch (error) {
    // Re-throw with more context
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`OpenRouter API error for ${modelId}: ${errorMessage}`);
  }
}

// ----------------------------------------------------------------------------
// Build System Prompt
// ----------------------------------------------------------------------------

export function buildSystemPrompt(): string {
  return `You are playing Cognitive Gauntlet, an 8x8 grid traversal game.

OBJECTIVE: Navigate from A1 to H8 while answering gatekeeper questions correctly.

RULES:
1. You start at A1 with 5 lives. Reach H8 to win.
2. Each square has a question. Answer correctly to occupy it.
3. Wrong answer: lose 1 life, stay on current square.
4. Illegal move: lose 1 life, stay on current square.
5. Game over at 0 lives.

AVATARS (movement types):
- Vector: Move exactly 2 squares orthogonally (up, down, left, right)
- Bias: Move exactly 1 square diagonally
- Tensor: Move in L-shape (2 squares one direction, 1 square perpendicular)
- Scalar: Move exactly 1 square in any direction (including diagonal)
- Epoch: Move exactly 3 squares forward (toward row 8 only)

COOLDOWN: You cannot use the same avatar twice in a row.

COORDINATE SYSTEM:
- Columns: A-H (left to right)
- Rows: 1-8 (bottom to top)
- A1 is bottom-left, H8 is top-right

FOG OF WAR: You can only see the category of adjacent squares, not the questions.

RESPONSE FORMAT: You MUST respond with valid JSON only:
{
  "reasoning": "Your strategic thinking about the move",
  "avatar": "AvatarName",
  "target": "TargetCoordinate"
}

Example response:
{
  "reasoning": "I need to move toward H8. Using Vector to move 2 squares right to C1.",
  "avatar": "Vector",
  "target": "C1"
}

IMPORTANT: Your entire response must be valid JSON. Do not include any text before or after the JSON.`;
}

// ----------------------------------------------------------------------------
// Build Turn Prompt
// ----------------------------------------------------------------------------

import type { VisibleState } from '../types/index.js';

export function buildTurnPrompt(state: VisibleState): string {
  const neighbors = state.visibleNeighbors
    .map(n => `  ${n.coordinate}: [${n.domain}]`)
    .join('\n');

  const avatars = state.availableAvatars.join(', ');
  const cooldown = state.lastUsedAvatar 
    ? `(${state.lastUsedAvatar} on cooldown)` 
    : '(none on cooldown)';

  return `TURN ${state.turn}

Current Position: ${state.currentPosition}
Lives: ${state.lives}/5
Distance to Goal (H8): ${state.distanceToGoal} squares

Available Avatars: ${avatars} ${cooldown}

Visible Neighbors (category only):
${neighbors}

Choose your move. Respond with JSON only.`;
}

// ----------------------------------------------------------------------------
// Build Question Prompt
// ----------------------------------------------------------------------------

import type { Question } from '../types/index.js';

export function buildQuestionPrompt(question: Question): string {
  return `You moved successfully. Now answer this ${question.domain.toUpperCase()} question (Tier ${question.tier}):

${question.question}

RESPONSE FORMAT: Respond with JSON only:
{
  "reasoning": "Your step-by-step solution",
  "answer": "Your final answer"
}

Answer format required: ${question.format}
${question.format === 'decimal' ? `(Provide answer to 3 significant figures)` : ''}
${question.format === 'integer' ? `(Provide integer only, no decimals)` : ''}
${question.format === 'string' ? `(Provide a single word or short phrase)` : ''}

Your entire response must be valid JSON.`;
}

// ----------------------------------------------------------------------------
// Build Multi-Stage System Prompt
// ----------------------------------------------------------------------------

export function buildMultiStageSystemPrompt(stageNumber: number, stageName: string): string {
  return `You are playing Cognitive Gauntlet, a multi-stage 8x8 grid traversal challenge.

CURRENT STAGE: ${stageNumber}/4 - "${stageName}"

OBJECTIVE: Navigate from A1 to H8 on each stage. Complete all 4 stages to face the Final Boss.

RULES:
1. You have 5 lives total across ALL stages - lives carry over!
2. Each square has an EXTREMELY HARD question (Tier 3 only). Answer correctly to occupy it.
3. Wrong answer: lose 1 life, stay on current square.
4. Illegal move: lose 1 life, stay on current square.
5. Game over at 0 lives.
6. Reach H8 to complete the stage and advance.

AVATARS (movement types):
- Vector: Move exactly 2 squares orthogonally (up, down, left, right)
- Bias: Move exactly 1 square diagonally
- Tensor: Move in L-shape (2 squares one direction, 1 square perpendicular)
- Scalar: Move exactly 1 square in any direction (including diagonal)
- Epoch: Move exactly 3 squares forward (toward row 8 only)

COOLDOWN: You cannot use the same avatar twice in a row.

COORDINATE SYSTEM:
- Columns: A-H (left to right)
- Rows: 1-8 (bottom to top)
- A1 is bottom-left, H8 is top-right

FOG OF WAR: You can only see the category of adjacent squares, not the questions.

RESPONSE FORMAT: You MUST respond with valid JSON only:
{
  "reasoning": "Your strategic thinking about the move",
  "avatar": "AvatarName",
  "target": "TargetCoordinate"
}

IMPORTANT: Your entire response must be valid JSON. Do not include any text before or after the JSON.`;
}

// ----------------------------------------------------------------------------
// Build Stage Turn Prompt
// ----------------------------------------------------------------------------

export function buildStageTurnPrompt(state: VisibleState): string {
  const neighbors = state.visibleNeighbors
    .map(n => `  ${n.coordinate}: [${n.domain}]`)
    .join('\n');

  const avatars = state.availableAvatars.join(', ');
  const cooldown = state.lastUsedAvatar 
    ? `(${state.lastUsedAvatar} on cooldown)` 
    : '(none on cooldown)';

  return `STAGE ${state.stage}/4 - "${state.stageName}" | TURN ${state.turn}

Current Position: ${state.currentPosition}
Lives: ${state.lives}/5 (carries over between stages!)
Distance to Goal (H8): ${state.distanceToGoal} squares

Available Avatars: ${avatars} ${cooldown}

Visible Neighbors (category only):
${neighbors}

Choose your move. Respond with JSON only.`;
}

// ----------------------------------------------------------------------------
// Build Boss Fight Prompt
// ----------------------------------------------------------------------------

export function buildBossFightPrompt(questions: Question[]): string {
  const questionTexts = questions.map((q, i) => 
    `QUESTION ${i + 1} (${q.domain.toUpperCase()}):\n${q.question}\nAnswer format: ${q.format}`
  ).join('\n\n');

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                         BOSS FIGHT - THE FINAL STAND                         ║
╚══════════════════════════════════════════════════════════════════════════════╝

You have reached H8 on Stage 4. The BOSS awaits.

To defeat the Boss and complete the Cognitive Gauntlet, you must answer 
ALL THREE questions correctly in a SINGLE response.

Any incorrect answer means defeat - the Boss wins.

${questionTexts}

RESPONSE FORMAT: You MUST respond with valid JSON:
{
  "reasoning": "Your approach to solving all three questions",
  "answer1": "Your answer to question 1",
  "answer2": "Your answer to question 2",
  "answer3": "Your answer to question 3"
}

This is your ONLY chance. Answer all three correctly to achieve victory.
Your entire response must be valid JSON.`;
}
