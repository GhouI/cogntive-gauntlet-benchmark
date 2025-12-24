// ============================================================================
// TERMINAL TABLE OUTPUT - MULTI-STAGE
// ============================================================================

import Table from 'cli-table3';
import chalk from 'chalk';
import type { MultiStageModelResult, MultiStageBenchmarkResult } from '../types/index.js';
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
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

function formatPercentage(value: number): string {
  return `${value}%`;
}

function formatLives(remaining: number): string {
  if (remaining === 0) return chalk.red('0/5');
  if (remaining <= 2) return chalk.yellow(`${remaining}/5`);
  return chalk.green(`${remaining}/5`);
}

function formatStage(stageReached: number, bossDefeated: boolean): string {
  if (bossDefeated) return chalk.green(`4/4 ✓`);
  if (stageReached === 4) return chalk.yellow(`4/4 (Boss ✗)`);
  return chalk.yellow(`${stageReached}/4`);
}

function formatBoss(bossDefeated: boolean, stageReached: number): string {
  if (stageReached < 4) return chalk.dim('-');
  if (bossDefeated) return chalk.green('✓ WIN');
  return chalk.red('✗ LOSS');
}

// ----------------------------------------------------------------------------
// Main Results Table
// ----------------------------------------------------------------------------

export function renderMultiStageResultsTable(results: MultiStageBenchmarkResult): string {
  const output: string[] = [];
  
  // Header
  output.push('');
  output.push(chalk.bold.cyan('═'.repeat(115)));
  output.push(chalk.bold.cyan(`                           COGNITIVE GAUNTLET - MULTI-STAGE RESULTS`));
  output.push(chalk.bold.cyan(`                           Seeds: ${results.baseSeed}-${results.baseSeed + 3} | ${results.timestamp}`));
  output.push(chalk.bold.cyan('═'.repeat(115)));
  output.push('');
  
  // Main results table
  const mainTable = new Table({
    head: [
      chalk.bold('Model'),
      chalk.bold('Score'),
      chalk.bold('Stage'),
      chalk.bold('Lives'),
      chalk.bold('Accuracy'),
      chalk.bold('Planning'),
      chalk.bold('Rules'),
      chalk.bold('Time'),
      chalk.bold('Cost'),
      chalk.bold('Boss'),
    ],
    colWidths: [26, 8, 12, 8, 10, 10, 8, 10, 10, 10],
    style: {
      head: [],
      border: [],
    },
  });
  
  // Sort by score descending
  const sortedResults = [...results.results].sort((a, b) => b.totalScore - a.totalScore);
  
  for (const result of sortedResults) {
    const displayName = getModelDisplayName(result.modelId);
    const truncatedName = displayName.length > 24 
      ? displayName.substring(0, 21) + '...' 
      : displayName;
    
    mainTable.push([
      truncatedName,
      chalk.bold(formatNumber(result.totalScore)),
      formatStage(result.stageReached, result.bossDefeated),
      formatLives(result.livesRemaining),
      formatPercentage(result.accuracy),
      formatPercentage(result.planningScore),
      formatPercentage(result.ruleScore),
      formatTime(result.apiUsage.totalTimeMs),
      formatCost(result.apiUsage.totalCost),
      formatBoss(result.bossDefeated, result.stageReached),
    ]);
  }
  
  output.push(mainTable.toString());
  output.push('');
  
  return output.join('\n');
}

// ----------------------------------------------------------------------------
// Stage Breakdown Table
// ----------------------------------------------------------------------------

