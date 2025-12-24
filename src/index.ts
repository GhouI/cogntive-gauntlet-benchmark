// ============================================================================
// COGNITIVE GAUNTLET - MAIN ENTRY POINT
// ============================================================================

import 'dotenv/config';
import chalk from 'chalk';

import { MODELS } from './config/models.js';
import { runGame } from './game/engine.js';
import { calculateScore } from './game/scoring.js';
import { generateBoard, visualizeBoard } from './game/board.js';
import { createLogger } from './output/logger.js';
import { 
  renderFullReport, 
  renderModelStart, 
  renderModelComplete 
} from './output/table.js';
import type { ModelResult, BenchmarkResult } from './types/index.js';
import { getModelDisplayName } from './config/models.js';

// ----------------------------------------------------------------------------
// Banner
// ----------------------------------------------------------------------------

function printBanner(): void {
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║     ██████╗ ██████╗  ██████╗ ███╗   ██╗██╗████████╗██╗██╗   ██╗███████╗      ║
║    ██╔════╝██╔═══██╗██╔════╝ ████╗  ██║██║╚══██╔══╝██║██║   ██║██╔════╝      ║
║    ██║     ██║   ██║██║  ███╗██╔██╗ ██║██║   ██║   ██║██║   ██║█████╗        ║
║    ██║     ██║   ██║██║   ██║██║╚██╗██║██║   ██║   ██║╚██╗ ██╔╝██╔══╝        ║
║    ╚██████╗╚██████╔╝╚██████╔╝██║ ╚████║██║   ██║   ██║ ╚████╔╝ ███████╗      ║
║     ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝  ╚═══╝  ╚══════╝      ║
║                                                                               ║
║                    ██████╗  █████╗ ██╗   ██╗███╗   ██╗████████╗██╗     ███████╗████████╗    ║
║                   ██╔════╝ ██╔══██╗██║   ██║████╗  ██║╚══██╔══╝██║     ██╔════╝╚══██╔══╝    ║
║                   ██║  ███╗███████║██║   ██║██╔██╗ ██║   ██║   ██║     █████╗     ██║       ║
║                   ██║   ██║██╔══██║██║   ██║██║╚██╗██║   ██║   ██║     ██╔══╝     ██║       ║
║                   ╚██████╔╝██║  ██║╚██████╔╝██║ ╚████║   ██║   ███████╗███████╗   ██║       ║
║                    ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚══════╝   ╚═╝       ║
║                                                                               ║
║                        AI Model Evaluation Benchmark                          ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
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
  
  // Generate a random seed for this benchmark run
  const seed = Math.floor(Math.random() * 1000000);
  const timestamp = new Date().toISOString();
  
  console.log(chalk.cyan(`\n  Benchmark Configuration:`));
  console.log(chalk.gray(`  ─────────────────────────────────────────`));
  console.log(chalk.white(`  Seed: ${chalk.bold(seed)}`));
  console.log(chalk.white(`  Models: ${chalk.bold(MODELS.length)}`));
  console.log(chalk.white(`  Mode: Single Run`));
  console.log(chalk.gray(`  ─────────────────────────────────────────\n`));
  
  // Show the board that will be used
  const previewBoard = generateBoard(seed);
  console.log(chalk.cyan(`  Board Preview (Seed: ${seed}):\n`));
  console.log(visualizeBoard(previewBoard).split('\n').map(l => '  ' + l).join('\n'));
  console.log();
  
  // List models to be tested
  console.log(chalk.cyan(`  Models to benchmark:`));
  for (let i = 0; i < MODELS.length; i++) {
    console.log(chalk.white(`    ${i + 1}. ${getModelDisplayName(MODELS[i])}`));
  }
  console.log();
  
  // Run benchmark for each model
  const results: ModelResult[] = [];
  
  for (let i = 0; i < MODELS.length; i++) {
    const modelId = MODELS[i];
    console.log(renderModelStart(modelId, i + 1, MODELS.length));
    
    // Create logger for this model
    const logger = createLogger(modelId, seed);
    
    try {
      // Run the game
      const { state, apiUsage } = await runGame(modelId, seed, logger);
      
      // Calculate score
      const score = calculateScore(state);
      
      // Save log file
      const logPath = logger.save();
      
      // Store result
      results.push({
        modelId,
        modelName: getModelDisplayName(modelId),
        gameState: state,
        score,
        apiUsage,
        logFilePath: logPath,
      });
      
      console.log(renderModelComplete(modelId, state.won, score.total));
      
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
    const benchmarkResult: BenchmarkResult = {
      seed,
      timestamp,
      results,
    };
    
    console.log(renderFullReport(benchmarkResult));
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
