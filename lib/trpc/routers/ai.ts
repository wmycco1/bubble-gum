/**
 * AI Router - tRPC
 * Handles AI generation requests (page, components, text improvement)
 */

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import {
  generatePage,
  generateComponent,
  improveText,
  streamChat,
} from '@/lib/ai/anthropic';
import {
  generatePageInputSchema,
  generateComponentInputSchema,
  improveTextInputSchema,
} from '@/lib/ai/types';
import { AIError, AIRateLimitError } from '@/lib/ai/types';

// ═══════════════════════════════════════════════════════════════
// RATE LIMITING HELPER
// ═══════════════════════════════════════════════════════════════

const userRequestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string, maxRequests = 10): void {
  const now = Date.now();
  const userLimit = userRequestCounts.get(userId);

  if (!userLimit || userLimit.resetAt < now) {
    // Reset or initialize
    userRequestCounts.set(userId, {
      count: 1,
      resetAt: now + 60 * 1000, // 1 minute window
    });
    return;
  }

  if (userLimit.count >= maxRequests) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Rate limit exceeded. Maximum ${maxRequests} requests per minute.`,
    });
  }

  userLimit.count++;
}

// ═══════════════════════════════════════════════════════════════
// AI ROUTER
// ═══════════════════════════════════════════════════════════════

export const aiRouter = createTRPCRouter({
  /**
   * Generate a complete page from user prompt
   */
  generatePage: protectedProcedure
    .input(generatePageInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Rate limiting: 10 requests per minute per user
        checkRateLimit(ctx.userId, 10);

        console.log('[AI] Generating page:', {
          userId: ctx.userId,
          prompt: input.prompt.substring(0, 50) + '...',
          pageType: input.pageType,
        });

        const result = await generatePage(input.prompt, {
          pageType: input.pageType,
          industry: input.industry,
          colorScheme: input.colorScheme,
          includeComponents: input.includeComponents,
          excludeComponents: input.excludeComponents,
          model: input.model,
          temperature: input.temperature,
          maxTokens: input.maxTokens,
        });

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'AI generation failed',
            cause: result.error,
          });
        }

        // Log token usage for monitoring
        console.log('[AI] Page generated successfully:', {
          componentsCount: result.data?.components.length,
          tokens: result.tokens,
          duration: result.duration,
        });

        return result;
      } catch (error) {
        if (error instanceof AIRateLimitError) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: error.message,
          });
        }

        if (error instanceof AIError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
            cause: error,
          });
        }

        if (error instanceof TRPCError) {
          throw error;
        }

        console.error('[AI] Unexpected error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate page',
          cause: error,
        });
      }
    }),

  /**
   * Generate a single component from user prompt
   */
  generateComponent: protectedProcedure
    .input(generateComponentInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        checkRateLimit(ctx.userId, 20); // Higher limit for components

        console.log('[AI] Generating component:', {
          userId: ctx.userId,
          componentType: input.componentType,
          prompt: input.prompt.substring(0, 50) + '...',
        });

        const result = await generateComponent(input.prompt, {
          componentType: input.componentType,
          variant: input.variant,
          context: input.context,
          model: input.model,
          temperature: input.temperature,
          maxTokens: input.maxTokens,
        });

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'AI generation failed',
            cause: result.error,
          });
        }

        console.log('[AI] Component generated successfully:', {
          type: result.data?.type,
          tokens: result.tokens,
          duration: result.duration,
        });

        return result;
      } catch (error) {
        if (error instanceof AIRateLimitError) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: error.message,
          });
        }

        if (error instanceof AIError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
            cause: error,
          });
        }

        if (error instanceof TRPCError) {
          throw error;
        }

        console.error('[AI] Unexpected error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate component',
          cause: error,
        });
      }
    }),

  /**
   * Improve existing text content
   */
  improveText: protectedProcedure
    .input(improveTextInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        checkRateLimit(ctx.userId, 30); // Higher limit for text improvements

        console.log('[AI] Improving text:', {
          userId: ctx.userId,
          variant: input.variant,
          tone: input.tone,
          length: input.length,
        });

        const result = await improveText(
          input.text,
          input.variant,
          input.tone,
          input.length
        );

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'AI text improvement failed',
            cause: result.error,
          });
        }

        console.log('[AI] Text improved successfully:', {
          tokens: result.tokens,
          duration: result.duration,
        });

        return result;
      } catch (error) {
        if (error instanceof AIRateLimitError) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: error.message,
          });
        }

        if (error instanceof AIError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
            cause: error,
          });
        }

        if (error instanceof TRPCError) {
          throw error;
        }

        console.error('[AI] Unexpected error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to improve text',
          cause: error,
        });
      }
    }),

  /**
   * Chat with AI assistant (streaming not yet implemented in tRPC mutation)
   * For now, returns a simple chat completion
   */
  chat: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1).max(2000),
        conversationHistory: z
          .array(
            z.object({
              role: z.enum(['user', 'assistant']),
              content: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        checkRateLimit(ctx.userId, 20);

        console.log('[AI] Chat message:', {
          userId: ctx.userId,
          message: input.message.substring(0, 50) + '...',
          historyLength: input.conversationHistory?.length || 0,
        });

        // For now, we'll use a simple implementation
        // TODO: Implement proper streaming chat via tRPC subscriptions or SSE
        const messages = [
          ...(input.conversationHistory || []).map((msg) => ({
            id: '',
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
            timestamp: new Date(),
          })),
          {
            id: '',
            role: 'user' as const,
            content: input.message,
            timestamp: new Date(),
          },
        ];

        let responseText = '';
        let totalTokens = 0;

        await streamChat(messages, (chunk) => {
          if (chunk.type === 'content' && chunk.content) {
            responseText += chunk.content;
          }
          if (chunk.type === 'done' && chunk.tokens) {
            totalTokens = chunk.tokens.total;
          }
        });

        return {
          success: true,
          data: {
            message: responseText,
            tokens: totalTokens,
          },
        };
      } catch (error) {
        if (error instanceof AIRateLimitError) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: error.message,
          });
        }

        if (error instanceof AIError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
            cause: error,
          });
        }

        if (error instanceof TRPCError) {
          throw error;
        }

        console.error('[AI] Unexpected error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Chat failed',
          cause: error,
        });
      }
    }),

  /**
   * Get AI usage statistics for the current user
   */
  getUsageStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const now = Date.now();
      const userLimit = userRequestCounts.get(ctx.userId);

      return {
        requestsUsed: userLimit?.count || 0,
        requestsLimit: 10,
        resetAt: userLimit?.resetAt || now + 60 * 1000,
        resetIn: userLimit ? Math.max(0, userLimit.resetAt - now) : 60 * 1000,
      };
    } catch (error) {
      console.error('[AI] Failed to get usage stats:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get usage statistics',
      });
    }
  }),
});
