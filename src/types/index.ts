// ============================================================================
// COGNITIVE GAUNTLET - TYPE DEFINITIONS
// ============================================================================

// ----------------------------------------------------------------------------
// Board Types
// ----------------------------------------------------------------------------

export type Column = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
export type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Coordinate = `${Column}${Row}`;

export type Domain = 'math' | 'physics' | 'code' | 'logic' | 'medicine';
export type Tier = 1 | 2 | 3;

export interface Square {
  coordinate: Coordinate;
  domain: Domain | 'void' | 'start' | 'goal';
  tier: Tier | null;
  difficulty: number; // 1-10 scale
  questionId: string | null;
}

export interface Board {
  seed: number;
  squares: Map<Coordinate, Square>;
  voids: Set<Coordinate>;
}

// ----------------------------------------------------------------------------
// Avatar Types
// ----------------------------------------------------------------------------

export type AvatarName = 'Vector' | 'Bias' | 'Tensor' | 'Scalar' | 'Epoch';

export interface Avatar {
  name: AvatarName;
  description: string;
  getValidMoves: (from: Coordinate, board: Board) => Coordinate[];
}

// ----------------------------------------------------------------------------
// Question Types
// ----------------------------------------------------------------------------

export type AnswerFormat = 'integer' | 'decimal' | 'string' | 'multiple_choice';

export interface Question {
  id: string;
  domain: Domain;
  tier: Tier;
  difficulty: number;
  question: string;
  answer: string;
  format: AnswerFormat;
  explanation: string;
  tolerance?: number; // For decimal answers
}

// ----------------------------------------------------------------------------
// Game State Types
// ----------------------------------------------------------------------------

export interface GameState {
  board: Board;
  currentPosition: Coordinate;
  lives: number;
  turn: number;
  lastUsedAvatar: AvatarName | null;
  questionsAnswered: number;
  questionsCorrect: number;
  illegalMoves: number;
  invalidJsonCount: number;
  moveHistory: MoveRecord[];
  startTime: number;
  isComplete: boolean;
  won: boolean;
}

export interface MoveRecord {
  turn: number;
  fromPosition: Coordinate;
  toPosition: Coordinate | null;
  avatar: AvatarName | null;
  question: Question | null;
  modelAnswer: string | null;
  correct: boolean | null;
  illegal: boolean;
  invalidJson: boolean;
  reasoning: string;
  responseTimeMs: number;
}

// ----------------------------------------------------------------------------
// Model Response Types
// ----------------------------------------------------------------------------

export interface ModelMoveResponse {
  reasoning: string;
  avatar: string;
  target: string;
}

export interface ParsedMove {
  valid: boolean;
  avatar: AvatarName | null;
  target: Coordinate | null;
  reasoning: string;
  error?: string;
}

// ----------------------------------------------------------------------------
// API Types
// ----------------------------------------------------------------------------

export interface APIResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  responseTimeMs: number;
  cost: number;
}

export interface APIUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  totalCost: number;
  totalTimeMs: number;
}

// ----------------------------------------------------------------------------
// Scoring Types
// ----------------------------------------------------------------------------

export interface SubScores {
  planning: number;      // Pathfinding efficiency (0-100)
  ruleAdherence: number; // Valid JSON + legal moves (0-100)
  domainAccuracy: number; // Question accuracy (0-100)
}

export interface GameScore {
  total: number;
  progress: number;      // Distance toward goal
  livesRemaining: number;
  complexity: number;    // Based on question difficulty
  errors: number;        // Penalties
  subScores: SubScores;
}

// ----------------------------------------------------------------------------
// Benchmark Result Types
// ----------------------------------------------------------------------------

export interface ModelResult {
  modelId: string;
  modelName: string;
  gameState: GameState;
  score: GameScore;
  apiUsage: APIUsage;
  logFilePath: string;
}

export interface BenchmarkResult {
  seed: number;
  timestamp: string;
  results: ModelResult[];
}

// ----------------------------------------------------------------------------
// Visible State (Fog of War)
// ----------------------------------------------------------------------------

export interface VisibleNeighbor {
  coordinate: Coordinate;
  domain: Domain | 'void' | 'goal';
}

export interface VisibleState {
  currentPosition: Coordinate;
  lives: number;
  turn: number;
  availableAvatars: AvatarName[];
  lastUsedAvatar: AvatarName | null;
  visibleNeighbors: VisibleNeighbor[];
  distanceToGoal: number;
  stage: number;
  stageName: string;
}

// ----------------------------------------------------------------------------
// Multi-Stage Types
// ----------------------------------------------------------------------------

export type VoidPattern = 'scattered' | 'corridor' | 'maze' | 'fortress';

export interface Stage {
  number: 1 | 2 | 3 | 4;
  name: string;
  voidPattern: VoidPattern;
  hasBoss: boolean;
}

export interface StageResult {
  stage: number;
  stageName: string;
  completed: boolean;
  score: number;
  bonus: number;
  finalPosition: Coordinate;
  questionsAnswered: number;
  questionsCorrect: number;
  turnsUsed: number;
  bossAttempted: boolean;
  bossDefeated: boolean;
}

export interface BossFight {
  questions: Question[];
  modelAnswers: string[];
  modelReasoning: string;
  correct: boolean[];
  defeated: boolean;
  responseTimeMs: number;
}

export interface MultiStageGameState {
  baseSeed: number;
  currentStage: number;
  stages: StageResult[];
  currentStageState: GameState | null;
  totalScore: number;
  lives: number;
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  totalTurns: number;
  isComplete: boolean;
  finalStage: number;
  bossDefeated: boolean;
  bossFight: BossFight | null;
  startTime: number;
}

// ----------------------------------------------------------------------------
// Multi-Stage Result Types
// ----------------------------------------------------------------------------

export interface MultiStageModelResult {
  modelId: string;
  modelName: string;
  multiStageState: MultiStageGameState;
  totalScore: number;
  stageReached: number;
  livesRemaining: number;
  accuracy: number;
  planningScore: number;
  ruleScore: number;
  bossDefeated: boolean;
  apiUsage: APIUsage;
  logFilePath: string;
}

export interface MultiStageBenchmarkResult {
  baseSeed: number;
  timestamp: string;
  results: MultiStageModelResult[];
}
