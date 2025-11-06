// ═══════════════════════════════════════════════════════════════
// ANTHROPIC AI SERVICE - Bubble Gum
// ═══════════════════════════════════════════════════════════════
// Service layer for Anthropic Claude API integration
// Version: 1.0.0
// ═══════════════════════════════════════════════════════════════

import Anthropic from '@anthropic-ai/sdk';
import { nanoid } from 'nanoid';
import type { CanvasComponent } from '@/lib/editor/types';
import type {
  AIResponse,
  AIGeneratedPage,
  GeneratePageOptions,
  GenerateComponentOptions,
  AIMessage,
  StreamHandler,
} from './types';
import {
  AIError,
  AIRateLimitError,
  AINetworkError,
  AIValidationError,
} from './types';
import {
  SYSTEM_PROMPT,
  PAGE_GENERATION_PROMPT,
  COMPONENT_GENERATION_PROMPT,
  TEXT_IMPROVEMENT_PROMPT,
} from './prompts';

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const DEFAULT_MODEL = 'claude-sonnet-4-5-20250929';
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 4000;
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff in ms

// ═══════════════════════════════════════════════════════════════
// CLIENT INITIALIZATION
// ═══════════════════════════════════════════════════════════════

let anthropicClient: Anthropic | null = null;

export function initializeAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new AIError(
        'ANTHROPIC_API_KEY is not configured. Please add it to your .env file.',
        'MISSING_API_KEY'
      );
    }

    if (!apiKey.startsWith('sk-ant-')) {
      throw new AIError(
        'Invalid ANTHROPIC_API_KEY format. Key should start with "sk-ant-"',
        'INVALID_API_KEY'
      );
    }

    anthropicClient = new Anthropic({
      apiKey,
    });
  }

  return anthropicClient;
}

// ═══════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════

function handleAnthropicError(error: unknown): never {
  console.error('[AI Service] Error:', error);

  if (error instanceof Anthropic.APIError) {
    if (error.status === 429) {
      const retryAfter = error.headers?.['retry-after']
        ? parseInt(error.headers['retry-after'])
        : undefined;
      throw new AIRateLimitError(retryAfter);
    }

    if (error.status === 401) {
      throw new AIError(
        'Invalid API key. Please check your ANTHROPIC_API_KEY.',
        'INVALID_API_KEY',
        error
      );
    }

    if (error.status === 400) {
      throw new AIValidationError('Invalid request to AI service', error);
    }

    throw new AIError(
      `AI service error: ${error.message}`,
      'API_ERROR',
      error
    );
  }

  if (error instanceof Error && error.message.includes('fetch')) {
    throw new AINetworkError(error);
  }

  throw new AIError(
    'Unknown error occurred while calling AI service',
    'UNKNOWN_ERROR',
    error
  );
}