export function renderStageBreakdown(results: MultiStageBenchmarkResult): string {
  const output: string[] = [];
  
  output.push(chalk.bold.cyan('  STAGE BREAKDOWN'));
  output.push(chalk.bold.cyan('─'.repeat(90)));
  output.push('');
  
  const stageTable = new Table({
    head: [
      chalk.bold('Model'),
      chalk.bold('Stage 1'),
      chalk.bold('Stage 2'),
      chalk.bold('Stage 3'),
      chalk.bold('Stage 4'),
    ],
    colWidths: [26, 16, 16, 16, 20],
    style: {
      head: [],
      border: [],
    },
  });
  
  const sortedResults = [...results.results].sort((a, b) => b.totalScore - a.totalScore);
  
  for (const result of sortedResults) {
    const displayName = getModelDisplayName(result.modelId);
    const truncatedName = displayName.length > 24 
      ? displayName.substring(0, 21) + '...' 
      : displayName;
    
    const stageCells: string[] = [];
    
    for (let i = 0; i < 4; i++) {
      const stage = result.multiStageState.stages[i];
      if (!stage) {
        stageCells.push(chalk.dim('-'));
      } else if (stage.completed) {
        if (i === 3 && stage.bossAttempted) {
          if (stage.bossDefeated) {
            stageCells.push(chalk.green(`✓ +${stage.bonus}`));
          } else {
            stageCells.push(chalk.yellow(`H8 (Boss ✗)`));
          }
        } else {
          stageCells.push(chalk.green(`✓ +${stage.bonus}`));
        }
      } else {
        stageCells.push(chalk.red(`${stage.finalPosition} ☠`));
      }
    }
    
    stageTable.push([truncatedName, ...stageCells]);
  }
  
  output.push(stageTable.toString());
  output.push('');
  
  return output.join('\n');
}

// ----------------------------------------------------------------------------
// Token Usage Table
// ----------------------------------------------------------------------------

export function renderMultiStageTokenTable(results: MultiStageBenchmarkResult): string {
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
    colWidths: [26, 14, 14, 14],
    style: {
      head: [],
      border: [],
    },
  });
  
  const sortedResults = [...results.results].sort((a, b) => b.totalScore - a.totalScore);
  
  for (const result of sortedResults) {
    const displayName = getModelDisplayName(result.modelId);
    const truncatedName = displayName.length > 24 
      ? displayName.substring(0, 21) + '...' 
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
// Full Multi-Stage Report
// ----------------------------------------------------------------------------

export function renderMultiStageFullReport(results: MultiStageBenchmarkResult): string {
  const output: string[] = [];
  
  output.push(renderMultiStageResultsTable(results));
  output.push(renderStageBreakdown(results));
  output.push(renderMultiStageTokenTable(results));
  
  // Footer
  output.push(chalk.dim('─'.repeat(115)));
  output.push(chalk.dim(`  Log files saved to: logs/`));
  output.push(chalk.dim('─'.repeat(115)));
  output.push('');
  
  return output.join('\n');
}

// ----------------------------------------------------------------------------
// Model Start/End Messages
// ----------------------------------------------------------------------------

export function renderModelStart(modelId: string, index: number, total: number): string {
  const displayName = getModelDisplayName(modelId);
  return chalk.cyan(`\n  [${index}/${total}] Starting multi-stage benchmark for: ${chalk.bold(displayName)}\n`);
}

export function renderModelComplete(
  modelId: string, 
  stageReached: number, 
  bossDefeated: boolean, 
  score: number
): string {
  const displayName = getModelDisplayName(modelId);
  let status: string;
  
  if (bossDefeated) {
    status = chalk.green('BOSS DEFEATED!');
  } else if (stageReached === 4) {
    status = chalk.yellow('Boss Fight Lost');
  } else {
    status = chalk.red(`Defeated at Stage ${stageReached}`);
  }
  
  return chalk.cyan(`  Completed: ${displayName} - ${status} - Score: ${chalk.bold(score)}\n`);
}

// ----------------------------------------------------------------------------
// Stage Progress Message
// ----------------------------------------------------------------------------

export function renderStageProgress(modelId: string, stageNumber: number, stageName: string): string {
  const displayName = getModelDisplayName(modelId);
  return chalk.dim(`    Stage ${stageNumber}/4: ${stageName}...`);
}
