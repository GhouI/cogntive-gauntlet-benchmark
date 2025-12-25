// ============================================================================
// QUESTION BANK - ALL TIER 3 (EXTREMELY HARD)
// ============================================================================
// All questions are Tier 3 grand challenge level.
// Add your own questions following the format below.
// 
// Domains: math, physics, code, logic, medicine
// Formats: integer, decimal, string, multiple_choice
// ============================================================================

import type { Question, Domain, Square } from '../types/index.js';

// ----------------------------------------------------------------------------
// TIER 3 QUESTIONS - CODE
// ----------------------------------------------------------------------------

const CODE_QUESTIONS: Question[] = [
  {
    id: 'code-062',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `You are given K eggs and an N-floor building. You need to determine the highest floor F from which an egg can be dropped without breaking. What is the minimum number of moves to find F in the worst case?`,
    answer: 'O(K log N)',
    format: 'string',
    explanation: `This is the Super Egg Drop problem. Optimizing the DP leads to a solution involving binomial coefficients or binary search on the answer (moves).`,
  },
  {
    id: 'code-063',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Find the median of two sorted arrays of size m and n. The overall run time complexity should be O(log (m+n)).`,
    answer: 'Binary Search on Partition',
    format: 'string',
    explanation: `Partition both arrays such that left halves have same size as right halves. Binary search the partition position in the smaller array.`,
  },
  {
    id: 'code-064',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Given an array of integers, find the number of reverse pairs (i < j such that nums[i] > 2*nums[j]). Time complexity constraint: O(n log n).`,
    answer: 'Merge Sort / BIT',
    format: 'string',
    explanation: `Modify Merge Sort. During merge step, count pairs. Alternatively, use a Fenwick Tree (Binary Indexed Tree) or Segment Tree on discretized values.`,
  },
  {
    id: 'code-065',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Serialize and Deserialize a Binary Tree. The encoded string should be as compact as possible. What traversal is best for reconstruction?`,
    answer: 'Preorder',
    format: 'string',
    explanation: `Preorder traversal (Root, Left, Right) with markers for null allows unique reconstruction. BFS (Level order) also works.`,
  },
  {
    id: 'code-066',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Solve the N-Queens problem for N=8. How many distinct solutions exist?`,
    answer: '92',
    format: 'integer',
    explanation: `Backtracking algorithm. Place queens column by column, checking row and diagonal constraints.`,
  },
  {
    id: 'code-067',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Given a list of words, find the longest word that can be built one character at a time by other words in the list.`,
    answer: 'Trie + DFS',
    format: 'string',
    explanation: `Build a Trie. Mark end of words. DFS from root, only proceeding to nodes that are end-of-word. Track max depth.`,
  },
  {
    id: 'code-068',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Implement a LFUCache (Least Frequently Used) with get and put in O(1).`,
    answer: 'Double Linked Lists + HashMaps',
    format: 'string',
    explanation: `Use a frequency map (freq -> list of nodes) and a node map (key -> node). Maintain a min_freq variable to evict in O(1).`,
  },
  {
    id: 'code-069',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Given a non-empty string s, return the longest palindromic substring. Max length of s is 1000. Optimal algorithm?`,
    answer: "Manacher's Algorithm",
    format: 'string',
    explanation: `Manacher's algorithm solves this in O(n) time. Standard DP is O(n^2).`,
  },
  {
    id: 'code-070',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Calculate the number of digit 1 occurring in all integers less than or equal to n. (e.g. 13 -> 6).`,
    answer: 'Digit DP',
    format: 'string',
    explanation: `Count 1s at each digit position (ones, tens, hundreds) based on the current digit value and higher/lower bits.`,
  },
  {
    id: 'code-071',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Find the maximum path sum in a binary tree (any node to any node).`,
    answer: 'Recursion',
    format: 'string',
    explanation: `Post-order traversal. For each node, compute max gain from left and right. Update global max with left+right+node. Return node + max(left, right).`,
  },
  {
    id: 'code-072',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Given n non-negative integers representing an elevation map, compute how much water it can trap. Time O(n), Space O(1).`,
    answer: 'Two Pointers',
    format: 'string',
    explanation: `Maintain left_max and right_max. Move pointer from lower side. Water level is determined by the lower of the two maxes.`,
  },
  {
    id: 'code-073',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Burst Balloons: Given n balloons with values, burst them to maximize coins = nums[i-1]*nums[i]*nums[i+1].`,
    answer: 'Interval DP',
    format: 'string',
    explanation: `dp[i][j] = max coins from bursting balloons between i and j. Iterate length from 1 to n, then start index, then last balloon to burst in (i,j).`,
  },
  {
    id: 'code-074',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Wildcard Matching: Implement '?' and '*' matching. O(n) complexity preferred.`,
    answer: 'Greedy with Backtrack',
    format: 'string',
    explanation: `Keep track of the last star position and the match position in string. If mismatch, backtrack to star and advance match position.`,
  },
  {
    id: 'code-075',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Word Ladder II: Find all shortest transformation sequences from beginWord to endWord.`,
    answer: 'BFS + DFS',
    format: 'string',
    explanation: `Use BFS to find the shortest distance and build a DAG of valid transitions. Then use DFS/Backtracking on the DAG to reconstruct paths.`,
  },
  {
    id: 'code-076',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Skyline Problem: Given buildings (left, right, height), generate the skyline (contour).`,
    answer: 'Sweep Line',
    format: 'string',
    explanation: `Process critical points (left/right edges) sorted by x. Use a max-heap to track active building heights. Output point when max height changes.`,
  },
  {
    id: 'code-077',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Count of Range Sum: Given array nums, count range sums S(i, j) in [lower, upper].`,
    answer: 'Merge Sort',
    format: 'string',
    explanation: `Compute prefix sums. Use Merge Sort to count pairs (i, j) such that prefix[j] - prefix[i] is in range. Similar to inversion count.`,
  },
  {
    id: 'code-078',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Sliding Window Maximum: Find max in window of size k moving across array. O(n).`,
    answer: 'Monotonic Deque',
    format: 'string',
    explanation: `Maintain indices in a deque such that values are decreasing. Remove indices out of window from front. Add new index to back, popping smaller values. Front is max.`,
  },
  {
    id: 'code-079',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Dungeon Game: Knight at top-left, Princess at bottom-right. Grid has HP changes. Min initial HP?`,
    answer: 'Reverse DP',
    format: 'string',
    explanation: `Start from bottom-right. dp[i][j] = min HP needed to reach end. max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]).`,
  },
  {
    id: 'code-080',
    domain: 'code',
    tier: 3,
    difficulty: 10,
    question: `Sudoku Solver: Fill 9x9 grid. Algorithm?`,
    answer: 'Backtracking with Pruning',
    format: 'string',
    explanation: `Try digits 1-9 in empty cells. Check validity. Recurse. If stuck, backtrack. Bitmasks can optimize validity checks.`,
  },
  { id: 'code-081', domain: 'code', tier: 3, difficulty: 10, question: 'Traveling Salesperson Problem (TSP): Exact solution for N cities.', answer: 'Held-Karp', format: 'string', explanation: 'DP with bitmask. O(n^2 * 2^n).' },
  { id: 'code-082', domain: 'code', tier: 3, difficulty: 10, question: 'Maximum Flow problem.', answer: "Dinic's Algorithm", format: 'string', explanation: 'O(V^2 E). Builds level graphs and finding blocking flows.' },
  { id: 'code-083', domain: 'code', tier: 3, difficulty: 10, question: 'Find articulation points in a graph.', answer: "Tarjan's Algorithm", format: 'string', explanation: 'DFS. Track discovery time and low-link value. If low[child] >= disc[u], u is AP.' },
  { id: 'code-084', domain: 'code', tier: 3, difficulty: 10, question: 'Lowest Common Ancestor in a tree (offline queries).', answer: "Tarjan's Union-Find", format: 'string', explanation: 'Process nodes in post-order. Union sets. Answer queries for visited nodes.' },
  { id: 'code-085', domain: 'code', tier: 3, difficulty: 10, question: 'KMP Algorithm: What is the failure function pi[i]?', answer: 'Longest proper prefix which is also a suffix', format: 'string', explanation: 'Used to skip comparisons in pattern matching.' },
  { id: 'code-086', domain: 'code', tier: 3, difficulty: 10, question: 'Z-Algorithm: What does Z[i] represent?', answer: 'LCP of string and suffix starting at i', format: 'string', explanation: 'Longest Common Prefix matching.' },
  { id: 'code-087', domain: 'code', tier: 3, difficulty: 10, question: 'Convex Hull algorithm O(n log n).', answer: 'Monotone Chain / Graham Scan', format: 'string', explanation: 'Sort points. Build upper and lower hulls using cross product checks.' },
  { id: 'code-088', domain: 'code', tier: 3, difficulty: 10, question: 'Maximum Bipartite Matching.', answer: 'Hopcroft-Karp', format: 'string', explanation: 'O(E sqrt(V)). Augmenting paths.' },
  { id: 'code-089', domain: 'code', tier: 3, difficulty: 10, question: 'Range Minimum Query (Static).', answer: 'Sparse Table', format: 'string', explanation: 'O(1) query, O(n log n) build. Uses powers of 2 intervals.' },
  { id: 'code-090', domain: 'code', tier: 3, difficulty: 10, question: 'Invert a Binary Tree (the famous Google interview question).', answer: 'Swap left/right children recursively', format: 'string', explanation: 'Trivial recursive problem.' },
  { id: 'code-091', domain: 'code', tier: 3, difficulty: 10, question: 'Detect cycle in directed graph.', answer: 'DFS (Recursion Stack)', format: 'string', explanation: 'If node is visited and in recursion stack, cycle exists.' },
  { id: 'code-092', domain: 'code', tier: 3, difficulty: 10, question: 'Topological Sort.', answer: "Kahn's Algorithm", format: 'string', explanation: 'Queue of nodes with in-degree 0. Remove node, decrease neighbor in-degrees.' },
  { id: 'code-093', domain: 'code', tier: 3, difficulty: 10, question: 'Shortest path with negative weights.', answer: 'Bellman-Ford', format: 'string', explanation: 'Relax all edges V-1 times. Detect negative cycles.' },
  { id: 'code-094', domain: 'code', tier: 3, difficulty: 10, question: 'All-pairs shortest path.', answer: 'Floyd-Warshall', format: 'string', explanation: 'O(V^3). dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]).' },
  { id: 'code-095', domain: 'code', tier: 3, difficulty: 10, question: 'Disjoint Set Union (DSU) optimizations.', answer: 'Path Compression + Rank', format: 'string', explanation: 'Ackermann function complexity (nearly constant).' },
  { id: 'code-096', domain: 'code', tier: 3, difficulty: 10, question: 'Fenwick Tree: Update and Query complexity.', answer: 'O(log n)', format: 'string', explanation: 'Bit manipulation on indices.' },
  { id: 'code-097', domain: 'code', tier: 3, difficulty: 10, question: 'Segment Tree: Lazy Propagation.', answer: 'Deferred updates', format: 'string', explanation: 'Update range O(log n). Push changes to children only when needed.' },
  { id: 'code-098', domain: 'code', tier: 3, difficulty: 10, question: 'A* Search Heuristic requirement.', answer: 'Admissible', format: 'string', explanation: 'Heuristic must not overestimate distance to goal.' },
  { id: 'code-099', domain: 'code', tier: 3, difficulty: 10, question: 'Median of Stream.', answer: 'Two Heaps', format: 'string', explanation: 'MaxHeap for lower half, MinHeap for upper half.' },
  { id: 'code-100', domain: 'code', tier: 3, difficulty: 10, question: 'LRU Cache implementation.', answer: 'HashMap + Doubly Linked List', format: 'string', explanation: 'O(1) access and update.' },
  { id: 'code-101', domain: 'code', tier: 3, difficulty: 10, question: 'Determine if point is in polygon.', answer: 'Ray Casting', format: 'string', explanation: 'Count intersections with edges. Odd = inside.' },
  { id: 'code-102', domain: 'code', tier: 3, difficulty: 10, question: 'Maximum subarray sum.', answer: "Kadane's Algorithm", format: 'string', explanation: 'O(n). local_max = max(A[i], A[i] + local_max).' },
  { id: 'code-103', domain: 'code', tier: 3, difficulty: 10, question: 'Longest Increasing Subsequence.', answer: 'O(n log n)', format: 'string', explanation: 'Patience sorting / Binary search on tails array.' },
  { id: 'code-104', domain: 'code', tier: 3, difficulty: 10, question: 'Edit Distance.', answer: 'Levenshtein Distance', format: 'string', explanation: 'DP. Insert, Delete, Substitute.' },
  { id: 'code-105', domain: 'code', tier: 3, difficulty: 10, question: 'Bloom Filter false positives.', answer: 'Possible', format: 'string', explanation: 'Probabilistic data structure. No false negatives.' },
  { id: 'code-106', domain: 'code', tier: 3, difficulty: 10, question: 'HyperLogLog purpose.', answer: 'Cardinality Estimation', format: 'string', explanation: 'Count distinct elements in large stream.' },
  { id: 'code-107', domain: 'code', tier: 3, difficulty: 10, question: 'Consistent Hashing goal.', answer: 'Minimize remapping', format: 'string', explanation: 'Distributed caching. Adding/removing nodes affects K/N keys.' },
  { id: 'code-108', domain: 'code', tier: 3, difficulty: 10, question: 'CAP Theorem.', answer: 'Consistency, Availability, Partition Tolerance', format: 'string', explanation: 'Pick two.' },
  { id: 'code-109', domain: 'code', tier: 3, difficulty: 10, question: 'Byzantine Generals Problem.', answer: 'Consensus with traitors', format: 'string', explanation: 'Requires > 2/3 loyal generals.' },
  { id: 'code-110', domain: 'code', tier: 3, difficulty: 10, question: 'RSA encryption basis.', answer: 'Prime Factorization', format: 'string', explanation: 'Difficulty of factoring large semiprimes.' },
  { id: 'code-111', domain: 'code', tier: 3, difficulty: 10, question: 'Diffie-Hellman problem.', answer: 'Discrete Logarithm', format: 'string', explanation: 'Key exchange protocol.' },
  { id: 'code-112', domain: 'code', tier: 3, difficulty: 10, question: 'P vs NP.', answer: 'Unsolved', format: 'string', explanation: 'Does P = NP?' },
  { id: 'code-113', domain: 'code', tier: 3, difficulty: 10, question: 'Halting Problem.', answer: 'Undecidable', format: 'string', explanation: 'Turing proof.' },
  { id: 'code-114', domain: 'code', tier: 3, difficulty: 10, question: 'Quicksort worst case.', answer: 'O(n^2)', format: 'string', explanation: 'Already sorted pivot.' },
  { id: 'code-115', domain: 'code', tier: 3, difficulty: 10, question: 'Radix Sort complexity.', answer: 'O(nk)', format: 'string', explanation: 'Non-comparative sort.' },
  { id: 'code-116', domain: 'code', tier: 3, difficulty: 10, question: 'Tree rotation.', answer: 'AVL / Red-Black', format: 'string', explanation: 'Balance binary search tree.' },
  { id: 'code-117', domain: 'code', tier: 3, difficulty: 10, question: 'Skip List complexity.', answer: 'O(log n)', format: 'string', explanation: 'Probabilistic alternative to balanced trees.' },
  { id: 'code-118', domain: 'code', tier: 3, difficulty: 10, question: 'Trie space complexity.', answer: 'O(ALPHABET_SIZE * key_length * N)', format: 'string', explanation: 'High memory usage.' },
  { id: 'code-119', domain: 'code', tier: 3, difficulty: 10, question: "Floyd's Cycle-Finding Algorithm.", answer: 'Tortoise and Hare', format: 'string', explanation: 'Linked List cycle detection.' },
  { id: 'code-120', domain: 'code', tier: 3, difficulty: 10, question: 'Boyer-Moore Voting Algorithm.', answer: 'Majority Element', format: 'string', explanation: 'O(n) time, O(1) space.' },
];

