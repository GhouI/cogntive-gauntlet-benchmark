// ============================================================================
// QUESTION BANK - ALL TIER 3 (EXTREMELY HARD)
// ============================================================================
// All questions are Tier 3 grand challenge level.
// Add your own questions following the format below.
// 
// Domains: math, physics, code, logic, medicine
// Formats: integer, decimal, string, multiple_choice
// ============================================================================

import type { Question, Domain } from '../types/index.js';

// ----------------------------------------------------------------------------
// TIER 3 QUESTIONS - MATHEMATICS
// ----------------------------------------------------------------------------

const MATH_QUESTIONS: Question[] = [
  {
    id: 'math-001',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `Let p be a prime number. Consider the expression (1 + √p)^n + (1 - √p)^n for integers n ≥ 1.

Using binomial expansion, this expression always yields an integer.

For p = 5 and n = 10, calculate this integer value.

Hint: This relates to Lucas sequences.`,
    answer: '28118',
    format: 'integer',
    explanation: `Using binomial expansion, odd powers of √p cancel out. For p=5, this generates a Lucas-like sequence. The answer is 28118.`,
  },
  {
    id: 'math-002',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `Find the number of distinct ways to tile a 3×10 grid using 1×2 dominoes.

Each domino covers exactly two adjacent cells, and the entire grid must be covered with no overlaps.

Give your answer as an integer.`,
    answer: '571',
    format: 'integer',
    explanation: `This is a classic domino tiling problem. Using transfer matrix method or recurrence relation, the answer is 571.`,
  },
  {
    id: 'math-003',
    domain: 'math',
    tier: 3,
    difficulty: 9,
    question: `Let f(x) = x^3 - 3x + 1. 

Find the sum of the cubes of all real roots of f(x) = 0.

Give your answer as an integer.`,
    answer: '18',
    format: 'integer',
    explanation: `Using Vieta's formulas: if r,s,t are roots, then r+s+t=0, rs+rt+st=-3, rst=-1. We need r³+s³+t³. Using identity and substitution, answer is 18.`,
  },
  {
    id: 'math-004',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `How many integers n with 1 ≤ n ≤ 1000 satisfy the property that n divides 2^n + 1?

Give your answer as an integer.`,
    answer: '2',
    format: 'integer',
    explanation: `Only n=1 and n=3 satisfy this. For n=1: 2^1+1=3, 1|3. For n=3: 2^3+1=9, 3|9. No other values up to 1000 work.`,
  },
];

// ----------------------------------------------------------------------------
// TIER 3 QUESTIONS - PHYSICS
// ----------------------------------------------------------------------------

const PHYSICS_QUESTIONS: Question[] = [
  {
    id: 'physics-001',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `A relativistic electron with rest mass m₀ = 0.511 MeV/c² is accelerated until its total energy E equals 10 times its rest mass energy (E = 10·m₀c²).

The electron then enters a region with a uniform magnetic field B = 2.0 T, perpendicular to its velocity.

Calculate the radius of its circular path in meters.

Use: e = 1.602 × 10⁻¹⁹ C, c = 3 × 10⁸ m/s, 1 MeV = 1.602 × 10⁻¹³ J

Give your answer to 3 significant figures.`,
    answer: '0.00851',
    format: 'decimal',
    tolerance: 0.0001,
    explanation: `E = γm₀c² = 10·m₀c², so γ = 10. Using relativistic momentum p = γm₀v and r = p/(eB), the radius is approximately 0.00851 m.`,
  },
  {
    id: 'physics-002',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `A black hole has a Schwarzschild radius of 30 km. 

Calculate its mass in units of solar masses (M☉ = 2 × 10³⁰ kg).

Use: G = 6.67 × 10⁻¹¹ N·m²/kg², c = 3 × 10⁸ m/s

Round to the nearest integer.`,
    answer: '10',
    format: 'integer',
    explanation: `Schwarzschild radius Rs = 2GM/c². Solving for M: M = Rs·c²/(2G) = 30000 × (3×10⁸)²/(2 × 6.67×10⁻¹¹) ≈ 2×10³¹ kg ≈ 10 M☉.`,
  },
  {
    id: 'physics-003',
    domain: 'physics',
    tier: 3,
    difficulty: 9,
    question: `A quantum harmonic oscillator is in a superposition state |ψ⟩ = (1/√2)|0⟩ + (1/√2)|2⟩.

Calculate the expectation value of the number operator ⟨n̂⟩ = ⟨ψ|â†â|ψ⟩.

Give your answer as an integer.`,
    answer: '1',
    format: 'integer',
    explanation: `⟨n̂⟩ = |c₀|²·0 + |c₂|²·2 = (1/2)·0 + (1/2)·2 = 1.`,
  },
  {
    id: 'physics-004',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `In the photoelectric effect, light of wavelength 200 nm strikes a metal surface with work function 4.5 eV.

Calculate the maximum kinetic energy of the emitted electrons in eV.

Use: h = 4.136 × 10⁻¹⁵ eV·s, c = 3 × 10⁸ m/s

Round to 1 decimal place.`,
    answer: '1.7',
    format: 'decimal',
    tolerance: 0.1,
    explanation: `E_photon = hc/λ = (4.136×10⁻¹⁵ × 3×10⁸)/(200×10⁻⁹) = 6.2 eV. KE_max = E_photon - φ = 6.2 - 4.5 = 1.7 eV.`,
  },
];

