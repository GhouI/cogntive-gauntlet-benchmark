// MODELS TO BENCHMARK
// Add your OpenRouter model IDs below, one per line.
// Find model IDs at: https://openrouter.ai/models
//


export const MODELS: string[] = [
  // Add your models here:
  "anthropic/claude-sonnet-4.5",
  "anthropic/claude-opus-4.5",
  "openai/gpt-5.2",
  "moonshotai/kimi-k2-thinking",
  "deepseek/deepseek-v3.2"
];


export const MODEL_DISPLAY_NAMES: Record<string, string> = {
  "anthropic/claude-sonnet-4.5" : "Sonnet 4.5",
  "anthropic/claude-opus-4.5" : "Opus 4.5",
  "openai/gpt-5.2" : "GPT 5.2",
  "moonshotai/kimi-k2-thinking" : "Kimi K2 Thinking",
  "deepseek/deepseek-v3.2": "Deepseek-v3.2"
};



export function getModelDisplayName(modelId: string): string {
  return MODEL_DISPLAY_NAMES[modelId] || modelId.split('/').pop() || modelId;
}