// ═══════════════════════════════════════════════════════════════
// RETRY LOGIC
// ═══════════════════════════════════════════════════════════════

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on validation errors or invalid API keys
      if (
        error instanceof AIValidationError ||
        (error instanceof AIError && error.code === 'INVALID_API_KEY')
      ) {
        throw error;
      }

      // Don't retry on rate limits (should be handled by caller)
      if (error instanceof AIRateLimitError) {
        throw error;
      }

      // Retry on network errors or API errors
      if (attempt < retries - 1) {
        const delay = RETRY_DELAYS[attempt] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
        console.warn(`[AI Service] Retry attempt ${attempt + 1}/${retries} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// ═══════════════════════════════════════════════════════════════
// JSON PARSING
// ═══════════════════════════════════════════════════════════════

function extractJSON(text: string): unknown {
  console.warn('[AI Service] Raw AI response length:', text.length);
  console.warn('[AI Service] First 500 chars:', text.substring(0, 500));

  // Remove markdown code blocks if present
  let cleanText = text.trim();

  // Remove various markdown patterns
  cleanText = cleanText.replace(/^```json?\s*/i, '');
  cleanText = cleanText.replace(/^```\s*/i, '');
  cleanText = cleanText.replace(/```\s*$/i, '');

  // Remove any leading text before the JSON
  const jsonStartMatch = cleanText.match(/^\s*\{/);
  if (!jsonStartMatch) {
    // Try to find where JSON starts
    const bracketIndex = cleanText.indexOf('{');
    if (bracketIndex > 0) {
      console.warn('[AI Service] Found JSON at position:', bracketIndex);
      cleanText = cleanText.substring(bracketIndex);
    }
  }

  cleanText = cleanText.trim();

  // Try to find JSON object in the response (greedy match to get the full object)
  const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    console.error('[AI Service] No JSON found in response');
    console.error('[AI Service] Full cleaned text:', cleanText);
    throw new AIValidationError('AI response does not contain valid JSON. Please try again.');
  }

  let jsonString = jsonMatch[0];

  // Try to fix common JSON issues
  try {
    // First attempt: parse as-is
    const parsed = JSON.parse(jsonString);
    console.warn('[AI Service] Successfully parsed JSON:', {
      hasComponents: 'components' in parsed,
      componentsCount: Array.isArray(parsed.components) ? parsed.components.length : 0,
      hasMetadata: 'metadata' in parsed,
    });
    return parsed;
  } catch {
    console.warn('[AI Service] First parse attempt failed, trying fixes...');

    // Try fixing common issues
    // 1. Remove trailing commas
    jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');

    // 2. Remove comments (// or /* */)
    jsonString = jsonString.replace(/\/\/.*$/gm, '');
    jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');

    try {
      const parsed = JSON.parse(jsonString);
      console.warn('[AI Service] Successfully parsed JSON after fixes');
      return parsed;
    } catch (secondError) {
      console.error('[AI Service] JSON parse error (after fixes):', secondError);
      console.error('[AI Service] Attempted to parse:', jsonString.substring(0, 500));

      // Last resort: try to extract just the components array
      const componentsMatch = jsonString.match(/"components"\s*:\s*\[[\s\S]*?\]/);
      if (componentsMatch) {
        try {
          const componentsOnly = `{${componentsMatch[0]}}`;
          const parsed = JSON.parse(componentsOnly);
          console.warn('[AI Service] Extracted components array as fallback');
          return parsed;
        } catch {
          // Give up
        }
      }

      throw new AIValidationError(
        'Failed to parse AI response as valid JSON. The AI may have returned malformed data. Please try again.',
        secondError
      );
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT VALIDATION
// ═══════════════════════════════════════════════════════════════

function validateComponents(components: unknown[]): CanvasComponent[] {
  if (!Array.isArray(components)) {
    throw new AIValidationError('Components must be an array');
  }

  return components.map((comp, index) => {
    if (!comp || typeof comp !== 'object') {
      throw new AIValidationError(`Component at index ${index} is invalid`);
    }

    const component = comp as Record<string, unknown>;

    if (!component.type || typeof component.type !== 'string') {
      throw new AIValidationError(
        `Component at index ${index} missing valid type`
      );
    }

    // Ensure required fields
    return {
      id: (component.id as string) || nanoid(),
      type: component.type as string,
      props: (component.props as Record<string, unknown>) || {},
      style: (component.style as Record<string, unknown>) || {},
      position: (component.position as { x: number; y: number }) || { x: 0, y: 0 },
      size: (component.size as { width: number; height: number }) || {
        width: 400,
        height: 200,
      },
      children: validateComponents((component.children as unknown[]) || []),
    } as CanvasComponent;
  });
}

// ═══════════════════════════════════════════════════════════════
// CORE API METHODS
// ═══════════════════════════════════════════════════════════════

export async function generatePage(
  prompt: string,
  options: GeneratePageOptions = {}
): Promise<AIResponse<AIGeneratedPage>> {
  const startTime = Date.now();
  const client = initializeAnthropicClient();

  const model = options.model || DEFAULT_MODEL;
  const temperature = options.temperature ?? DEFAULT_TEMPERATURE;
  const maxTokens = options.maxTokens || DEFAULT_MAX_TOKENS;

  const userPrompt = PAGE_GENERATION_PROMPT(
    prompt,
    options.pageType,
    options.industry
  );

  try {
    const response = await withRetry(async () => {
      return await client.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        system: SYSTEM_PROMPT,
      });
    });

    // Extract text content
    const textContent = response.content
      .filter((block) => block.type === 'text')
      .map((block) => ('text' in block ? block.text : ''))
      .join('\n');

    // Parse JSON response
    const parsed = extractJSON(textContent);

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !('components' in parsed) ||
      !Array.isArray(parsed.components)
    ) {
      throw new AIValidationError('Invalid page structure in AI response');
    }

    const validatedComponents = validateComponents(parsed.components);

    const metadata = (parsed as { metadata?: unknown }).metadata || {};
    const typedMetadata = metadata as {
      title?: string;
      description?: string;
      suggestedRoute?: string;
    };

    const duration = Date.now() - startTime;

    return {
      success: true,
      data: {
        components: validatedComponents,
        metadata: {
          title: typedMetadata.title,
          description: typedMetadata.description,
          suggestedRoute: typedMetadata.suggestedRoute,
        },
      },
      tokens: {
        prompt: response.usage.input_tokens,
        completion: response.usage.output_tokens,
        total: response.usage.input_tokens + response.usage.output_tokens,
      },
      model,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    if (error instanceof AIError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
        tokens: { prompt: 0, completion: 0, total: 0 },
        model,
        duration,
      };
    }

    handleAnthropicError(error);
  }
}