// ----------------------------------------------------------------------------
// TIER 3 QUESTIONS - CODE
// ----------------------------------------------------------------------------

const CODE_QUESTIONS: Question[] = [
  {
    id: 'code-001',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `You have an array of n integers (n can be up to 10^6). Design an algorithm to count the number of contiguous subarrays whose XOR equals exactly k.

For the array [4, 2, 2, 6, 4] with k = 6:

1. What is the optimal time complexity for this problem?
2. How many subarrays have XOR equal to 6?

Give ONLY the count of subarrays as your answer (an integer).`,
    answer: '4',
    format: 'integer',
    explanation: `Using prefix XOR with hashmap - O(n) time. Subarrays: [4,2], [6], [4,2,2,6], [2,2,6,4]. Count = 4.`,
  },
  {
    id: 'code-002',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Given a string of balanced parentheses of length n, how many distinct ways can you partition it into valid (balanced) substrings?

For the string "(())()", how many such partitions exist?

Give your answer as an integer.`,
    answer: '2',
    format: 'integer',
    explanation: `The partitions are: ["(())()"] (whole string), ["(())", "()"]. That's 2 valid partitions.`,
  },
  {
    id: 'code-003',
    domain: 'code',
    tier: 3,
    difficulty: 9,
    question: `In a directed graph with n vertices and m edges, you want to find the number of strongly connected components.

Tarjan's algorithm runs in O(n + m) time. 

For a graph with vertices {1,2,3,4} and edges {1→2, 2→3, 3→1, 3→4, 4→4}, how many SCCs exist?

Give your answer as an integer.`,
    answer: '2',
    format: 'integer',
    explanation: `SCC 1: {1, 2, 3} (cycle). SCC 2: {4} (self-loop). Total: 2 SCCs.`,
  },
  {
    id: 'code-004',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `You are given n tasks with deadlines d_i and profits p_i. You can do at most one task per time slot.

Tasks: [(deadline=2, profit=100), (deadline=1, profit=50), (deadline=2, profit=10), (deadline=1, profit=20)]

What is the maximum profit achievable using a greedy algorithm?

Give your answer as an integer.`,
    answer: '150',
    format: 'integer',
    explanation: `Sort by profit: 100, 50, 20, 10. Schedule: slot 2 → profit 100, slot 1 → profit 50. Total = 150.`,
  },
];

// ----------------------------------------------------------------------------
// TIER 3 QUESTIONS - LOGIC
// ----------------------------------------------------------------------------

const LOGIC_QUESTIONS: Question[] = [
  {
    id: 'logic-001',
    domain: 'logic',
    tier: 3,
    difficulty: 10,
    question: `100 perfect logicians are in a room. Each wears either a red or blue hat (with at least one hat of each color). Each logician can see everyone else's hat but not their own.

They must ALL simultaneously guess their own hat color. Before entering, they can agree on a strategy.

The hat colors are assigned by an adversary who knows their strategy and will choose the worst possible distribution.

What is the MAXIMUM number of logicians that can be GUARANTEED to guess correctly, regardless of the adversarial hat distribution?

Give your answer as an integer.`,
    answer: '99',
    format: 'integer',
    explanation: `Using parity strategy with one designated "sacrifice", 99 logicians can always be correct.`,
  },
  {
    id: 'logic-002',
    domain: 'logic',
    tier: 3,
    difficulty: 10,
    question: `Three gods A, B, and C are called True, False, and Random. True always speaks truly, False always speaks falsely, Random answers randomly.

You can ask three yes-no questions, each to one god. You must determine which god is which.

What is the minimum number of questions needed to GUARANTEE identification of all three gods?

Give your answer as an integer.`,
    answer: '3',
    format: 'integer',
    explanation: `This is the famous "Hardest Logic Puzzle Ever". It can be solved in exactly 3 questions using conditional questions that account for Random.`,
  },
  {
    id: 'logic-003',
    domain: 'logic',
    tier: 3,
    difficulty: 9,
    question: `In the "Blue Eyes" puzzle, 100 people live on an island. All have blue eyes, but no one knows their own eye color. A visitor says "At least one of you has blue eyes."

If anyone deduces their eye color, they must leave at midnight.

On which day will everyone leave?

Give your answer as an integer (the day number).`,
    answer: '100',
    format: 'integer',
    explanation: `With n blue-eyed people and the announcement, everyone leaves on day n. With 100 people, they all leave on day 100.`,
  },
  {
    id: 'logic-004',
    domain: 'logic',
    tier: 3,
    difficulty: 10,
    question: `You have 12 balls, one of which is either heavier or lighter than the rest. Using a balance scale, what is the minimum number of weighings needed to GUARANTEE finding the odd ball AND determining if it's heavier or lighter?

Give your answer as an integer.`,
    answer: '3',
    format: 'integer',
    explanation: `With 3 weighings, you can handle 3^3 = 27 outcomes, which is enough to identify the odd ball among 12 and determine if it's heavier or lighter (24 possibilities).`,
  },
];

