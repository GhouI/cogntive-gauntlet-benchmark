# Cognitive Gauntlet - Plan

## Main idea (original spec)
- Goal: traverse an 8x8 grid from A1 to H8 with 5 lives.
- Each square hides a gatekeeper question; you can only occupy a square if you answer correctly.
- Fog of war: you can see adjacent square categories, not the question text, until you move.
- Obstacles: void squares are impassable and force pathfinding.
- Avatars (choose one per turn):
  - Vector: orthogonal, exactly 2 squares.
  - Bias: diagonal, exactly 1 square.
  - Tensor: L-shape (2 by 1).
  - Scalar: any direction, exactly 1 square.
  - Epoch: forward only (toward row 8), exactly 3 squares.
- Life loss:
  - Wrong answer: lose 1 life, stay on previous square.
  - Illegal move: lose 1 life.
  - Game over at 0 lives.
- Question sources and tiers:
  - Tier 1: graduate STEM (MATH Level 5).
  - Tier 2: obscure or multi-step (GPQA).
  - Tier 3: optional grand challenge.
  - Domains: math, physics, code, logic, medicine (LiveCodeBench, LSAT, MedQA).
- Protocol:
  - System prompt provides current position, lives, available avatars, and visible neighbors.
  - Model outputs reasoning then strict JSON with avatar selection and target coordinate.
  - Engine validates move, then sends the question prompt.
- Scoring:
  - Score = (Progress * 10) + (Lives * 20) + (Complexity * 5) - (Errors).
  - Progress uses Manhattan distance toward the goal.

## Improved version (refinements)
- Deterministic board per evaluation:
  - Fix a random seed and store the board instance for reproducibility.
  - Run all models on the same board instance for fair comparison.
- Difficulty and grading normalization:
  - Calibrate question difficulty and label each square with a numeric difficulty weight.
  - Enforce consistent answer formats (single numeric value, short string, or multiple choice).
  - Avoid ungraded "unsolved" problems in scoring; keep as optional showcase only.
- Clear legality and parsing rules:
  - Strict JSON schema validation; invalid JSON is a failed turn.
  - Illegal move is always a -1 life penalty with no position change.
  - Define how to handle contradictions between reasoning and move selection.
- Better progress metric:
  - Replace Manhattan distance with shortest-path distance given voids.
  - Penalize backtracking or add a max-turn budget to reduce gaming.
- Avatar balance:
  - Add a cooldown, cost, or per-avatar usage limit to prevent dominance.
  - Optionally bias question difficulty upward for high-mobility moves.
- Category assignment:
  - Use weighted sampling to avoid streaks of easy or hard domains.
  - Ensure each row or region has a mix of difficulties for consistent planning pressure.
- Evaluation outputs:
  - Report separate sub-scores for planning, rule adherence, and domain accuracy.
  - Provide a combined score plus per-axis breakdown for analysis.

---

## Implementation (completed)

### Tech Stack
- **TypeScript** with Node.js (ES modules)
- **OpenRouter API** via OpenAI-compatible client
- **cli-table3** for terminal table output
- **chalk** for colored terminal output
- **dotenv** for environment variables

### Directory Structure
```
cogntive-benchmark/
├── src/
│   ├── index.ts              # Entry point - orchestrates benchmark
│   ├── config/
│   │   └── models.ts         # Hardcoded model list (easy to edit)
│   ├── api/
│   │   └── openrouter.ts     # OpenRouter API client
│   ├── game/
│   │   ├── board.ts          # 8x8 grid, void placement, random seed
│   │   ├── avatars.ts        # 5 movement types + per-turn cooldown
│   │   ├── questions.ts      # Question bank (5 sample questions)
│   │   ├── engine.ts         # Game loop, validation, fog of war
│   │   └── scoring.ts        # Score calculation, all sub-scores
│   ├── output/
│   │   ├── table.ts          # Terminal table with all metrics
│   │   └── logger.ts         # File logger - one log per model
│   └── types/
│       └── index.ts          # TypeScript interfaces
├── logs/                     # Auto-created at runtime
│   └── [model]_[seed]_[timestamp].log
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── plan.md
```

### Setup Instructions
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and add your OpenRouter API key
3. Add models to `src/config/models.ts`
4. Run: `npm start`

### Configuration

**Models** (`src/config/models.ts`):
```typescript
export const MODELS: string[] = [
  "anthropic/claude-3.5-sonnet",
  "openai/gpt-4o",
  // Add more models here
];
```

**Questions** (`src/game/questions.ts`):
- 5 extremely hard sample questions included (one per domain)
- Add more questions following the same format

### Features Implemented
- [x] Random seed board generation (displayed in output)
- [x] Per-turn avatar cooldown
- [x] Fog of war (only see adjacent square domains)
- [x] Strict JSON validation
- [x] All 5 avatar movement types
- [x] Shortest-path distance calculation (BFS avoiding voids)
- [x] Sub-scores: planning, rule adherence, domain accuracy
- [x] Terminal table output with all metrics
- [x] Per-model log files with full game history
- [x] Token usage and cost tracking
- [x] Single run mode
- [x] Stop on API failure

### Output Metrics
| Metric | Description |
|--------|-------------|
| Score | Combined score using formula from spec |
| Lives | Remaining lives out of 5 |
| Progress | Final position (✓ if reached H8) |
| Accuracy | % of questions answered correctly |
| Planning | Sub-score for pathfinding efficiency |
| Rules | Sub-score for valid JSON + legal moves |
| Time | Total response time |
| Cost | OpenRouter cost for the run |
| Tokens | Input/Output/Total token usage |

### Log File Format
Each model generates: `logs/[model-name]_[seed]_[timestamp].log`

Contains:
- Header with model name, seed, start time
- Every turn: position, lives, available avatars, visible neighbors
- Model's raw JSON response
- Question asked, answer given, correct answer
- Result (correct/incorrect/illegal move/invalid JSON)
- Footer with final stats
