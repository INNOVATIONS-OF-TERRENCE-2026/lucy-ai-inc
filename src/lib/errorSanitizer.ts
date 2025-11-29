/**
 * Privacy & Security: Sanitize error messages to prevent
 * exposure of internal stack details, model names, or provider information
 */

export function sanitizeErrorMessage(error: unknown): string {
  // Never send raw stack traces or internals to end users
  console.error('[INTERNAL ERROR]', error); // Log for debugging
  
  // Return generic, safe error message
  return "Something went wrong on my side, but your data is safe. Please try again or rephrase your request.";
}

export function sanitizeSystemMessage(message: string): string {
  // Remove any references to specific models, providers, or technical details
  const patterns = [
    /gpt-\d+/gi,
    /gemini-[^\s]+/gi,
    /claude-[^\s]+/gi,
    /openai/gi,
    /anthropic/gi,
    /google/gi,
    /hugging\s*face/gi,
    /qwen/gi,
    /whisper/gi,
    /dall-e/gi,
    /stable\s*diffusion/gi,
    /api\.openai\.com/gi,
    /supabase\.co/gi,
    /\.env/gi,
    /VITE_[A-Z_]+/gi,
  ];
  
  let sanitized = message;
  patterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });
  
  return sanitized;
}

export function getGenericEngineName(internalName: string): string {
  // Map internal names to generic public labels
  const engineMap: Record<string, string> = {
    'core-chat': 'Lucy Reasoning Engine',
    'vision': 'Lucy Vision Engine',
    'audio': 'Lucy Voice Engine',
    'image-gen': 'Lucy Image Engine',
    'code-exec': 'Lucy Code Engine',
    'web-search': 'Lucy Search Engine',
    'memory': 'Lucy Memory System',
  };
  
  return engineMap[internalName] || 'Lucy Core Engine';
}