// ----------------------------------------------------------------------------
// TIER 3 QUESTIONS - MEDICINE
// ----------------------------------------------------------------------------

const MEDICINE_QUESTIONS: Question[] = [
  {
    id: 'medicine-001',
    domain: 'medicine',
    tier: 3,
    difficulty: 10,
    question: `A 45-year-old patient presents with acute kidney injury. Laboratory findings:

- BUN: 84 mg/dL (normal: 7-20)
- Creatinine: 6.2 mg/dL (normal: 0.7-1.3)
- Potassium (K+): 7.1 mEq/L (normal: 3.5-5.0)
- Bicarbonate (HCO3-): 12 mEq/L (normal: 22-28)
- pH: 7.18 (normal: 7.35-7.45)

ECG shows: peaked T waves and widened QRS complex.
The patient is anuric.

What is the MOST immediate life-threatening condition requiring intervention within minutes?

Answer with a single word (the condition name).`,
    answer: 'hyperkalemia',
    format: 'string',
    explanation: `Hyperkalemia with ECG changes indicates impending cardiac arrest. Requires immediate calcium gluconate.`,
  },
  {
    id: 'medicine-002',
    domain: 'medicine',
    tier: 3,
    difficulty: 10,
    question: `A patient presents with the triad of:
1. Confusion
2. Ophthalmoplegia (eye movement paralysis)
3. Ataxia (loss of coordination)

This classic triad is diagnostic of what condition?

Answer with the eponymous name (two words, possessive form).`,
    answer: "wernicke encephalopathy",
    format: 'string',
    explanation: `The classic triad of confusion, ophthalmoplegia, and ataxia defines Wernicke encephalopathy (thiamine/B1 deficiency).`,
  },
  {
    id: 'medicine-003',
    domain: 'medicine',
    tier: 3,
    difficulty: 9,
    question: `A patient's arterial blood gas shows:
- pH: 7.52
- PaCO2: 25 mmHg
- HCO3-: 20 mEq/L

What is the PRIMARY acid-base disorder?

Answer: respiratory alkalosis, metabolic alkalosis, respiratory acidosis, or metabolic acidosis`,
    answer: 'respiratory alkalosis',
    format: 'string',
    explanation: `pH > 7.45 = alkalosis. Low PaCO2 (25) indicates respiratory cause. This is primary respiratory alkalosis with metabolic compensation.`,
  },
  {
    id: 'medicine-004',
    domain: 'medicine',
    tier: 3,
    difficulty: 10,
    question: `Calculate the anion gap for a patient with:
- Na+: 140 mEq/L
- Cl-: 100 mEq/L  
- HCO3-: 10 mEq/L

What is the anion gap value?

Give your answer as an integer.`,
    answer: '30',
    format: 'integer',
    explanation: `Anion Gap = Na+ - (Cl- + HCO3-) = 140 - (100 + 10) = 30 mEq/L. This is significantly elevated (normal: 8-12).`,
  },
];

// ----------------------------------------------------------------------------
// BOSS QUESTIONS (3 questions for final boss fight)
// ----------------------------------------------------------------------------

