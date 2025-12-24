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

---

## Multi-Stage Implementation (v2)

### Overview
The benchmark now features a **4-stage challenge** where models must:
1. Complete 4 consecutive 8x8 grids
2. Lives carry over between stages (no reset!)
3. Face a **Boss Fight** at the end of Stage 4
4. All questions are **Tier 3** (maximum difficulty)

### Stages

| Stage | Name | Void Pattern | Boss |
|-------|------|--------------|------|
| 1 | The Awakening | Scattered | No |
| 2 | The Labyrinth | Corridor | No |
| 3 | The Maze | Maze | No |
| 4 | The Final Stand | Fortress | Yes |

### Void Patterns
- **Scattered**: 8 random voids spread across the board
- **Corridor**: Vertical barriers with gaps creating narrow pathways
- **Maze**: L-shaped barriers and dead ends
- **Fortress**: Dense voids protecting the goal at H8

### Boss Fight Mechanics
- Triggered upon reaching H8 on Stage 4
- Model receives **3 questions simultaneously** (math, physics, logic)
- Must answer **ALL 3 correctly** in a single JSON response
- Any wrong answer = Boss wins, game over
- All correct = Boss defeated, complete victory!

### Scoring (Multi-Stage)
```
Stage Score = Questions Correct × 20
Stage Completion Bonus = 100 × Stage Number (100, 200, 300, 400)
Boss Defeat Bonus = 500

Total Score = Sum(Stage Scores) + Sum(Stage Bonuses) + Boss Bonus
```

### Terminal Output
```
╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                    COGNITIVE GAUNTLET - MULTI-STAGE RESULTS                                       ║
╠═══════════════════════════════╦═══════╦═══════╦══════════╦══════════╦══════════╦════════╦════════╦════════╦═══════╣
║ Model                         ║ Score ║ Stage ║ Lives    ║ Accuracy ║ Planning ║ Rules  ║ Time   ║ Cost   ║ Boss  ║
╠═══════════════════════════════╬═══════╬═══════╬══════════╬══════════╬══════════╬════════╬════════╬════════╬═══════╣
║ claude-3.5-sonnet             ║ 1850  ║ 4/4   ║ 2/5      ║ 87%      ║ 92%      ║ 95%    ║ 3m 45s ║ $0.12  ║ ✓ WIN ║
║ gpt-4o                        ║ 1420  ║ 4/4   ║ 0/5      ║ 82%      ║ 88%      ║ 90%    ║ 2m 38s ║ $0.09  ║ ✗ LOSS║
║ gemini-2.0-flash              ║ 680   ║ 2/4   ║ 0/5      ║ 65%      ║ 70%      ║ 88%    ║ 1m 22s ║ $0.02  ║ -     ║
╚═══════════════════════════════╩═══════╩═══════╩══════════╩══════════╩══════════╩════════╩════════╩════════╩═══════╝

Stage Breakdown:
┌───────────────────────────────┬─────────┬─────────┬─────────┬─────────────────┐
│ Model                         │ Stage 1 │ Stage 2 │ Stage 3 │ Stage 4         │
├───────────────────────────────┼─────────┼─────────┼─────────┼─────────────────┤
│ claude-3.5-sonnet             │ ✓ +100  │ ✓ +200  │ ✓ +300  │ ✓ +900 (Boss!)  │
│ gpt-4o                        │ ✓ +100  │ ✓ +200  │ ✓ +300  │ H8 (Boss ✗)     │
│ gemini-2.0-flash              │ ✓ +100  │ E4 ☠    │ -       │ -               │
└───────────────────────────────┴─────────┴─────────┴─────────┴─────────────────┘
```

### Questions
- **20 Tier 3 questions** (4 per domain: math, physics, code, logic, medicine)
- **3 Boss questions** (math, physics, logic) for the final confrontation
- All questions are extremely difficult - no easy mode!

### Files Modified for Multi-Stage
| File | Changes |
|------|---------|
| `src/types/index.ts` | Added Stage, BossFight, MultiStageGameState types |
| `src/game/stages.ts` | NEW - Stage configuration and bonuses |
| `src/game/board.ts` | Void pattern generation per stage |
| `src/game/questions.ts` | All Tier 3, 20 questions + 3 boss questions |
| `src/api/openrouter.ts` | Multi-stage prompts, boss fight prompt |
| `src/game/engine.ts` | Multi-stage game loop, boss fight logic |
| `src/game/scoring.ts` | Stage bonuses, accumulated scoring |
| `src/output/table.ts` | Stage column, breakdown table |
| `src/output/logger.ts` | Stage transitions, boss fight logs |
| `src/index.ts` | Multi-stage benchmark orchestration |