// ----------------------------------------------------------------------------
// TIER 3 QUESTIONS - PHYSICS
// ----------------------------------------------------------------------------

const PHYSICS_QUESTIONS: Question[] = [
  {
    id: 'physics-121',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `A uniform hexagonal pencil lies on a rough inclined plane (angle alpha). What is the minimum angle alpha such that the pencil rolls down indefinitely (accelerating) rather than sliding or stopping? (Assume perfectly inelastic collisions with the plane).`,
    answer: '60 degrees',
    format: 'string',
    explanation: `This is the IPhO 1998 'Rolling Pencil' problem. Energy loss at each impact must be compensated by potential energy loss.`,
  },
  {
    id: 'physics-122',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `Calculate the radius of the circular path of an electron with kinetic energy 10 MeV in a 2T magnetic field.`,
    answer: '0.017 m',
    format: 'decimal',
    tolerance: 0.002,
    explanation: `Use relativistic momentum. p = sqrt(E^2 - m^2)/c. r = p/qB.`,
  },
  {
    id: 'physics-123',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `A slinky is suspended from one end and stretches under gravity. The top is released. What is the initial acceleration of the bottom of the slinky?`,
    answer: '0',
    format: 'integer',
    explanation: `Information travels at the speed of sound in the spring. The bottom doesn't 'know' the top is released until the wave reaches it. It floats.`,
  },
  {
    id: 'physics-124',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `A chain of length L and mass M is piled on a table. It is pulled up by one end at constant velocity v. What is the force F(t) as a function of height x?`,
    answer: 'Mgx/L + Mv^2/L',
    format: 'string',
    explanation: `Weight of suspended part + Rate of change of momentum (v dm/dt).`,
  },
  {
    id: 'physics-125',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `Brachistochrone problem: Find the curve of fastest descent between two points in a uniform gravity field.`,
    answer: 'Cycloid',
    format: 'string',
    explanation: `Calculus of variations. Minimizing the time integral yields the cycloid equation.`,
  },
  {
    id: 'physics-126',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `Calculate the specific heat of a Fermi gas at low temperatures (T << Tf).`,
    answer: 'Linear in T',
    format: 'string',
    explanation: `Only electrons near the Fermi surface can be excited. Fraction is T/Tf. C_v ~ T.`,
  },
  {
    id: 'physics-127',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `Two soap bubbles of radii R1 and R2 coalesce. What is the radius of the common interface?`,
    answer: 'R1R2 / (R1 - R2)',
    format: 'string',
    explanation: `Laplace pressure. P = 4 gamma / R. P_interface = P1 - P2.`,
  },
  {
    id: 'physics-128',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `Efficiencies of Carnot, Otto, and Diesel cycles. Which is highest for the same compression ratio?`,
    answer: 'Otto',
    format: 'string',
    explanation: `Otto cycle adds heat at constant volume (higher temp). Diesel at constant pressure.`,
  },
  {
    id: 'physics-129',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `Determine the critical mass of a sphere of Uranium-235. (Concept only).`,
    answer: '50 kg',
    format: 'string',
    explanation: `Neutron diffusion equation vs production rate. Approx 15cm diameter.`,
  },
  {
    id: 'physics-130',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `Twin Paradox: Twin A stays on Earth. Twin B travels at 0.8c to a star 4 lightyears away and returns. Who is older and by how much?`,
    answer: 'A is older by 4 years',
    format: 'string',
    explanation: `A ages 10 years. B ages 6 years (gamma = 1.66). B accelerates, breaking symmetry.`,
  },
  {
    id: 'physics-131',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `What is the Schwarzschild radius of the Earth? (M = 6e24 kg).`,
    answer: '9 mm',
    format: 'string',
    explanation: `Rs = 2GM/c^2.`,
  },
  {
    id: 'physics-132',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `Explain the origin of the blue sky.`,
    answer: 'Rayleigh Scattering',
    format: 'string',
    explanation: `Scattering cross section proportional to 1/lambda^4. Blue scatters more.`,
  },
  {
    id: 'physics-133',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `Calculate the magnetic field inside a long solenoid with n turns per meter and current I.`,
    answer: 'mu_0 n I',
    format: 'string',
    explanation: `Ampere's Law.`,
  },
  {
    id: 'physics-134',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `A ladder leans against a frictionless wall. Floor has friction. Min angle to not slip?`,
    answer: 'arctan(1/2mu)',
    format: 'string',
    explanation: `Torque and force balance.`,
  },
  {
    id: 'physics-135',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `Why do tea leaves gather in the center of a stirred cup?`,
    answer: 'Secondary Flow (Ekman layer)',
    format: 'string',
    explanation: `Pressure gradient balances centrifugal force for bulk. At bottom, friction reduces velocity/centrifugal force, pressure pushes inward.`,
  },
  {
    id: 'physics-136',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `Calculate the energy of the ground state of Hydrogen.`,
    answer: '-13.6 eV',
    format: 'string',
    explanation: `Bohr model or Schrodinger eq.`,
  },
  {
    id: 'physics-137',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `What is the escape velocity from Earth?`,
    answer: '11.2 km/s',
    format: 'string',
    explanation: `sqrt(2GM/R).`,
  },
  {
    id: 'physics-138',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `Resistance of a grid of infinite resistors R between adjacent nodes.`,
    answer: 'R/2',
    format: 'string',
    explanation: `Superposition of current injection/extraction.`,
  },
  {
    id: 'physics-139',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `Period of a simple pendulum with large amplitude alpha.`,
    answer: 'Elliptic Integral',
    format: 'string',
    explanation: `T = 2pi sqrt(L/g) * (1 + alpha^2/16 +...).`,
  },
  {
    id: 'physics-140',
    domain: 'physics',
    tier: 3,
    difficulty: 10,
    question: `Explain the Meissner Effect.`,
    answer: 'Expulsion of B field',
    format: 'string',
    explanation: `Superconductors are perfect diamagnets.`,
  },
  { id: 'physics-141', domain: 'physics', tier: 3, difficulty: 10, question: "Maxwell's Demon: Why does it not violate the 2nd Law?", answer: 'Information Entropy', format: 'string', explanation: "Landauer's principle: erasing information generates heat." },
  { id: 'physics-142', domain: 'physics', tier: 3, difficulty: 10, question: 'Diffraction limit of a telescope (diameter D, wavelength L).', answer: '1.22 L / D', format: 'string', explanation: 'Rayleigh criterion.' },
  { id: 'physics-143', domain: 'physics', tier: 3, difficulty: 10, question: 'Capacitance of Earth (R=6400km).', answer: '710 microFarad', format: 'string', explanation: 'C = 4 pi eps_0 R.' },
  { id: 'physics-144', domain: 'physics', tier: 3, difficulty: 10, question: 'Terminal velocity of a skydiver (approx).', answer: '50-60 m/s', format: 'string', explanation: 'Drag equals weight.' },
  { id: 'physics-145', domain: 'physics', tier: 3, difficulty: 10, question: 'Frequency of AC mains (US vs EU).', answer: '60 vs 50 Hz', format: 'string', explanation: 'Historical standards.' },
  { id: 'physics-146', domain: 'physics', tier: 3, difficulty: 10, question: 'Triple point of water temperature.', answer: '0.01 C', format: 'string', explanation: 'Definition of Kelvin scale anchor.' },
  { id: 'physics-147', domain: 'physics', tier: 3, difficulty: 10, question: 'Chandrasekhar Limit mass.', answer: '1.4 Solar Masses', format: 'string', explanation: 'White dwarf stability limit.' },
  { id: 'physics-148', domain: 'physics', tier: 3, difficulty: 10, question: 'Speed of sound in air.', answer: '343 m/s', format: 'string', explanation: 'At 20C.' },
  { id: 'physics-149', domain: 'physics', tier: 3, difficulty: 10, question: "Young's Modulus units.", answer: 'Pascal (Pa)', format: 'string', explanation: 'Stress/Strain.' },
  { id: 'physics-150', domain: 'physics', tier: 3, difficulty: 10, question: 'What carries the strong force?', answer: 'Gluons', format: 'string', explanation: 'Standard Model.' },
  { id: 'physics-151', domain: 'physics', tier: 3, difficulty: 10, question: 'Higgs Boson mass.', answer: '125 GeV', format: 'string', explanation: 'Discovered 2012.' },
  { id: 'physics-152', domain: 'physics', tier: 3, difficulty: 10, question: 'Does light have mass?', answer: 'No', format: 'string', explanation: 'Rest mass is zero.' },
  { id: 'physics-153', domain: 'physics', tier: 3, difficulty: 10, question: 'Power radiated by an accelerating charge.', answer: 'Larmor Formula', format: 'string', explanation: 'P ~ q^2 a^2.' },
  { id: 'physics-154', domain: 'physics', tier: 3, difficulty: 10, question: "Bernoulli's Principle conservation of?", answer: 'Energy', format: 'string', explanation: 'Fluid dynamics.' },
  { id: 'physics-155', domain: 'physics', tier: 3, difficulty: 10, question: 'Reynolds number indicates?', answer: 'Turbulence', format: 'string', explanation: 'Ratio of inertial to viscous forces.' },
  { id: 'physics-156', domain: 'physics', tier: 3, difficulty: 10, question: 'Curie Temperature.', answer: 'Ferromagnetism loss', format: 'string', explanation: 'Transition to paramagnetism.' },
  { id: 'physics-157', domain: 'physics', tier: 3, difficulty: 10, question: 'Event Horizon.', answer: 'Point of no return', format: 'string', explanation: 'Black hole boundary.' },
  { id: 'physics-158', domain: 'physics', tier: 3, difficulty: 10, question: "Snell's Law.", answer: 'n1 sin(th1) = n2 sin(th2)', format: 'string', explanation: 'Refraction.' },
  { id: 'physics-159', domain: 'physics', tier: 3, difficulty: 10, question: "Fermat's Principle.", answer: 'Least Time', format: 'string', explanation: 'Light takes path of min time.' },
  { id: 'physics-160', domain: 'physics', tier: 3, difficulty: 10, question: 'Heisenberg Uncertainty.', answer: 'dx dp >= hbar/2', format: 'string', explanation: 'Fundamental limit.' },
  { id: 'physics-161', domain: 'physics', tier: 3, difficulty: 10, question: 'Hubble Constant.', answer: 'Expansion rate of universe', format: 'string', explanation: '~70 km/s/Mpc.' },
  { id: 'physics-162', domain: 'physics', tier: 3, difficulty: 10, question: 'Cosmic Microwave Background temp.', answer: '2.7 K', format: 'string', explanation: 'Remnant heat.' },
  { id: 'physics-163', domain: 'physics', tier: 3, difficulty: 10, question: 'Dark Energy percentage of universe.', answer: '~68%', format: 'string', explanation: 'Lambda-CDM model.' },
  { id: 'physics-164', domain: 'physics', tier: 3, difficulty: 10, question: 'Quarks in a Proton.', answer: 'uud', format: 'string', explanation: 'Up Up Down.' },
  { id: 'physics-165', domain: 'physics', tier: 3, difficulty: 10, question: 'Total internal reflection condition.', answer: 'n1 > n2', format: 'string', explanation: 'Angle > critical angle.' },
  { id: 'physics-166', domain: 'physics', tier: 3, difficulty: 10, question: 'Ideal Gas Law.', answer: 'PV = nRT', format: 'string', explanation: 'Equation of state.' },
  { id: 'physics-167', domain: 'physics', tier: 3, difficulty: 10, question: 'Stefan-Boltzmann Law.', answer: 'P = sigma A T^4', format: 'string', explanation: 'Black body radiation.' },
  { id: 'physics-168', domain: 'physics', tier: 3, difficulty: 10, question: "Kepler's Third Law.", answer: 'T^2 ~ a^3', format: 'string', explanation: 'Orbits.' },
  { id: 'physics-169', domain: 'physics', tier: 3, difficulty: 10, question: "Hooke's Law.", answer: 'F = -kx', format: 'string', explanation: 'Springs.' },
  { id: 'physics-170', domain: 'physics', tier: 3, difficulty: 10, question: "Ohm's Law.", answer: 'V = IR', format: 'string', explanation: 'Circuits.' },
  { id: 'physics-171', domain: 'physics', tier: 3, difficulty: 10, question: 'Work-Energy Theorem.', answer: 'Work = Delta KE', format: 'string', explanation: 'Mechanics.' },
  { id: 'physics-172', domain: 'physics', tier: 3, difficulty: 10, question: 'Conservation of Angular Momentum.', answer: 'L = const', format: 'string', explanation: 'No external torque.' },
  { id: 'physics-173', domain: 'physics', tier: 3, difficulty: 10, question: 'Photoelectric Effect.', answer: 'Particle nature of light', format: 'string', explanation: 'Einstein.' },
  { id: 'physics-174', domain: 'physics', tier: 3, difficulty: 10, question: 'Double Slit Experiment.', answer: 'Wave-particle duality', format: 'string', explanation: 'Interference.' },
  { id: 'physics-175', domain: 'physics', tier: 3, difficulty: 10, question: "Schrodinger's Cat.", answer: 'Superposition', format: 'string', explanation: 'Thought experiment.' },
  { id: 'physics-176', domain: 'physics', tier: 3, difficulty: 10, question: 'Entanglement.', answer: 'Spooky action at a distance', format: 'string', explanation: 'Quantum correlation.' },
  { id: 'physics-177', domain: 'physics', tier: 3, difficulty: 10, question: 'Standard Model forces.', answer: 'Strong, Weak, EM', format: 'string', explanation: 'Gravity excluded.' },
  { id: 'physics-178', domain: 'physics', tier: 3, difficulty: 10, question: 'Half-life definition.', answer: 'Time to 50% decay', format: 'string', explanation: 'Radioactivity.' },
  { id: 'physics-179', domain: 'physics', tier: 3, difficulty: 10, question: 'Isotopes differ in.', answer: 'Neutrons', format: 'string', explanation: 'Same protons.' },
  { id: 'physics-180', domain: 'physics', tier: 3, difficulty: 10, question: 'Fusion vs Fission.', answer: 'Combine vs Split', format: 'string', explanation: 'Nuclear reactions.' },
];

