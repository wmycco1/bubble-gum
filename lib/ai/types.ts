// ═══════════════════════════════════════════════════════════════
// AI TYPES & SCHEMAS - Bubble Gum
// ═══════════════════════════════════════════════════════════════
// TypeScript types and Zod schemas for AI integration
// Version: 1.0.0
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
import type { CanvasComponent } from '@/lib/editor/types';

// ═══════════════════════════════════════════════════════════════
// AI MESSAGE TYPES
// ═══════════════════════════════════════════════════════════════

export type AIMessageRole = 'user' | 'assistant' | 'system';

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  timestamp: Date;
  tokens?: number;
  error?: string;
}

export interface AIConversation {
  id: string;
  messages: AIMessage[];
  totalTokens: number;
  createdAt: Date;
  updatedAt: Date;
}

// ═══════════════════════════════════════════════════════════════
// AI GENERATION OPTIONS
// ═══════════════════════════════════════════════════════════════

export interface GenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface GeneratePageOptions extends GenerateOptions {
  pageType?: 'landing' | 'about' | 'contact' | 'blog' | 'pricing' | 'custom';
  industry?: string;
  colorScheme?: 'light' | 'dark' | 'auto';
  includeComponents?: string[];
  excludeComponents?: string[];
}

export interface GenerateComponentOptions extends GenerateOptions {
  componentType: string;
  variant?: string;
  context?: string;
}

// ═══════════════════════════════════════════════════════════════
// AI RESPONSE TYPES
// ═══════════════════════════════════════════════════════════════

export interface AIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  model: string;
  duration: number; // milliseconds
}

export interface AIGeneratedPage {
  components: CanvasComponent[];
  metadata: {
    title?: string;
    description?: string;
    suggestedRoute?: string;
  };
}

// ═══════════════════════════════════════════════════════════════
// ZOD VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const aiMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(10000),
  timestamp: z.date(),
  tokens: z.number().int().positive().optional(),
  error: z.string().optional(),
});

export const generatePageInputSchema = z.object({
  prompt: z.string().min(10).max(2000),
  pageType: z
    .enum(['landing', 'about', 'contact', 'blog', 'pricing', 'custom'])
    .optional(),
  industry: z.string().max(100).optional(),
  colorScheme: z.enum(['light', 'dark', 'auto']).optional(),
  includeComponents: z.array(z.string()).optional(),
  excludeComponents: z.array(z.string()).optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(1).optional(),
  maxTokens: z.number().int().positive().max(8000).optional(),
});

export const generateComponentInputSchema = z.object({
  prompt: z.string().min(5).max(1000),
  componentType: z.string().min(1),
  variant: z.string().optional(),
  context: z.string().max(500).optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(1).optional(),
  maxTokens: z.number().int().positive().max(4000).optional(),
});

export const chatInputSchema = z.object({
  messages: z.array(aiMessageSchema).min(1).max(50),
  projectId: z.string().uuid(),
  pageId: z.string().uuid(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(1).optional(),
  stream: z.boolean().optional(),
});

export const improveTextInputSchema = z.object({
  text: z.string().min(1).max(5000),
  variant: z.enum(['h1', 'h2', 'h3', 'paragraph']).optional(),
  tone: z.enum(['professional', 'casual', 'friendly', 'formal']).optional(),
  length: z.enum(['shorter', 'same', 'longer']).optional(),
});

// ═══════════════════════════════════════════════════════════════
// TYPE INFERENCE FROM SCHEMAS
// ═══════════════════════════════════════════════════════════════

export type GeneratePageInput = z.infer<typeof generatePageInputSchema>;
export type GenerateComponentInput = z.infer<typeof generateComponentInputSchema>;
export type ChatInput = z.infer<typeof chatInputSchema>;
export type ImproveTextInput = z.infer<typeof improveTextInputSchema>;

// ═══════════════════════════════════════════════════════════════
// ERROR TYPES
// ═══════════════════════════════════════════════════════════════

export class AIError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AIError';
  }
}

export class AIRateLimitError extends AIError {
  constructor(retryAfter?: number) {
    super(
      'AI rate limit exceeded. Please try again later.',
      'RATE_LIMIT_EXCEEDED',
      { retryAfter }
    );
    this.name = 'AIRateLimitError';
  }
}

export class AIValidationError extends AIError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'AIValidationError';
  }
}

export class AINetworkError extends AIError {
  constructor(originalError: unknown) {
    super('Failed to connect to AI service', 'NETWORK_ERROR', originalError);
    this.name = 'AINetworkError';
  }
}

// ═══════════════════════════════════════════════════════════════
// STREAMING TYPES
// ═══════════════════════════════════════════════════════════════

export interface StreamChunk {
  type: 'content' | 'done' | 'error';
  content?: string;
  error?: string;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export type StreamHandler = (chunk: StreamChunk) => void;