export const BOSS_QUESTIONS: Question[] = [
  {
    id: 'boss-001',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `The Riemann zeta function ζ(s) = Σ(1/n^s) for n=1 to ∞.

Calculate ζ(2) = 1 + 1/4 + 1/9 + 1/16 + ...

Express your answer as a fraction of π². (e.g., if the answer is π²/3, write "1/3")`,
    answer: '1/6',
    format: 'string',
    explanation: `ζ(2) = π²/6, proven by Euler. So the answer as a fraction of π² is 1/6.`,
  },
  {
    id: 'boss-002',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `In quantum mechanics, the commutator [x̂, p̂] = iℏ.

What is the commutator [x̂², p̂] in terms of x̂, p̂, and ℏ?

Express as: coefficient * i * ℏ * x̂
Give just the coefficient as an integer.`,
    answer: '2',
    format: 'integer',
    explanation: `[x̂², p̂] = x̂[x̂,p̂] + [x̂,p̂]x̂ = x̂(iℏ) + (iℏ)x̂ = 2iℏx̂. Coefficient is 2.`,
  },
  {
    id: 'boss-003',
    domain: 'logic',
    tier: 3,
    difficulty: 10,
    question: `In Gödel's incompleteness theorems, he showed that in any consistent formal system capable of expressing arithmetic:

There exists a statement G that is:
A) True and provable
B) False and disprovable  
C) True but unprovable
D) Neither true nor false

Which option correctly describes Gödel's statement G?

Answer with just the letter.`,
    answer: 'c',
    format: 'string',
    explanation: `Gödel's first incompleteness theorem shows that G (which essentially says "I am not provable") is true but cannot be proven within the system.`,
  },
];

// ----------------------------------------------------------------------------
// COMBINED QUESTION BANK
// ----------------------------------------------------------------------------

export const QUESTIONS: Question[] = [
  ...MATH_QUESTIONS,
  ...PHYSICS_QUESTIONS,
  ...CODE_QUESTIONS,
  ...LOGIC_QUESTIONS,
  ...MEDICINE_QUESTIONS,
];

// ----------------------------------------------------------------------------
// Question Retrieval Functions
// ----------------------------------------------------------------------------

// Track used questions per game to avoid repeats
const usedQuestions = new Set<string>();

export function resetUsedQuestions(): void {
  usedQuestions.clear();
}

/**
 * Get a random Tier 3 question for a domain
 */
export function getQuestion(domain: Domain): Question | null {
  const available = QUESTIONS.filter(
    q => q.domain === domain && !usedQuestions.has(q.id)
  );
  
  if (available.length === 0) {
    // All questions used, allow repeats
    const allDomain = QUESTIONS.filter(q => q.domain === domain);
    if (allDomain.length === 0) return null;
    return allDomain[Math.floor(Math.random() * allDomain.length)];
  }
  
  const question = available[Math.floor(Math.random() * available.length)];
  usedQuestions.add(question.id);
  return question;
}

/**
 * Get a random question for a square (all Tier 3 now)
 */
export function getQuestionForSquare(domain: Domain): Question {
  const question = getQuestion(domain);
  if (!question) {
    // Fallback to any question
    return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  }
  return question;
}

/**
 * Get boss questions (3 different domains)
 */
export function getBossQuestions(): Question[] {
  return [...BOSS_QUESTIONS];
}

// ----------------------------------------------------------------------------
// Answer Validation
// ----------------------------------------------------------------------------

/**
 * Check if the provided answer is correct
 */
export function validateAnswer(question: Question, answer: string): boolean {
  const cleanAnswer = answer.trim().toLowerCase();
  const correctAnswer = question.answer.trim().toLowerCase();
  
  switch (question.format) {
    case 'integer':
      const intAnswer = parseInt(cleanAnswer.replace(/[^0-9-]/g, ''));
      const intCorrect = parseInt(correctAnswer);
      return intAnswer === intCorrect;
    
    case 'decimal':
      const floatAnswer = parseFloat(cleanAnswer);
      const floatCorrect = parseFloat(correctAnswer);
      const tolerance = question.tolerance || 0.001;
      return Math.abs(floatAnswer - floatCorrect) <= tolerance;
    
    case 'string':
      // Case-insensitive, ignore extra spaces
      return cleanAnswer.replace(/\s+/g, ' ').trim() === 
             correctAnswer.replace(/\s+/g, ' ').trim();
    
    case 'multiple_choice':
      return cleanAnswer === correctAnswer;
    
    default:
      return cleanAnswer === correctAnswer;
  }
}

// ----------------------------------------------------------------------------
// Question Statistics
// ----------------------------------------------------------------------------

export function getQuestionStats(): {
  total: number;
  byDomain: Record<Domain, number>;
  bossQuestions: number;
} {
  const byDomain: Record<Domain, number> = {
    math: 0,
    physics: 0,
    code: 0,
    logic: 0,
    medicine: 0,
  };
  
  for (const q of QUESTIONS) {
    byDomain[q.domain]++;
  }
  
  return {
    total: QUESTIONS.length,
    byDomain,
    bossQuestions: BOSS_QUESTIONS.length,
  };
}
