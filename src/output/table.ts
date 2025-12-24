// ============================================================================
// TERMINAL TABLE OUTPUT
// ============================================================================

import Table from 'cli-table3';
import chalk from 'chalk';
import type { ModelResult, BenchmarkResult } from '../types/index.js';
import { getModelDisplayName } from '../config/models.js';

// ----------------------------------------------------------------------------
// Format Helpers
// ----------------------------------------------------------------------------

function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString('en-US', { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatCost(cost: number): string {
  if (cost === 0) return '$0.00';
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(3)}`;
}

function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatPercentage(value: number): string {
  return `${value}%`;
}

function formatProgress(position: string, won: boolean): string {
  if (won) return chalk.green(`${position} ✓`);
  return chalk.yellow(position);
}

function formatLives(remaining: number): string {
  if (remaining === 0) return chalk.red('0/5');
  if (remaining <= 2) return chalk.yellow(`${remaining}/5`);
  return chalk.green(`${remaining}/5`);
}

// ----------------------------------------------------------------------------
// Main Results Table
// ----------------------------------------------------------------------------

export function renderResultsTable(results: BenchmarkResult): string {
  const output: string[] = [];
  
  // Header
  output.push('');
  output.push(chalk.bold.cyan('═'.repeat(100)));
  output.push(chalk.bold.cyan(`  COGNITIVE GAUNTLET - BENCHMARK RESULTS`));
  output.push(chalk.bold.cyan(`  Seed: ${results.seed} | ${results.timestamp}`));
  output.push(chalk.bold.cyan('═'.repeat(100)));
  output.push('');
  
  // Main results table
  const mainTable = new Table({
    head: [
      chalk.bold('Model'),
      chalk.bold('Score'),
      chalk.bold('Lives'),
      chalk.bold('Progress'),
      chalk.bold('Accuracy'),
      chalk.bold('Planning'),
      chalk.bold('Rules'),
      chalk.bold('Time'),
      chalk.bold('Cost'),
    ],
    colWidths: [28, 8, 8, 12, 10, 10, 8, 10, 10],
    style: {
      head: [],
      border: [],
    },
  });
  
  // Sort by score descending
  const sortedResults = [...results.results].sort((a, b) => b.score.total - a.score.total);
  
  for (const result of sortedResults) {
    const displayName = getModelDisplayName(result.modelId);
    const truncatedName = displayName.length > 26 
      ? displayName.substring(0, 23) + '...' 
      : displayName;
    
    mainTable.push([
      truncatedName,
      chalk.bold(formatNumber(result.score.total)),
      formatLives(result.score.livesRemaining),
      formatProgress(result.gameState.currentPosition, result.gameState.won),
      formatPercentage(result.score.subScores.domainAccuracy),
      formatPercentage(result.score.subScores.planning),
      formatPercentage(result.score.subScores.ruleAdherence),
      formatTime(result.apiUsage.totalTimeMs),
      formatCost(result.apiUsage.totalCost),
    ]);
  }
  
  output.push(mainTable.toString());
  output.push('');
  
  return output.join('\n');
}

// ----------------------------------------------------------------------------
// Token Usage Table
// ----------------------------------------------------------------------------

export function renderTokenTable(results: BenchmarkResult): string {
  const output: string[] = [];
  
  output.push(chalk.bold.cyan('  TOKEN USAGE'));
  output.push(chalk.bold.cyan('─'.repeat(70)));
  output.push('');
  
  const tokenTable = new Table({
    head: [
      chalk.bold('Model'),
      chalk.bold('Input'),
      chalk.bold('Output'),
      chalk.bold('Total'),
    ],
    colWidths: [28, 14, 14, 14],
    style: {
      head: [],
      border: [],
    },
  });
  
  // Sort by score descending (same order as main table)
  const sortedResults = [...results.results].sort((a, b) => b.score.total - a.score.total);
  
  for (const result of sortedResults) {
    const displayName = getModelDisplayName(result.modelId);
    const truncatedName = displayName.length > 26 
      ? displayName.substring(0, 23) + '...' 
      : displayName;
    
    tokenTable.push([
      truncatedName,
      formatNumber(result.apiUsage.inputTokens),
      formatNumber(result.apiUsage.outputTokens),
      formatNumber(result.apiUsage.totalTokens),
    ]);
  }
  
  output.push(tokenTable.toString());
  output.push('');
  
  return output.join('\n');
}

// ----------------------------------------------------------------------------
// Detailed Stats Table
// ----------------------------------------------------------------------------

export function renderDetailedStats(results: BenchmarkResult): string {
  const output: string[] = [];
  
  output.push(chalk.bold.cyan('  DETAILED STATISTICS'));
  output.push(chalk.bold.cyan('─'.repeat(90)));
  output.push('');
  
  const detailTable = new Table({
    head: [
      chalk.bold('Model'),
      chalk.bold('Turns'),
      chalk.bold('Q. Asked'),
      chalk.bold('Q. Correct'),
      chalk.bold('Illegal'),
      chalk.bold('Bad JSON'),
      chalk.bold('Errors'),
    ],
    colWidths: [28, 8, 10, 12, 10, 10, 10],
    style: {
      head: [],
      border: [],
    },
  });
  
  const sortedResults = [...results.results].sort((a, b) => b.score.total - a.score.total);
  
  for (const result of sortedResults) {
    const displayName = getModelDisplayName(result.modelId);
    const truncatedName = displayName.length > 26 
      ? displayName.substring(0, 23) + '...' 
      : displayName;
    
    const state = result.gameState;
    
    detailTable.push([
      truncatedName,
      formatNumber(state.turn),
      formatNumber(state.questionsAnswered),
      formatNumber(state.questionsCorrect),
      state.illegalMoves > 0 ? chalk.red(formatNumber(state.illegalMoves)) : '0',
      state.invalidJsonCount > 0 ? chalk.red(formatNumber(state.invalidJsonCount)) : '0',
      result.score.errors > 0 ? chalk.red(formatNumber(result.score.errors)) : '0',
    ]);
  }
  
  output.push(detailTable.toString());
  output.push('');
  
  return output.join('\n');
}

// ----------------------------------------------------------------------------
// Full Report
// ----------------------------------------------------------------------------

export function renderFullReport(results: BenchmarkResult): string {
  const output: string[] = [];
  
  output.push(renderResultsTable(results));
  output.push(renderTokenTable(results));
  output.push(renderDetailedStats(results));
  
  // Footer
  output.push(chalk.dim('─'.repeat(100)));
  output.push(chalk.dim(`  Log files saved to: logs/`));
  output.push(chalk.dim('─'.repeat(100)));
  output.push('');
  
  return output.join('\n');
}

// ----------------------------------------------------------------------------
// Progress Indicator
// ----------------------------------------------------------------------------

export function renderProgress(modelId: string, current: number, total: number): string {
  const displayName = getModelDisplayName(modelId);
  const progress = Math.round((current / total) * 100);
  const bar = '█'.repeat(Math.floor(progress / 5)) + '░'.repeat(20 - Math.floor(progress / 5));
  
  return chalk.cyan(`  [${bar}] ${progress}% - Running: ${displayName}`);
}

// ----------------------------------------------------------------------------
// Model Start/End Messages
// ----------------------------------------------------------------------------

export function renderModelStart(modelId: string, index: number, total: number): string {
  const displayName = getModelDisplayName(modelId);
  return chalk.cyan(`\n  [${index}/${total}] Starting benchmark for: ${chalk.bold(displayName)}\n`);
}

export function renderModelComplete(modelId: string, won: boolean, score: number): string {
  const displayName = getModelDisplayName(modelId);
  const status = won ? chalk.green('WON') : chalk.yellow('LOST');
  return chalk.cyan(`  Completed: ${displayName} - ${status} - Score: ${chalk.bold(score)}\n`);
}
