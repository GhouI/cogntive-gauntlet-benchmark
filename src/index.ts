// ============================================================================
// COGNITIVE GAUNTLET - MAIN ENTRY POINT (MULTI-STAGE)
// ============================================================================

import 'dotenv/config';
import chalk from 'chalk';

import { MODELS, getModelDisplayName } from './config/models.js';
import { runMultiStageGame } from './game/engine.js';
import { calculateMultiStageScore } from './game/scoring.js';
import { generateStageBoard, visualizeBoard } from './game/board.js';
import { createMultiStageLogger } from './output/logger.js';
import { 
  renderMultiStageFullReport, 
  renderModelStart, 
  renderModelComplete,
} from './output/table.js';
import { STAGES, getStageSeed } from './game/stages.js';
import type { MultiStageModelResult, MultiStageBenchmarkResult } from './types/index.js';

// ----------------------------------------------------------------------------
// Banner
// ----------------------------------------------------------------------------

function printBanner(): void {
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                       ║
║   ██████╗ ██████╗  ██████╗ ███╗   ██╗██╗████████╗██╗██╗   ██╗███████╗                ║
║  ██╔════╝██╔═══██╗██╔════╝ ████╗  ██║██║╚══██╔══╝██║██║   ██║██╔════╝                ║
║  ██║     ██║   ██║██║  ███╗██╔██╗ ██║██║   ██║   ██║██║   ██║█████╗                  ║
║  ██║     ██║   ██║██║   ██║██║╚██╗██║██║   ██║   ██║╚██╗ ██╔╝██╔══╝                  ║
║  ╚██████╗╚██████╔╝╚██████╔╝██║ ╚████║██║   ██║   ██║ ╚████╔╝ ███████╗                ║
║   ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝  ╚═══╝  ╚══════╝                ║
║                                                                                       ║
║   ██████╗  █████╗ ██╗   ██╗███╗   ██╗████████╗██╗     ███████╗████████╗              ║
║  ██╔════╝ ██╔══██╗██║   ██║████╗  ██║╚══██╔══╝██║     ██╔════╝╚══██╔══╝              ║
║  ██║  ███╗███████║██║   ██║██╔██╗ ██║   ██║   ██║     █████╗     ██║                 ║
║  ██║   ██║██╔══██║██║   ██║██║╚██╗██║   ██║   ██║     ██╔══╝     ██║                 ║
║  ╚██████╔╝██║  ██║╚██████╔╝██║ ╚████║   ██║   ███████╗███████╗   ██║                 ║
║   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚══════╝   ╚═╝                 ║
║                                                                                       ║
║                    MULTI-STAGE AI MODEL EVALUATION BENCHMARK                          ║
║                         4 Stages + Boss Fight | All Tier 3                            ║
║                                                                                       ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
`));
}

// ----------------------------------------------------------------------------
// Validate Environment
// ----------------------------------------------------------------------------

function validateEnvironment(): void {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error(chalk.red('\n  ERROR: OPENROUTER_API_KEY not found!\n'));
    console.error(chalk.yellow('  Please create a .env file with your API key:'));
    console.error(chalk.gray('  OPENROUTER_API_KEY=your_key_here\n'));
    console.error(chalk.yellow('  Get your key at: https://openrouter.ai/keys\n'));
    process.exit(1);
  }
  
  if (MODELS.length === 0) {
    console.error(chalk.red('\n  ERROR: No models configured!\n'));
    console.error(chalk.yellow('  Please add models to src/config/models.ts'));
    console.error(chalk.gray('  Example:'));
    console.error(chalk.gray('    export const MODELS: string[] = ['));
    console.error(chalk.gray('      "anthropic/claude-3.5-sonnet",'));
    console.error(chalk.gray('      "openai/gpt-4o",'));
    console.error(chalk.gray('    ];\n'));
    process.exit(1);
  }
}

// ----------------------------------------------------------------------------
// Main Benchmark Function
// ----------------------------------------------------------------------------

async function runBenchmark(): Promise<void> {
  printBanner();
  validateEnvironment();
  
  // Generate a random base seed for this benchmark run
  const baseSeed = Math.floor(Math.random() * 1000000);
  const timestamp = new Date().toISOString();
  
  console.log(chalk.cyan(`\n  Benchmark Configuration:`));
  console.log(chalk.gray(`  ─────────────────────────────────────────`));
  console.log(chalk.white(`  Base Seed: ${chalk.bold(baseSeed)}`));
  console.log(chalk.white(`  Stage Seeds: ${baseSeed} - ${baseSeed + 3}`));
  console.log(chalk.white(`  Models: ${chalk.bold(MODELS.length)}`));
  console.log(chalk.white(`  Mode: 4-Stage Challenge + Boss Fight`));
  console.log(chalk.white(`  Difficulty: ALL TIER 3 (Maximum)`));
  console.log(chalk.gray(`  ─────────────────────────────────────────\n`));
  
  // Show stages overview
  console.log(chalk.cyan(`  Stages:`));
  for (const stage of STAGES) {
    const bossIndicator = stage.hasBoss ? chalk.red(' [BOSS]') : '';
    console.log(chalk.white(`    ${stage.number}. ${stage.name} (${stage.voidPattern})${bossIndicator}`));
  }
  console.log();
  
  // Show board previews for all stages
  console.log(chalk.cyan(`  Board Previews:`));
  for (const stage of STAGES) {
    const stageSeed = getStageSeed(baseSeed, stage.number);
    const board = generateStageBoard(stageSeed, stage.voidPattern);
    console.log(chalk.yellow(`\n  Stage ${stage.number}: ${stage.name} (Seed: ${stageSeed})`));
    console.log(visualizeBoard(board).split('\n').map(l => '    ' + l).join('\n'));
  }
  console.log();
  
  // List models to be tested
  console.log(chalk.cyan(`  Models to benchmark:`));
  for (let i = 0; i < MODELS.length; i++) {
    console.log(chalk.white(`    ${i + 1}. ${getModelDisplayName(MODELS[i])}`));
  }
  console.log();
  
  // Run benchmark for each model
  const results: MultiStageModelResult[] = [];
  
  for (let i = 0; i < MODELS.length; i++) {
    const modelId = MODELS[i];
    console.log(renderModelStart(modelId, i + 1, MODELS.length));
    
    // Create logger for this model
    const logger = createMultiStageLogger(modelId, baseSeed);
    
    try {
      // Run the multi-stage game
      const { state, apiUsage } = await runMultiStageGame(modelId, baseSeed, logger);
      
      // Calculate score
      const scoreData = calculateMultiStageScore(state);
      
      // Save log file
      const logPath = logger.save();
      
      // Store result
      results.push({
        modelId,
        modelName: getModelDisplayName(modelId),
        multiStageState: state,
        totalScore: scoreData.totalScore,
        stageReached: state.finalStage,
        livesRemaining: state.lives,
        accuracy: scoreData.accuracy,
        planningScore: scoreData.planningScore,
        ruleScore: scoreData.ruleScore,
        bossDefeated: state.bossDefeated,
        apiUsage,
        logFilePath: logPath,
      });
      
      console.log(renderModelComplete(
        modelId, 
        state.finalStage, 
        state.bossDefeated, 
        scoreData.totalScore
      ));
      
    } catch (error) {
      // API error - stop the benchmark
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`\n  FATAL ERROR: ${errorMsg}\n`));
      console.error(chalk.yellow(`  Benchmark stopped. Partial results will be shown.\n`));
      
      // Save whatever we have in the log
      logger.save();
      break;
    }
  }
  
  // Display final results
  if (results.length > 0) {
    const benchmarkResult: MultiStageBenchmarkResult = {
      baseSeed,
      timestamp,
      results,
    };
    
    console.log(renderMultiStageFullReport(benchmarkResult));
  } else {
    console.log(chalk.red('\n  No results to display.\n'));
  }
}

// ----------------------------------------------------------------------------
// Entry Point
// ----------------------------------------------------------------------------

runBenchmark().catch((error) => {
  console.error(chalk.red(`\n  Unexpected error: ${error.message}\n`));
  process.exit(1);
});