export async function generateComponent(
  prompt: string,
  options: GenerateComponentOptions
): Promise<AIResponse<CanvasComponent>> {
  const startTime = Date.now();
  const client = initializeAnthropicClient();

  const model = options.model || DEFAULT_MODEL;
  const temperature = options.temperature ?? DEFAULT_TEMPERATURE;
  const maxTokens = options.maxTokens || 2000;

  const userPrompt = COMPONENT_GENERATION_PROMPT(
    prompt,
    options.componentType,
    options.context
  );

  try {
    const response = await withRetry(async () => {
      return await client.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        system: SYSTEM_PROMPT,
      });
    });

    const textContent = response.content
      .filter((block) => block.type === 'text')
      .map((block) => ('text' in block ? block.text : ''))
      .join('\n');

    const parsed = extractJSON(textContent);

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !('component' in parsed)
    ) {
      throw new AIValidationError('Invalid component structure in AI response');
    }

    const component = (parsed as { component: unknown }).component;
    const validatedComponent = validateComponents([component])[0];

    const duration = Date.now() - startTime;

    return {
      success: true,
      data: validatedComponent,
      tokens: {
        prompt: response.usage.input_tokens,
        completion: response.usage.output_tokens,
        total: response.usage.input_tokens + response.usage.output_tokens,
      },
      model,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    if (error instanceof AIError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
        tokens: { prompt: 0, completion: 0, total: 0 },
        model,
        duration,
      };
    }

    handleAnthropicError(error);
  }
}

export async function improveText(
  text: string,
  variant?: string,
  tone?: string,
  length?: string
): Promise<AIResponse<string>> {
  const startTime = Date.now();
  const client = initializeAnthropicClient();

  const userPrompt = TEXT_IMPROVEMENT_PROMPT(text, variant, tone, length);

  try {
    const response = await withRetry(async () => {
      return await client.messages.create({
        model: DEFAULT_MODEL,
        max_tokens: 1000,
        temperature: 0.8,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        system: SYSTEM_PROMPT,
      });
    });

    const textContent = response.content
      .filter((block) => block.type === 'text')
      .map((block) => ('text' in block ? block.text : ''))
      .join('\n');

    const parsed = extractJSON(textContent);

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !('improved' in parsed) ||
      typeof (parsed as { improved: unknown }).improved !== 'string'
    ) {
      throw new AIValidationError('Invalid text improvement response');
    }

    const duration = Date.now() - startTime;

    return {
      success: true,
      data: (parsed as { improved: string }).improved,
      tokens: {
        prompt: response.usage.input_tokens,
        completion: response.usage.output_tokens,
        total: response.usage.input_tokens + response.usage.output_tokens,
      },
      model: DEFAULT_MODEL,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    if (error instanceof AIError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
        tokens: { prompt: 0, completion: 0, total: 0 },
        model: DEFAULT_MODEL,
        duration,
      };
    }

    handleAnthropicError(error);
  }
}

export async function streamChat(
  messages: AIMessage[],
  onStream: StreamHandler
): Promise<void> {
  const client = initializeAnthropicClient();

  try {
    const anthropicMessages = messages
      .filter((msg) => msg.role !== 'system')
      .map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

    const stream = await client.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: DEFAULT_MAX_TOKENS,
      temperature: DEFAULT_TEMPERATURE,
      messages: anthropicMessages,
      system: SYSTEM_PROMPT,
      stream: true,
    });

    let fullText = '';

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        if ('delta' in event && event.delta.type === 'text_delta') {
          const text = event.delta.text;
          fullText += text;
          onStream({
            type: 'content',
            content: text,
          });
        }
      }

      if (event.type === 'message_stop') {
        onStream({
          type: 'done',
          content: fullText,
        });
      }
    }
  } catch (error) {
    if (error instanceof AIError) {
      onStream({
        type: 'error',
        error: error.message,
      });
    } else {
      handleAnthropicError(error);
    }
  }
}