// ----------------------------------------------------------------------------
// TIER 3 QUESTIONS - MATH
// ----------------------------------------------------------------------------

const MATH_QUESTIONS: Question[] = [
  {
    id: 'math-181',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `Find the last 10 digits of the sum of the series: 1^1 + 2^2 + 3^3 +... + 1000^1000.`,
    answer: '9110846700',
    format: 'integer',
    explanation: `Project Euler #48. Modular arithmetic. Compute each term mod 10^10 and sum.`,
  },
  {
    id: 'math-182',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `Calculate the sum of all the primes below two million.`,
    answer: '142913828922',
    format: 'integer',
    explanation: `Project Euler #10. Sieve of Eratosthenes.`,
  },
  {
    id: 'math-183',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `A Pythagorean triplet is a set of three natural numbers, a < b < c, for which a^2 + b^2 = c^2. There exists exactly one triplet for which a + b + c = 1000. Find the product abc.`,
    answer: '31875000',
    format: 'integer',
    explanation: `Project Euler #9. Euclid's formula m^2-n^2, 2mn, m^2+n^2.`,
  },
  {
    id: 'math-184',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `Find the sum of all the numbers that can be written as the sum of two abundant numbers. (Upper limit 28123).`,
    answer: '4179871',
    format: 'integer',
    explanation: `Project Euler #23. Generate abundant numbers, mark sums in boolean array.`,
  },
  {
    id: 'math-185',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `What is the millionth lexicographic permutation of the digits 0, 1, 2, 3, 4, 5, 6, 7, 8 and 9?`,
    answer: '2783915460',
    format: 'integer',
    explanation: `Project Euler #24. Factorial number system (Lehmer code).`,
  },
  {
    id: 'math-186',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `Evaluate the integral of ln(x) from 1 to e.`,
    answer: '1',
    format: 'integer',
    explanation: `Integration by parts. x ln x - x. Result (e - e) - (0 - 1) = 1.`,
  },
  {
    id: 'math-187',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `How many lattice paths are there from (0,0) to (20,20) moving only right and down?`,
    answer: '137846528820',
    format: 'integer',
    explanation: `Project Euler #15. 40 choose 20.`,
  },
  {
    id: 'math-188',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `What is the 10001st prime number?`,
    answer: '104743',
    format: 'integer',
    explanation: `Project Euler #7. Prime generation.`,
  },
  {
    id: 'math-189',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `Find the largest palindrome made from the product of two 3-digit numbers.`,
    answer: '906609',
    format: 'integer',
    explanation: `Project Euler #4. 993 * 913.`,
  },
  {
    id: 'math-190',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `Sum of the digits of 2^1000?`,
    answer: '1366',
    format: 'integer',
    explanation: `Project Euler #16. BigInt arithmetic.`,
  },
  {
    id: 'math-191',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `If f(x) = x^x, find f'(x).`,
    answer: 'x^x (1 + ln x)',
    format: 'string',
    explanation: `Logarithmic differentiation. y=x^x -> ln y = x ln x. y'/y = 1 + ln x.`,
  },
  {
    id: 'math-192',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `Value of infinite power tower sqrt(2) ^ sqrt(2) ^...`,
    answer: '2',
    format: 'integer',
    explanation: `x^x^... = 2 implies sqrt(2)^y = y. y=2 works. Convergence range e^-e to e^(1/e).`,
  },
  {
    id: 'math-193',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `Number of distinct terms in the sequence a^b for 2<=a<=100 and 2<=b<=100.`,
    answer: '9183',
    format: 'integer',
    explanation: `Project Euler #29. Set insertion with power reduction.`,
  },
  {
    id: 'math-194',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `Find the value of e^(i pi).`,
    answer: '-1',
    format: 'integer',
    explanation: `Euler's Identity.`,
  },
  {
    id: 'math-195',
    domain: 'math',
    tier: 3,
    difficulty: 10,
    question: `Putnam 1995 A4: Value of integral... (Concept: Area of annulus).`,
    answer: 'pi/2',
    format: 'string',
    explanation: `Complex integral reduction.`,
  },
  { id: 'math-196', domain: 'math', tier: 3, difficulty: 10, question: 'Sum of reciprocals of squares (Basel Problem).', answer: 'pi^2/6', format: 'string', explanation: 'Euler.' },
  { id: 'math-197', domain: 'math', tier: 3, difficulty: 10, question: 'Riemann Hypothesis concerns the zeros of?', answer: 'Zeta Function', format: 'string', explanation: 'Critical line Re(s)=1/2.' },
  { id: 'math-198', domain: 'math', tier: 3, difficulty: 10, question: 'First number to be the sum of two cubes in two different ways.', answer: '1729', format: 'integer', explanation: 'Ramanujan-Hardy number.' },
  { id: 'math-199', domain: 'math', tier: 3, difficulty: 10, question: 'Sum of angles in a triangle on a sphere.', answer: '> 180', format: 'string', explanation: 'Positive curvature.' },
  { id: 'math-200', domain: 'math', tier: 3, difficulty: 10, question: 'Fundamental Theorem of Calculus links?', answer: 'Differentiation and Integration', format: 'string', explanation: 'Inverse processes.' },
  { id: 'math-201', domain: 'math', tier: 3, difficulty: 10, question: 'Number of edges in K5 graph.', answer: '10', format: 'integer', explanation: '5 choose 2.' },
  { id: 'math-202', domain: 'math', tier: 3, difficulty: 10, question: 'Formula for roots of quadratic ax^2+bx+c.', answer: '(-b +/- sqrt(b^2-4ac))/2a', format: 'string', explanation: 'Quadratic formula.' },
  { id: 'math-203', domain: 'math', tier: 3, difficulty: 10, question: 'Derivative of sin(x).', answer: 'cos(x)', format: 'string', explanation: 'Basic calc.' },
  { id: 'math-204', domain: 'math', tier: 3, difficulty: 10, question: 'Integral of 1/x.', answer: 'ln|x| + C', format: 'string', explanation: 'Logarithm.' },
  { id: 'math-205', domain: 'math', tier: 3, difficulty: 10, question: 'Determinant of 2x2 identity matrix.', answer: '1', format: 'integer', explanation: 'ad-bc.' },
  { id: 'math-206', domain: 'math', tier: 3, difficulty: 10, question: 'Fibonacci(12).', answer: '144', format: 'integer', explanation: '1,1,2,3,5,8,13,21,34,55,89,144.' },
  { id: 'math-207', domain: 'math', tier: 3, difficulty: 10, question: 'Prime factors of 2023.', answer: '7, 17, 17', format: 'string', explanation: '7 * 17^2.' },
  { id: 'math-208', domain: 'math', tier: 3, difficulty: 10, question: '0! (Zero factorial).', answer: '1', format: 'integer', explanation: 'Definition.' },
  { id: 'math-209', domain: 'math', tier: 3, difficulty: 10, question: 'Number of subsets of a set size 3.', answer: '8', format: 'integer', explanation: '2^3.' },
  { id: 'math-210', domain: 'math', tier: 3, difficulty: 10, question: 'Value of sin(90 deg).', answer: '1', format: 'integer', explanation: 'Unit circle.' },
  { id: 'math-211', domain: 'math', tier: 3, difficulty: 10, question: 'Golden Ratio value (approx).', answer: '1.618', format: 'decimal', tolerance: 0.001, explanation: '(1+sqrt(5))/2.' },
  { id: 'math-212', domain: 'math', tier: 3, difficulty: 10, question: 'Is 1 a prime number?', answer: 'No', format: 'string', explanation: 'Definition excludes units.' },
  { id: 'math-213', domain: 'math', tier: 3, difficulty: 10, question: 'Volume of sphere radius r.', answer: '4/3 pi r^3', format: 'string', explanation: 'Formula.' },
  { id: 'math-214', domain: 'math', tier: 3, difficulty: 10, question: 'Sum 1 to 100.', answer: '5050', format: 'integer', explanation: 'Gauss.' },
  { id: 'math-215', domain: 'math', tier: 3, difficulty: 10, question: 'Number of faces on a Dodecahedron.', answer: '12', format: 'integer', explanation: 'Solid geometry.' },
  { id: 'math-216', domain: 'math', tier: 3, difficulty: 10, question: 'GCD of 12 and 18.', answer: '6', format: 'integer', explanation: 'Factors.' },
  { id: 'math-217', domain: 'math', tier: 3, difficulty: 10, question: 'LCM of 4 and 5.', answer: '20', format: 'integer', explanation: 'Multiples.' },
  { id: 'math-218', domain: 'math', tier: 3, difficulty: 10, question: 'Square root of -1.', answer: 'i', format: 'string', explanation: 'Imaginary unit.' },
  { id: 'math-219', domain: 'math', tier: 3, difficulty: 10, question: 'Binary for 10.', answer: '1010', format: 'integer', explanation: '8+2.' },
  { id: 'math-220', domain: 'math', tier: 3, difficulty: 10, question: 'Hexadecimal for 15.', answer: 'F', format: 'string', explanation: 'Base 16.' },
  { id: 'math-221', domain: 'math', tier: 3, difficulty: 10, question: 'Triangle Inequality.', answer: 'a+b>c', format: 'string', explanation: 'Geometry.' },
  { id: 'math-222', domain: 'math', tier: 3, difficulty: 10, question: 'Pythagorean Theorem.', answer: 'a^2+b^2=c^2', format: 'string', explanation: 'Right triangle.' },
  { id: 'math-223', domain: 'math', tier: 3, difficulty: 10, question: 'Sum of internal angles of hexagon.', answer: '720', format: 'integer', explanation: '(6-2)*180.' },
  { id: 'math-224', domain: 'math', tier: 3, difficulty: 10, question: 'Probability of rolling 7 with 2 dice.', answer: '1/6', format: 'string', explanation: '6/36.' },
  { id: 'math-225', domain: 'math', tier: 3, difficulty: 10, question: 'Permutations of ABC.', answer: '6', format: 'integer', explanation: '3!.' },
  { id: 'math-226', domain: 'math', tier: 3, difficulty: 10, question: 'Combinations 5 choose 2.', answer: '10', format: 'integer', explanation: '5*4/2.' },
  { id: 'math-227', domain: 'math', tier: 3, difficulty: 10, question: 'Slope of y=3x+2.', answer: '3', format: 'integer', explanation: 'm.' },
  { id: 'math-228', domain: 'math', tier: 3, difficulty: 10, question: 'Log base 10 of 100.', answer: '2', format: 'integer', explanation: '10^2.' },
  { id: 'math-229', domain: 'math', tier: 3, difficulty: 10, question: 'e^(ln x).', answer: 'x', format: 'string', explanation: 'Inverse functions.' },
  { id: 'math-230', domain: 'math', tier: 3, difficulty: 10, question: 'Is 0 even or odd?', answer: 'Even', format: 'string', explanation: 'Divisible by 2.' },
  { id: 'math-231', domain: 'math', tier: 3, difficulty: 10, question: 'Smallest perfect number.', answer: '6', format: 'integer', explanation: '1+2+3.' },
  { id: 'math-232', domain: 'math', tier: 3, difficulty: 10, question: 'Largest prime factor of 21.', answer: '7', format: 'integer', explanation: '3*7.' },
  { id: 'math-233', domain: 'math', tier: 3, difficulty: 10, question: 'Mode of 1,2,2,3.', answer: '2', format: 'integer', explanation: 'Most frequent.' },
  { id: 'math-234', domain: 'math', tier: 3, difficulty: 10, question: 'Median of 1,2,3,4,5.', answer: '3', format: 'integer', explanation: 'Middle.' },
  { id: 'math-235', domain: 'math', tier: 3, difficulty: 10, question: 'Mean of 2,4,6.', answer: '4', format: 'integer', explanation: 'Average.' },
  { id: 'math-236', domain: 'math', tier: 3, difficulty: 10, question: 'Range of 1 to 10.', answer: '9', format: 'integer', explanation: 'Max-Min.' },
  { id: 'math-237', domain: 'math', tier: 3, difficulty: 10, question: 'Area of circle radius 1.', answer: 'pi', format: 'string', explanation: 'pi r^2.' },
  { id: 'math-238', domain: 'math', tier: 3, difficulty: 10, question: 'Circumference diameter 1.', answer: 'pi', format: 'string', explanation: 'pi d.' },
  { id: 'math-239', domain: 'math', tier: 3, difficulty: 10, question: '4 cubed.', answer: '64', format: 'integer', explanation: '4*4*4.' },
  { id: 'math-240', domain: 'math', tier: 3, difficulty: 10, question: '2 to power 10.', answer: '1024', format: 'integer', explanation: 'Kilobyte.' },
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
    id: 'medicine-241',
    domain: 'medicine',
    tier: 3,
    difficulty: 10,
    question: `A 60M with GERD and weight loss. Biopsy of lower esophagus mass shows glands. Diagnosis?`,
    answer: 'Adenocarcinoma',
    format: 'string',
    explanation: `Barrett's esophagus progression.`,
  },
  {
    id: 'medicine-242',
    domain: 'medicine',
    tier: 3,
    difficulty: 10,
    question: `55F with tight skin, dysphagia, BP 160/110, Cr 3.0. Diagnosis?`,
    answer: 'Scleroderma Renal Crisis',
    format: 'string',
    explanation: `Systemic sclerosis complication. Tx: ACEi.`,
  },
  {
    id: 'medicine-243',
    domain: 'medicine',
    tier: 3,
    difficulty: 10,
    question: `HIV+ patient, odynophagia. Endoscopy: Punched out ulcers. Diagnosis?`,
    answer: 'Herpes Simplex Virus',
    format: 'string',
    explanation: `HSV esophagitis. CMV causes linear ulcers. Candida causes plaques.`,
  },
  {
    id: 'medicine-244',
    domain: 'medicine',
    tier: 3,
    difficulty: 10,
    question: `Child with recurrent infections. Low IgG, IgA, IgM. Diagnosis?`,
    answer: 'CVID',
    format: 'string',
    explanation: `Common Variable Immunodeficiency.`,
  },
  {
    id: 'medicine-245',
    domain: 'medicine',
    tier: 3,
    difficulty: 10,
    question: `Patient on antipsychotics. Rigid, fever >40C, high CK. Diagnosis?`,
    answer: 'Neuroleptic Malignant Syndrome',
    format: 'string',
    explanation: `NMS. Distinguished from Serotonin Syndrome by lack of clonus and 'lead pipe' rigidity.`,
  },
  {
    id: 'medicine-246',
    domain: 'medicine',
    tier: 3,
    difficulty: 10,
    question: `Patient on SSRI + Tramadol. Hyperreflexia, Clonus, Agitation. Diagnosis?`,
    answer: 'Serotonin Syndrome',
    format: 'string',
    explanation: `Excess serotonin. Clonus is hallmark.`,
  },
  {
    id: 'medicine-247',
    domain: 'medicine',
    tier: 3,
    difficulty: 10,
    question: `85M, weight loss, answers 'I don't know' to cognitive tests. Cuing helps. Diagnosis?`,
    answer: 'Pseudodementia',
    format: 'string',
    explanation: `Depression mimicking dementia.`,
  },
  {
    id: 'medicine-248',
    domain: 'medicine',
    tier: 3,
    difficulty: 10,
    question: `Sudden onset flank pain, microscopic hematuria. 4mm stone on US. Mgmt?`,
    answer: 'Hydration and Analgesia',
    format: 'string',
    explanation: `Stones < 5mm likely pass spontaneously.`,
  },
  {
    id: 'medicine-249',
    domain: 'medicine',
    tier: 3,
    difficulty: 10,
    question: `Dog bite. 3 years since Tetanus shot. Mgmt?`,
    answer: 'Rabies PEP',
    format: 'string',
    explanation: `Post-exposure prophylaxis (Ig + Vaccine) if dog status unknown. Tetanus is up to date (5-10 yrs).`,
  },
  {
    id: 'medicine-250',
    domain: 'medicine',
    tier: 3,
    difficulty: 10,
    question: `RA patient says 'I've had it'. Best response?`,
    answer: 'Empathic inquiry',
    format: 'string',
    explanation: `Assess suicidal intent vs frustration.`,
  },
  { id: 'medicine-251', domain: 'medicine', tier: 3, difficulty: 10, question: 'Unconscious patient, emergency surgery needed, no family. Consent?', answer: 'Waived', format: 'string', explanation: 'Emergency doctrine / implied consent.' },
  { id: 'medicine-252', domain: 'medicine', tier: 3, difficulty: 10, question: 'Resistant HTN despite 3 meds. Diet perfect. Most common cause?', answer: 'Non-adherence', format: 'string', explanation: 'Patient not taking meds.' },
  { id: 'medicine-253', domain: 'medicine', tier: 3, difficulty: 10, question: 'Winter, family with headache/nausea. Normal O2 sat. Diagnosis?', answer: 'Carbon Monoxide Poisoning', format: 'string', explanation: "Standard oximetry doesn't detect COHb." },
  { id: 'medicine-254', domain: 'medicine', tier: 3, difficulty: 10, question: 'Parkinsonism + Visual Hallucinations. Diagnosis?', answer: 'Lewy Body Dementia', format: 'string', explanation: 'Core features.' },
  { id: 'medicine-255', domain: 'medicine', tier: 3, difficulty: 10, question: 'Temporal headache, jaw claudication. Tx?', answer: 'Steroids', format: 'string', explanation: 'Temporal Arteritis. Prevent blindness.' },
  { id: 'medicine-256', domain: 'medicine', tier: 3, difficulty: 10, question: 'Shoulder stiffness, high ESR. Diagnosis?', answer: 'PMR', format: 'string', explanation: 'Polymyalgia Rheumatica.' },
  { id: 'medicine-257', domain: 'medicine', tier: 3, difficulty: 10, question: 'Wet, Wobbly, Wacky. Diagnosis?', answer: 'NPH', format: 'string', explanation: 'Normal Pressure Hydrocephalus.' },
  { id: 'medicine-258', domain: 'medicine', tier: 3, difficulty: 10, question: 'Crescent shape on Head CT after fall.', answer: 'Subdural Hematoma', format: 'string', explanation: 'Venous bleed.' },
  { id: 'medicine-259', domain: 'medicine', tier: 3, difficulty: 10, question: 'Facial droop in HIV+. Differential?', answer: 'Lymphoma', format: 'string', explanation: "CNS Lymphoma or Infection vs Bell's." },
  { id: 'medicine-260', domain: 'medicine', tier: 3, difficulty: 10, question: 'Renal failure + Rash + Eosinophils in urine. Cause?', answer: 'AIN', format: 'string', explanation: 'Acute Interstitial Nephritis (Drug induced).' },
  { id: 'medicine-261', domain: 'medicine', tier: 3, difficulty: 10, question: 'Yellow vision, N/V. Drug?', answer: 'Digoxin', format: 'string', explanation: 'Digitalis toxicity.' },
  { id: 'medicine-262', domain: 'medicine', tier: 3, difficulty: 10, question: 'Alcoholic, Ataxia, Confusion. Tx order?', answer: 'Thiamine before Glucose', format: 'string', explanation: 'Prevent Wernicke-Korsakoff.' },
  { id: 'medicine-263', domain: 'medicine', tier: 3, difficulty: 10, question: 'Ascending paralysis, absent reflexes.', answer: 'Guillain-Barre', format: 'string', explanation: 'Post-viral.' },
  { id: 'medicine-264', domain: 'medicine', tier: 3, difficulty: 10, question: 'Ptosis, worse at end of day.', answer: 'Myasthenia Gravis', format: 'string', explanation: 'AChR antibodies.' },
  { id: 'medicine-265', domain: 'medicine', tier: 3, difficulty: 10, question: 'Proximal weakness, improves with use.', answer: 'Lambert-Eaton', format: 'string', explanation: 'Calcium channel antibodies.' },
  { id: 'medicine-266', domain: 'medicine', tier: 3, difficulty: 10, question: 'Optic neuritis, scanning speech.', answer: 'Multiple Sclerosis', format: 'string', explanation: 'Demyelination.' },
  { id: 'medicine-267', domain: 'medicine', tier: 3, difficulty: 10, question: 'UMN + LMN signs. Sensation intact.', answer: 'ALS', format: 'string', explanation: "Lou Gehrig's." },
  { id: 'medicine-268', domain: 'medicine', tier: 3, difficulty: 10, question: 'Chorea + Depression. Genetic?', answer: "Huntington's", format: 'string', explanation: 'CAG repeats.' },
  { id: 'medicine-269', domain: 'medicine', tier: 3, difficulty: 10, question: 'Hypotension, Tracheal deviation. Tx?', answer: 'Needle Decompression', format: 'string', explanation: 'Tension Pneumothorax.' },
  { id: 'medicine-270', domain: 'medicine', tier: 3, difficulty: 10, question: "Beck's Triad. Diagnosis?", answer: 'Cardiac Tamponade', format: 'string', explanation: 'Fluid in pericardium.' },
  { id: 'medicine-271', domain: 'medicine', tier: 3, difficulty: 10, question: 'Tearing chest pain radiating to back.', answer: 'Aortic Dissection', format: 'string', explanation: 'Surgical emergency.' },
  { id: 'medicine-272', domain: 'medicine', tier: 3, difficulty: 10, question: 'S1Q3T3 on ECG.', answer: 'Pulmonary Embolism', format: 'string', explanation: 'Right heart strain.' },
  { id: 'medicine-273', domain: 'medicine', tier: 3, difficulty: 10, question: 'Septic shock pressor choice.', answer: 'Norepinephrine', format: 'string', explanation: 'First line.' },
  { id: 'medicine-274', domain: 'medicine', tier: 3, difficulty: 10, question: 'Type 1 DM, Acidosis, Ketones.', answer: 'DKA', format: 'string', explanation: 'Insulin deficiency.' },
  { id: 'medicine-275', domain: 'medicine', tier: 3, difficulty: 10, question: 'Type 2 DM, Glucose > 600, No acidosis.', answer: 'HHS', format: 'string', explanation: 'Hyperosmolar.' },
  { id: 'medicine-276', domain: 'medicine', tier: 3, difficulty: 10, question: 'Fever, Agitation, Tachycardia (Thyroid).', answer: 'Thyroid Storm', format: 'string', explanation: 'Life threatening.' },
  { id: 'medicine-277', domain: 'medicine', tier: 3, difficulty: 10, question: 'Hypotension, Hyperkalemia, Hyponatremia.', answer: 'Adrenal Crisis', format: 'string', explanation: 'Cortisol deficiency.' },
  { id: 'medicine-278', domain: 'medicine', tier: 3, difficulty: 10, question: 'Post-anesthesia rigidity. Tx?', answer: 'Dantrolene', format: 'string', explanation: 'Malignant Hyperthermia.' },
  { id: 'medicine-279', domain: 'medicine', tier: 3, difficulty: 10, question: 'Child, Fever >5d, Strawberry tongue.', answer: 'Kawasaki Disease', format: 'string', explanation: 'Vasculitis.' },
  { id: 'medicine-280', domain: 'medicine', tier: 3, difficulty: 10, question: 'Currant jelly stool.', answer: 'Intussusception', format: 'string', explanation: 'Telescoping bowel.' },
  { id: 'medicine-281', domain: 'medicine', tier: 3, difficulty: 10, question: 'Projectile non-bilious vomiting.', answer: 'Pyloric Stenosis', format: 'string', explanation: 'Olive mass.' },
  { id: 'medicine-282', domain: 'medicine', tier: 3, difficulty: 10, question: 'Drooling, Tripod position.', answer: 'Epiglottitis', format: 'string', explanation: 'Airway emergency.' },
  { id: 'medicine-283', domain: 'medicine', tier: 3, difficulty: 10, question: 'Barking cough, Steeple sign.', answer: 'Croup', format: 'string', explanation: 'Parainfluenza.' },
  { id: 'medicine-284', domain: 'medicine', tier: 3, difficulty: 10, question: 'Pregnancy HTN + Proteinuria.', answer: 'Pre-eclampsia', format: 'string', explanation: 'Seizure risk.' },
  { id: 'medicine-285', domain: 'medicine', tier: 3, difficulty: 10, question: 'Painless vaginal bleeding (Pregnancy).', answer: 'Placenta Previa', format: 'string', explanation: 'No digital exam.' },
  { id: 'medicine-286', domain: 'medicine', tier: 3, difficulty: 10, question: 'Painful vaginal bleeding, rigid uterus.', answer: 'Placental Abruption', format: 'string', explanation: 'Emergency.' },
  { id: 'medicine-287', domain: 'medicine', tier: 3, difficulty: 10, question: 'Abd pain, +hCG, empty uterus.', answer: 'Ectopic Pregnancy', format: 'string', explanation: 'Tube rupture risk.' },
  { id: 'medicine-288', domain: 'medicine', tier: 3, difficulty: 10, question: 'Postpartum hemorrhage, boggy uterus.', answer: 'Uterine Atony', format: 'string', explanation: 'Massage/Oxytocin.' },
  { id: 'medicine-289', domain: 'medicine', tier: 3, difficulty: 10, question: 'Instability, splitting, abandonment fear.', answer: 'Borderline PD', format: 'string', explanation: 'Cluster B.' },
  { id: 'medicine-290', domain: 'medicine', tier: 3, difficulty: 10, question: 'Grandiosity, lacks empathy.', answer: 'Narcissistic PD', format: 'string', explanation: 'Cluster B.' },
  { id: 'medicine-291', domain: 'medicine', tier: 3, difficulty: 10, question: 'Loner, detached.', answer: 'Schizoid PD', format: 'string', explanation: 'Cluster A.' },
  { id: 'medicine-292', domain: 'medicine', tier: 3, difficulty: 10, question: 'Magical thinking, eccentric.', answer: 'Schizotypal PD', format: 'string', explanation: 'Cluster A.' },
  { id: 'medicine-293', domain: 'medicine', tier: 3, difficulty: 10, question: 'Faking sick for internal gain.', answer: 'Factitious Disorder', format: 'string', explanation: 'Munchausen.' },
  { id: 'medicine-294', domain: 'medicine', tier: 3, difficulty: 10, question: 'Faking sick for money.', answer: 'Malingering', format: 'string', explanation: 'External gain.' },
  { id: 'medicine-295', domain: 'medicine', tier: 3, difficulty: 10, question: 'Capacity vs Competence.', answer: 'Clinical vs Legal', format: 'string', explanation: 'MD determines capacity.' },
  { id: 'medicine-296', domain: 'medicine', tier: 3, difficulty: 10, question: 'Duty to warn.', answer: 'Tarasoff', format: 'string', explanation: 'Specific threat.' },
  { id: 'medicine-297', domain: 'medicine', tier: 3, difficulty: 10, question: 'Emancipated Minor criteria.', answer: 'Married/Military', format: 'string', explanation: 'Legal status.' },
  { id: 'medicine-298', domain: 'medicine', tier: 3, difficulty: 10, question: 'Morphine for air hunger in hospice.', answer: 'Double Effect', format: 'string', explanation: 'Ethical principle.' },
  { id: 'medicine-299', domain: 'medicine', tier: 3, difficulty: 10, question: 'Organ transplant rationing.', answer: 'Equity/Utility', format: 'string', explanation: 'Ethics.' },
  { id: 'medicine-300', domain: 'medicine', tier: 3, difficulty: 10, question: 'Hyperkalemia ECG sign.', answer: 'Peaked T waves', format: 'string', explanation: 'Cardiac stability.' },
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
  ...CODE_QUESTIONS,
  ...PHYSICS_QUESTIONS,
  ...MATH_QUESTIONS,
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
 * Caches the question on the square to ensure the same question is returned
 * if the model retries the same square after failing.
 */
