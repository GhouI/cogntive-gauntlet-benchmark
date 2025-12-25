// ============================================================================
// LEADERBOARD MANAGEMENT
// ============================================================================
// Updates the README.md leaderboard table with model benchmark results.
// Tracks best score for each model, updates existing entries or adds new ones.
// ============================================================================

import * as fs from 'fs';
import type { MultiStageModelResult } from '../types/index.js';

// ----------------------------------------------------------------------------
// Leaderboard Entry Interface
// ----------------------------------------------------------------------------

interface LeaderboardEntry {
  model: string;
  bestScore: number;
  bestStage: string;     // e.g., "4/4"
  bestLives: string;     // e.g., "2/5"
  bestAccuracy: string;  // e.g., "87%"
  boss: string;          // "✓ WIN" or "✗ LOSS" or "-"
  runs: number;
  lastUpdated: string;
}

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------

const README_PATH = 'README.md';
const LEADERBOARD_HEADER = '## Current Leaderboard';
const TABLE_HEADER = '| Model | Score | Stage | Lives | Accuracy | Boss | Runs | Last Updated |';
const TABLE_DIVIDER = '|-------|-------|-------|-------|----------|------|------|--------------|';

// ----------------------------------------------------------------------------
// Parse Leaderboard from README
// ----------------------------------------------------------------------------

function parseLeaderboard(readme: string): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = [];
  
  const lines = readme.split('\n');
  let inLeaderboard = false;
  let headerFound = false;
  
  for (const line of lines) {
    if (line.trim().startsWith(LEADERBOARD_HEADER)) {
      inLeaderboard = true;
      continue;
    }
    
    if (!inLeaderboard) continue;
    
    // Skip until we find the table
    if (line.includes('| Model |')) {
      headerFound = true;
      continue;
    }
    
    // Skip divider line
    if (line.includes('|---')) continue;
    
    // Check if we've left the table
    if (headerFound && !line.startsWith('|')) {
      break;
    }
    
    // Parse table row
    if (headerFound && line.startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      if (cells.length >= 8) {
        entries.push({
          model: cells[0],
          bestScore: parseInt(cells[1]) || 0,
          bestStage: cells[2],
          bestLives: cells[3],
          bestAccuracy: cells[4],
          boss: cells[5],
          runs: parseInt(cells[6]) || 1,
          lastUpdated: cells[7],
        });
      }
    }
  }
  
  return entries;
}

// ----------------------------------------------------------------------------
// Create Entry from Result
// ----------------------------------------------------------------------------

function createEntry(result: MultiStageModelResult): LeaderboardEntry {
  const stagesCompleted = result.multiStageState.stages.filter(s => s.completed).length;
  const totalStages = result.multiStageState.stages.length;
  
  let bossStatus = '-';
  if (result.multiStageState.bossFight) {
    bossStatus = result.bossDefeated ? '✓ WIN' : '✗ LOSS';
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  return {
    model: result.modelName,
    bestScore: result.totalScore,
    bestStage: `${stagesCompleted}/${totalStages}`,
    bestLives: `${result.livesRemaining}/5`,
    bestAccuracy: `${Math.round(result.accuracy * 100)}%`,
    boss: bossStatus,
    runs: 1,
    lastUpdated: today,
  };
}

// ----------------------------------------------------------------------------
// Generate Leaderboard Markdown
// ----------------------------------------------------------------------------

function generateLeaderboardMarkdown(entries: LeaderboardEntry[]): string {
  const lines: string[] = [
    LEADERBOARD_HEADER,
    '',
  ];
  
  if (entries.length === 0) {
    lines.push('No benchmark results yet. Run the benchmark to populate this table.');
    lines.push('');
    return lines.join('\n');
  }
  
  lines.push(TABLE_HEADER);
  lines.push(TABLE_DIVIDER);
  
  for (const e of entries) {
    lines.push(`| ${e.model} | ${e.bestScore} | ${e.bestStage} | ${e.bestLives} | ${e.bestAccuracy} | ${e.boss} | ${e.runs} | ${e.lastUpdated} |`);
  }
  
  lines.push('');
  return lines.join('\n');
}

// ----------------------------------------------------------------------------
// Replace Leaderboard Section in README
// ----------------------------------------------------------------------------

function replaceLeaderboardSection(readme: string, newLeaderboard: string): string {
  const lines = readme.split('\n');
  const result: string[] = [];
  
  let inLeaderboard = false;
  let skipUntilNextSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Found leaderboard section
    if (line.trim().startsWith(LEADERBOARD_HEADER)) {
      inLeaderboard = true;
      skipUntilNextSection = true;
      
      // Add new leaderboard content
      result.push(newLeaderboard.trim());
      continue;
    }
    
    // Skip old leaderboard content until next section (starts with #)
    if (skipUntilNextSection) {
      if (line.startsWith('#') && !line.startsWith(LEADERBOARD_HEADER)) {
        skipUntilNextSection = false;
        result.push(line);
      }
      continue;
    }
    
    result.push(line);
  }
  
  // If no leaderboard section was found, add it before License
  if (!inLeaderboard) {
    const licenseIndex = result.findIndex(l => l.trim().startsWith('# License'));
    if (licenseIndex >= 0) {
      result.splice(licenseIndex, 0, '', newLeaderboard.trim(), '');
    } else {
      // Add at end
      result.push('', newLeaderboard.trim());
    }
  }
  
  return result.join('\n');
}

// ----------------------------------------------------------------------------
// Update Leaderboard
// ----------------------------------------------------------------------------

export function updateLeaderboard(result: MultiStageModelResult): void {
  // Read current README
  let readme: string;
  try {
    readme = fs.readFileSync(README_PATH, 'utf-8');
  } catch {
    console.error('Could not read README.md');
    return;
  }
  
  // Parse existing leaderboard entries
  const entries = parseLeaderboard(readme);
  
  // Create new entry from result
  const newEntry = createEntry(result);
  
  // Find existing entry for this model
  const existingIndex = entries.findIndex(e => e.model === result.modelName);
  
  if (existingIndex >= 0) {
    const existing = entries[existingIndex];
    
    // Update with best score logic
    const isBetterScore = result.totalScore > existing.bestScore;
    
    entries[existingIndex] = {
      model: result.modelName,
      bestScore: Math.max(existing.bestScore, result.totalScore),
      bestStage: isBetterScore ? newEntry.bestStage : existing.bestStage,
      bestLives: isBetterScore ? newEntry.bestLives : existing.bestLives,
      bestAccuracy: isBetterScore ? newEntry.bestAccuracy : existing.bestAccuracy,
      boss: result.bossDefeated ? '✓ WIN' : (existing.boss === '✓ WIN' ? '✓ WIN' : newEntry.boss),
      runs: existing.runs + 1,
      lastUpdated: newEntry.lastUpdated,
    };
  } else {
    entries.push(newEntry);
  }
  
  // Sort by best score descending
  entries.sort((a, b) => b.bestScore - a.bestScore);
  
  // Generate new leaderboard markdown
  const leaderboardMd = generateLeaderboardMarkdown(entries);
  
  // Replace leaderboard section in README
  const updatedReadme = replaceLeaderboardSection(readme, leaderboardMd);
  
  // Write back
  try {
    fs.writeFileSync(README_PATH, updatedReadme, 'utf-8');
    console.log(`Leaderboard updated for ${result.modelName}`);
  } catch (error) {
    console.error('Could not write README.md:', error);
  }
}

// ----------------------------------------------------------------------------
// Export for testing
// ----------------------------------------------------------------------------

export { parseLeaderboard, createEntry, generateLeaderboardMarkdown };
