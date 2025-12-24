// ============================================================================
// MODELS TO BENCHMARK
// ============================================================================
// Add your OpenRouter model IDs below, one per line.
// Find model IDs at: https://openrouter.ai/models
//
// Examples:
//   "anthropic/claude-3.5-sonnet"
//   "openai/gpt-4o"
//   "openai/gpt-4o-mini"
//   "google/gemini-2.0-flash-exp:free"
//   "google/gemini-pro-1.5"
//   "meta-llama/llama-3.3-70b-instruct"
//   "deepseek/deepseek-chat"
//   "mistralai/mistral-large"
//   "qwen/qwen-2.5-72b-instruct"
//
// ============================================================================

export const MODELS: string[] = [
  // Add your models here:
  
];

// ============================================================================
// MODEL DISPLAY NAMES (Optional)
// ============================================================================
// Override display names for cleaner table output.
// If not specified, the model ID will be used.

export const MODEL_DISPLAY_NAMES: Record<string, string> = {
  // "anthropic/claude-3.5-sonnet": "Claude 3.5 Sonnet",
  // "openai/gpt-4o": "GPT-4o",
  // "google/gemini-2.0-flash-exp:free": "Gemini 2.0 Flash",
};

// ============================================================================
// Helper function to get display name
// ============================================================================

export function getModelDisplayName(modelId: string): string {
  return MODEL_DISPLAY_NAMES[modelId] || modelId.split('/').pop() || modelId;
}
