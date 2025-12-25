# The Cognitive Gauntlet

> **A Roguelike Reasoning Benchmark for Large Language Models.**

The **Cognitive Gauntlet** is a multi-stage AI benchmark that evaluates an LLM's ability to maintain long-horizon planning, manage resource constraints (lives), and solve domain-specific "Grand Challenge" problems simultaneously.

> [!IMPORTANT]
> This is a fun project, and some of the code may be wrong.

Unlike static benchmarks (like MMLU or MATH) that test questions in isolation, the Cognitive Gauntlet tests **resilience**: Can the model juggle spatial navigation, rule adherence, and high-level problem solving without suffering from context drift or hallucination?


---

## The Game Mechanics

### The Objective
The agent must traverse an **8x8 Grid** from Start (**A1**) to Finish (**H8**) across **4 stages**.
- **Survival:** The agent starts with **5 Lives** that carry over between stages.
- **The Cost:** To enter any square, the agent must correctly answer a "Gatekeeper Question."
- **Progression:** Completing all 4 stages triggers the **Boss Fight** - answer 3 questions correctly to win.

### The Avatars (Movement Rules)
The agent does not have a single fixed movement pattern. On every turn, it must "shapeshift" into one of 5 Avatars to navigate obstacles.

| Avatar | Symbol | Movement Rule | Strategic Utility |
| :--- | :--- | :--- | :--- |
| **The Scalar** | `●` | 1 square (Any direction) | Slow, safe, flexible. |
| **The Vector** | `→` | 2 squares (Orthogonal only) | Speed; skips adjacent traps. |
| **The Tensor** | `L` | L-Shape (Knight move) | Jumps over Voids/Walls. |
| **The Bias** | `×` | 1 square (Diagonal only) | Granular movement. |
| **The Epoch** | `⇒` | 3 squares (Forward only) | High risk, high reward. |

### The Rules of Engagement
1.  **Full Board Visibility:** The agent can see the entire board layout including all categories and void squares.
2.  **Strict Liability:**
    * **Wrong Answer:** -1 Life. The agent stays on the current square.
    * **Illegal Move:** -1 Life. (e.g., Moving to a void square or invalid avatar movement).
    * **Hallucination:** -1 Life. (e.g., Outputting malformed JSON).

---

## Benchmark Specification

This is not just a game; it is a rigorous evaluation suite.

### 1. Determinism & Reproducibility
* **Seeded Boards:** The board generation is deterministic based on a random seed. All models compete on the exact same board layout with the exact same questions for fair comparison.

### 2. Difficulty Tiers & Datasets
Questions are sourced from validated, high-difficulty datasets (ALL Tier 3 - Maximum Difficulty):
* **Math:** Olympiad-level problems
* **Physics:** PhD-level concepts
* **Code:** Algorithms & Data Structures
* **Logic:** Formal proofs and puzzles
* **Medicine:** Clinical scenarios

### 3. Scoring Metric
Models are judged on a composite score that rewards progress, survival, and accuracy.

---

## Getting Started

### Prerequisites
* Node.js 18+
* OpenRouter API Key (for model access)

### Installation
```bash
git clone https://github.com/Ghoui/cognitive-gauntlet.git
cd cognitive-gauntlet
npm install
```

### Configuration
Create a `.env` file with your API key:
```bash
OPENROUTER_API_KEY=your_key_here
```

### Running the benchmark
```bash
# Run the full benchmark suite
npm start

# Build and run
npm run build && node dist/index.js
```

## Current Leaderboard

| Model | Score | Stage | Lives | Accuracy | Boss | Runs | Last Updated |
|-------|-------|-------|-------|----------|------|------|--------------|
| Sonnet 4.5 | 2440 | 4/4 | 4/5 | 9600% | ✓ WIN | 1 | 2025-12-25 |
# License
MIT
