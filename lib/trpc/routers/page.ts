/**
 * Page Router - tRPC
 * Handles page CRUD operations
 */

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const pageRouter = createTRPCRouter({
  /**
   * Get all pages for a project
   */
  listByProject: protectedProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Verify project ownership
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
        select: { userId: true },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: ctx.userId },
        select: { id: true },
      });

      if (project.userId !== user?.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to view this project',
        });
      }

      const pages = await ctx.prisma.page.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          order: 'asc',
        },
      });

      return pages;
    }),

  /**
   * Get a single page by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const page = await ctx.prisma.page.findUnique({
        where: { id: input.id },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              userId: true,
            },
          },
        },
      });

      if (!page) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Page not found',
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: ctx.userId },
        select: { id: true },
      });

      if (page.project.userId !== user?.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to view this page',
        });
      }

      return page;
    }),

  /**
   * Update page content
   */
  updateContent: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        content: z.array(z.any()), // JSON array of components
      })
    )
    .mutation(async ({ ctx, input }) => {
      const page = await ctx.prisma.page.findUnique({
        where: { id: input.id },
        include: {
          project: {
            select: { userId: true },
          },
        },
      });

      if (!page) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Page not found',
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: ctx.userId },
        select: { id: true },
      });

      if (page.project.userId !== user?.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this page',
        });
      }

      const updatedPage = await ctx.prisma.page.update({
        where: { id: input.id },
        data: {
          content: input.content,
        },
      });

      return updatedPage;
    }),
});
