#  The Cognitive Gauntlet

> **A Roguelike Reasoning Benchmark for Large Language Models.**

The **Cognitive Gauntlet** is a multi-agent reinforcement learning environment disguised as a strategy game. It evaluates an LLM's ability to maintain long-horizon planning, manage resource constraints (lives), and solve domain-specific "Grand Challenge" problems simultaneously.

Unlike static benchmarks (like MMLU or MATH) that test questions in isolation, the Cognitive Gauntlet tests **resilience**: Can the model juggle spatial navigation, rule adherence, and high-level problem solving without suffering from context drift or hallucination?

---

## 🎮 The Game Mechanics

### The Objective
The agent must traverse an **8x8 Grid** from Start (**A1**) to Finish (**H8**).
- **Survival:** The agent starts with **5 Lives**.
- **The Cost:** To enter any square, the agent must correctly answer a "Gatekeeper Question."
- **Progression:** Reaching H8 triggers a "Boss Fight." Winning clears the stage, regenerates a harder board, and heals 1 Life.

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
1.  **Fog of War:** The agent sees the *Category* of adjacent squares (e.g., "Quantum Physics") but not the specific question until it commits to the move.
2.  **Strict Liability:**
    * **Wrong Answer:** -1 Life. The agent bounces back to the previous square.
    * **Illegal Move:** -1 Life. (e.g., Trying to move diagonally as "The Vector").
    * **Hallucination:** -1 Life. (e.g., Outputting malformed JSON).

---

## 🔬 Benchmark Specification

This is not just a game; it is a rigorous evaluation suite.

### 1. Determinism & Reproducibility
* **Seeded Boards:** The board generation is deterministic based on a random seed. All models (GPT-4, Claude 3.5, Llama 3) compete on the exact same board layout with the exact same questions for fair comparison.

### 2. Difficulty Tiers & Datasets
Questions are sourced from validated, high-difficulty datasets:
* **Math:** Olympiad-level problems (Source: *Hendrycks MATH Level 5*).
* **Science:** PhD-level biology/physics (Source: *GPQA - Google-Proof Q&A*).
* **Code:** Algorithms & Concurrency (Source: *LiveCodeBench*).
* **Logic:** Formal proofs and LSAT logic games.

### 3. Scoring Metric
Models are judged on a composite score, not just "Winning."
$$Score = (P \times 10) + (L \times 50) + (C \times 5) - E$$
* **P (Progress):** Distance traveled toward the goal.
* **L (Lives):** Remaining lives (heavily weighted for survival).
* **C (Complexity):** Bonus for choosing "Hard" category paths.
* **E (Errors):** Penalty for illegal moves/syntax errors.

---

##  Getting Started

### Prerequisites
* Python 3.10+
* API Keys for the models you wish to test (OpenAI, Anthropic, etc.)

### Installation
```bash
git clone [https://github.com/yourusername/cognitive-gauntlet.git](https://github.com/yourusername/cognitive-gauntlet.git)
cd cognitive-gauntlet
pip install -r requirements.txt
```
## Running the benchmark
```python
# Run a single game with a specific seed
python play.py --model gpt-4-turbo --seed 42

# Run the full benchmark suite
python benchmark.py --models all --iterations 100
```
## Current Leaderboard
N/A

# License