export function getQuestionForSquare(square: Square): Question {
  // If already cached, return the cached question
  if (square.cachedQuestion) {
    return square.cachedQuestion;
  }
  
  // Get the domain (skip void/start/goal)
  const domain = square.domain;
  if (domain === 'void' || domain === 'start' || domain === 'goal') {
    // Shouldn't happen, but fallback to random question
    const fallback = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    square.cachedQuestion = fallback;
    return fallback;
  }
  
  // Get a new question for this domain
  const question = getQuestion(domain as Domain);
  if (!question) {
    // Fallback to any question
    const fallback = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    square.cachedQuestion = fallback;
    return fallback;
  }
  
  // Cache and return
  square.cachedQuestion = question;
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
 * Common abbreviations and their expansions for fuzzy matching
 */
const ABBREVIATION_MAP: Record<string, string[]> = {
  'nph': ['normal pressure hydrocephalus'],
  'pd': ['personality disorder'],
  'ke': ['kinetic energy'],
  'dfs': ['depth first search', 'depth-first search'],
  'bfs': ['breadth first search', 'breadth-first search'],
  'dp': ['dynamic programming'],
  'np': ['nondeterministic polynomial', 'non-deterministic polynomial'],
  'cpu': ['central processing unit'],
  'gpu': ['graphics processing unit'],
  'ram': ['random access memory'],
  'sql': ['structured query language'],
  'api': ['application programming interface'],
  'http': ['hypertext transfer protocol'],
  'tcp': ['transmission control protocol'],
  'ip': ['internet protocol'],
  'dns': ['domain name system'],
  'html': ['hypertext markup language'],
  'css': ['cascading style sheets'],
  'xml': ['extensible markup language'],
  'json': ['javascript object notation'],
  'ml': ['machine learning'],
  'ai': ['artificial intelligence'],
  'nn': ['neural network'],
  'cnn': ['convolutional neural network'],
  'rnn': ['recurrent neural network'],
  'llm': ['large language model'],
  'nlp': ['natural language processing'],
  'cv': ['computer vision'],
  'rl': ['reinforcement learning'],
  'gd': ['gradient descent'],
  'sgd': ['stochastic gradient descent'],
  'mse': ['mean squared error'],
  'mae': ['mean absolute error'],
  'roc': ['receiver operating characteristic'],
  'auc': ['area under curve', 'area under the curve'],
  'pca': ['principal component analysis'],
  'svm': ['support vector machine'],
  'knn': ['k nearest neighbors', 'k-nearest neighbors'],
  'rf': ['random forest'],
  'xgb': ['xgboost', 'extreme gradient boosting'],
  'lstm': ['long short term memory', 'long short-term memory'],
  'gan': ['generative adversarial network'],
  'vae': ['variational autoencoder'],
  'bert': ['bidirectional encoder representations from transformers'],
  'gpt': ['generative pre-trained transformer'],
  'adhd': ['attention deficit hyperactivity disorder'],
  'ocd': ['obsessive compulsive disorder', 'obsessive-compulsive disorder'],
  'ptsd': ['post traumatic stress disorder', 'post-traumatic stress disorder'],
  'bpd': ['borderline personality disorder'],
  'npd': ['narcissistic personality disorder'],
  'aspd': ['antisocial personality disorder'],
  'gad': ['generalized anxiety disorder'],
  'mdd': ['major depressive disorder'],
  'bp': ['bipolar disorder', 'blood pressure'],
  'cbt': ['cognitive behavioral therapy', 'cognitive-behavioral therapy'],
  'dbt': ['dialectical behavior therapy', 'dialectical behavioral therapy'],
  'emdr': ['eye movement desensitization and reprocessing'],
  'ecg': ['electrocardiogram'],
  'ekg': ['electrocardiogram'],
  'eeg': ['electroencephalogram'],
  'mri': ['magnetic resonance imaging'],
  'ct': ['computed tomography'],
  'pet': ['positron emission tomography'],
  'iv': ['intravenous'],
  'im': ['intramuscular'],
  'po': ['per os', 'by mouth'],
  'prn': ['as needed', 'pro re nata'],
  'bid': ['twice daily'],
  'tid': ['three times daily'],
  'qid': ['four times daily'],
  'stat': ['immediately'],
  'dx': ['diagnosis'],
  'tx': ['treatment'],
  'rx': ['prescription'],
  'hx': ['history'],
  'sx': ['symptoms'],
  'fx': ['fracture', 'function'],
};

/**
 * Filler words to ignore during keyword comparison
 */
const FILLER_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
  'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
  'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'between', 'under', 'again', 'further', 'then', 'once',
  'and', 'but', 'or', 'nor', 'so', 'yet', 'both', 'either', 'neither',
  'not', 'only', 'own', 'same', 'than', 'too', 'very', 'just',
]);

