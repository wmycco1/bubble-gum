/**
 * Project Router - tRPC
 * Handles project CRUD operations
 */

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const projectRouter = createTRPCRouter({
  /**
   * List all projects for the authenticated user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      where: {
        userId: ctx.userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        subdomain: true,
        customDomain: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            pages: true,
          },
        },
      },
    });

    return projects;
  }),

  /**
   * Get a single project by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
        include: {
          pages: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      return project;
    }),

  /**
   * Create a new project
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Generate slug from name
      const slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if slug already exists
      const existingProject = await ctx.prisma.project.findUnique({
        where: { slug },
      });

      if (existingProject) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A project with this name already exists',
        });
      }

      // Get user to generate subdomain
      let user = await ctx.prisma.user.findUnique({
        where: { clerkId: ctx.userId },
        select: { id: true, email: true },
      });

      if (!user) {
        // Create user if doesn't exist (first-time login)
        user = await ctx.prisma.user.create({
          data: {
            clerkId: ctx.userId,
            email: '', // Will be updated by webhook
          },
          select: { id: true, email: true },
        });
      }

      // Generate subdomain (first 8 chars of project slug + random)
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      const subdomain = `${slug.substring(0, 8)}-${randomSuffix}`;

      const project = await ctx.prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          slug,
          subdomain,
          userId: user.id,
        },
      });

      // Create default homepage
      await ctx.prisma.page.create({
        data: {
          projectId: project.id,
          title: 'Home',
          slug: 'index',
          path: '/',
          content: [],
          order: 0,
        },
      });

      return project;
    }),

  /**
   * Update a project
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
        metaTitle: z.string().max(60).optional(),
        metaDescription: z.string().max(160).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify ownership
      const project = await ctx.prisma.project.findUnique({
        where: { id },
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
          message: 'You do not have permission to update this project',
        });
      }

      const updatedProject = await ctx.prisma.project.update({
        where: { id },
        data,
      });

      return updatedProject;
    }),

  /**
   * Delete a project
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
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
          message: 'You do not have permission to delete this project',
        });
      }

      await ctx.prisma.project.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * Publish/unpublish a project
   */
  togglePublish: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
        select: { userId: true, isPublished: true },
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
          message: 'You do not have permission to publish this project',
        });
      }

      const updatedProject = await ctx.prisma.project.update({
        where: { id: input.id },
        data: {
          isPublished: !project.isPublished,
          publishedAt: !project.isPublished ? new Date() : null,
        },
      });

      return updatedProject;
    }),
});