/**
 * Fuzzy match for string answers
 * Handles abbreviations, containment, alternatives, and keyword matching
 */
function fuzzyMatch(modelAnswer: string, correctAnswer: string): boolean {
  const model = modelAnswer.toLowerCase().trim().replace(/\s+/g, ' ');
  const correct = correctAnswer.toLowerCase().trim().replace(/\s+/g, ' ');
  
  // 1. Exact match
  if (model === correct) return true;
  
  // 2. Containment (model contains correct or correct contains model)
  if (model.includes(correct) || correct.includes(model)) return true;
  
  // 3. Handle "/" alternatives (e.g., "Monotone Chain / Graham Scan")
  const alternatives = correct.split('/').map(s => s.trim());
  for (const alt of alternatives) {
    if (alt.length > 0 && (model.includes(alt) || alt.includes(model))) {
      return true;
    }
  }
  
  // Also check if model answer matches any alternative exactly
  if (alternatives.some(alt => alt === model)) return true;
  
  // 4. Abbreviation expansion
  for (const [abbrev, expansions] of Object.entries(ABBREVIATION_MAP)) {
    // Check both directions: abbrev in correct with expansion in model, or vice versa
    const abbrevPattern = new RegExp(`\\b${abbrev}\\b`, 'i');
    
    for (const expansion of expansions) {
      // If correct contains abbreviation and model contains expansion
      if (abbrevPattern.test(correct) && model.includes(expansion)) {
        return true;
      }
      // If model contains abbreviation and correct contains expansion
      if (abbrevPattern.test(model) && correct.includes(expansion)) {
        return true;
      }
      // If correct contains expansion and model contains abbreviation
      if (correct.includes(expansion) && abbrevPattern.test(model)) {
        return true;
      }
      // If model contains expansion and correct contains abbreviation
      if (model.includes(expansion) && abbrevPattern.test(correct)) {
        return true;
      }
    }
  }
  
  // 5. Keyword extraction and comparison
  const modelWords = model.split(/\s+/).filter(w => !FILLER_WORDS.has(w) && w.length > 1);
  const correctWords = correct.split(/\s+/).filter(w => !FILLER_WORDS.has(w) && w.length > 1);
  
  if (correctWords.length > 0 && modelWords.length > 0) {
    // Check if all significant correct words appear in model (fuzzy)
    const allCorrectWordsPresent = correctWords.every(cw => 
      modelWords.some(mw => mw.includes(cw) || cw.includes(mw) || levenshteinSimilar(mw, cw))
    );
    
    // Require at least 70% of correct words to be present
    const matchCount = correctWords.filter(cw =>
      modelWords.some(mw => mw.includes(cw) || cw.includes(mw) || levenshteinSimilar(mw, cw))
    ).length;
    
    const matchRatio = matchCount / correctWords.length;
    
    if (allCorrectWordsPresent || matchRatio >= 0.7) {
      return true;
    }
  }
  
  // 6. Numeric equivalence (e.g., "4 years" vs "4 years")
  const modelNumbers: string[] = model.match(/\d+(\.\d+)?/g) || [];
  const correctNumbers: string[] = correct.match(/\d+(\.\d+)?/g) || [];
  
  if (modelNumbers.length > 0 && correctNumbers.length > 0) {
    // Check if key numbers match and some context words match
    const numbersMatch = correctNumbers.every(cn => modelNumbers.includes(cn));
    if (numbersMatch && modelWords.some(mw => correctWords.some(cw => mw.includes(cw) || cw.includes(mw)))) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if two words are similar using Levenshtein distance
 * Returns true if edit distance is <= 2 for words of length > 4
 */
function levenshteinSimilar(a: string, b: string): boolean {
  if (a.length < 4 || b.length < 4) return false;
  if (Math.abs(a.length - b.length) > 2) return false;
  
  const matrix: number[][] = [];
  
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  const distance = matrix[a.length][b.length];
  return distance <= 2;
}

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
      // Use fuzzy matching for string answers
      return fuzzyMatch(cleanAnswer, correctAnswer);
    
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
