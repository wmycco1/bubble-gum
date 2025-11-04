// ================================================================
// BUBBLE GUM - tRPC API ROUTER
// ================================================================
// 
// This is the complete tRPC API schema for Bubble Gum.
// Type-safe API with full TypeScript support.
//
// Generated: November 1, 2025
// Version: 1.0.0
// Framework: tRPC v10+ with Fastify
//
// ================================================================

import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';

// ================================================================
// CONTEXT
// ================================================================

export const createContext = async ({
  req,
  res,
}: {
  req: FastifyRequest;
  res: FastifyReply;
}) => {
  // Get user from Clerk
  const auth = getAuth(req);
  const userId = auth.userId;

  return {
    req,
    res,
    userId,
    prisma: new PrismaClient(),
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// ================================================================
// tRPC INITIALIZATION
// ================================================================

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// ================================================================
// MIDDLEWARE
// ================================================================

/**
 * Auth middleware - ensures user is authenticated
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action',
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

/**
 * Organization member middleware - ensures user is member of organization
 */
const isOrgMember = t.middleware(async ({ ctx, input, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const { organizationId } = input as { organizationId: string };

  const member = await ctx.prisma.organizationMember.findFirst({
    where: {
      organizationId,
      userId: ctx.userId,
    },
  });

  if (!member) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not a member of this organization',
    });
  }

  return next({
    ctx: {
      ...ctx,
      organizationId,
      role: member.role,
    },
  });
});

export const orgMemberProcedure = protectedProcedure.use(isOrgMember);

// ================================================================
// INPUT VALIDATORS (Zod Schemas)
// ================================================================

// Auth
const signUpInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// Organizations
const createOrganizationInput = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
});

const updateOrganizationInput = z.object({
  organizationId: z.string(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  logo: z.string().url().optional(),
});

const inviteMemberInput = z.object({
  organizationId: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']),
});

// Projects
const createProjectInput = z.object({
  organizationId: z.string(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  template: z.enum(['blank', 'portfolio', 'ecommerce', 'blog']).optional(),
});

const updateProjectInput = z.object({
  projectId: z.string(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  customDomain: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  favicon: z.string().url().optional(),
});

const publishProjectInput = z.object({
  projectId: z.string(),
});

// Pages
const createPageInput = z.object({
  projectId: z.string(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^\/[a-z0-9-/]*$/),
  content: z.any(), // JSON schema
});

const updatePageInput = z.object({
  pageId: z.string(),
  name: z.string().optional(),
  slug: z.string().optional(),
  content: z.any().optional(),
  mobileContent: z.any().optional(),
  tabletContent: z.any().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// Assets
const uploadAssetInput = z.object({
  organizationId: z.string(),
  projectId: z.string().optional(),
  file: z.any(), // File data
  name: z.string(),
  type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'FONT', 'ICON']),
});

// AI
const generateSiteInput = z.object({
  organizationId: z.string(),
  prompt: z.string().min(10).max(1000),
  businessType: z.string().optional(),
  colorScheme: z.string().optional(),
  numberOfPages: z.number().min(1).max(10).optional(),
});

const aiChatInput = z.object({
  projectId: z.string(),
  message: z.string().min(1).max(1000),
  context: z.any().optional(),
});

// ================================================================
// AUTH ROUTER
// ================================================================

const authRouter = router({
  /**
   * Get current user
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { clerkId: ctx.userId },
      include: {
        ownedOrganizations: true,
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    return user;
  }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        avatar: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { clerkId: ctx.userId },
        data: input,
      });

      return user;
    }),
});

// ================================================================
// ORGANIZATIONS ROUTER
// ================================================================

const organizationsRouter = router({
  /**
   * List all organizations user is member of
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const organizations = await ctx.prisma.organization.findMany({
      where: {
        OR: [
          { ownerId: ctx.userId },
          {
            members: {
              some: {
                userId: ctx.userId,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            projects: true,
            members: true,
          },
        },
      },
    });

    return organizations;
  }),

  /**
   * Get single organization by ID
   */
  get: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const organization = await ctx.prisma.organization.findUnique({
        where: { id: input.organizationId },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
          projects: {
            select: {
              id: true,
              name: true,
              slug: true,
              status: true,
              updatedAt: true,
            },
          },
        },
      });

      if (!organization) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Organization not found',
        });
      }

      return organization;
    }),

  /**
   * Create new organization
   */
  create: protectedProcedure
    .input(createOrganizationInput)
    .mutation(async ({ ctx, input }) => {
      // Get user
      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Create organization
      const organization = await ctx.prisma.organization.create({
        data: {
          ...input,
          ownerId: user.id,
          subscriptionTier: 'FREE',
          subscriptionStatus: 'ACTIVE',
        },
      });

      return organization;
    }),

  /**
   * Update organization
   */
  update: protectedProcedure
    .input(updateOrganizationInput)
    .mutation(async ({ ctx, input }) => {
      const { organizationId, ...data } = input;

      // Check if user is owner
      const organization = await ctx.prisma.organization.findUnique({
        where: { id: organizationId },
      });

      if (!organization) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Organization not found',
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (organization.ownerId !== user?.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only the owner can update the organization',
        });
      }

      const updated = await ctx.prisma.organization.update({
        where: { id: organizationId },
        data,
      });

      return updated;
    }),

  /**
   * Delete organization
   */
  delete: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is owner
      const organization = await ctx.prisma.organization.findUnique({
        where: { id: input.organizationId },
      });

      if (!organization) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Organization not found',
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (organization.ownerId !== user?.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only the owner can delete the organization',
        });
      }

      await ctx.prisma.organization.delete({
        where: { id: input.organizationId },
      });

      return { success: true };
    }),

  /**
   * Invite member to organization
   */
  inviteMember: protectedProcedure
    .input(inviteMemberInput)
    .mutation(async ({ ctx, input }) => {
      // Find user by email
      const invitedUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!invitedUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Check if already member
      const existingMember = await ctx.prisma.organizationMember.findFirst({
        where: {
          organizationId: input.organizationId,
          userId: invitedUser.id,
        },
      });

      if (existingMember) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User is already a member',
        });
      }

      // Add member
      const member = await ctx.prisma.organizationMember.create({
        data: {
          organizationId: input.organizationId,
          userId: invitedUser.id,
          role: input.role,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
        },
      });

      return member;
    }),

  /**
   * Remove member from organization
   */
  removeMember: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.organizationMember.deleteMany({
        where: {
          organizationId: input.organizationId,
          userId: input.userId,
        },
      });

      return { success: true };
    }),
});

// ================================================================
// PROJECTS ROUTER
// ================================================================

const projectsRouter = router({
  /**
   * List all projects in organization
   */
  list: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const projects = await ctx.prisma.project.findMany({
        where: { organizationId: input.organizationId },
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              pages: true,
              assets: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      return projects;
    }),

  /**
   * Get single project
   */
  get: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
        include: {
          organization: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          pages: {
            orderBy: { slug: 'asc' },
          },
          integrations: true,
          _count: {
            select: {
              assets: true,
              versions: true,
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
   * Create new project
   */
  create: protectedProcedure
    .input(createProjectInput)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Check project limit
      const org = await ctx.prisma.organization.findUnique({
        where: { id: input.organizationId },
        include: {
          _count: {
            select: { projects: true },
          },
        },
      });

      if (!org) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Organization not found',
        });
      }

      if (org._count.projects >= org.projectLimit) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Project limit reached. Upgrade your subscription.',
        });
      }

      // Generate subdomain
      const subdomain = `${input.slug}.bubblegum.app`;

      // Create project
      const project = await ctx.prisma.project.create({
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          subdomain,
          organizationId: input.organizationId,
          createdById: user.id,
          status: 'DRAFT',
        },
      });

      // Create homepage
      await ctx.prisma.page.create({
        data: {
          name: 'Homepage',
          slug: '/',
          projectId: project.id,
          isHomepage: true,
          content: {
            components: [],
          },
        },
      });

      return project;
    }),

  /**
   * Update project
   */
  update: protectedProcedure
    .input(updateProjectInput)
    .mutation(async ({ ctx, input }) => {
      const { projectId, ...data } = input;

      const project = await ctx.prisma.project.update({
        where: { id: projectId },
        data,
      });

      return project;
    }),

  /**
   * Delete project
   */
  delete: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.delete({
        where: { id: input.projectId },
      });

      return { success: true };
    }),

  /**
   * Publish project
   */
  publish: protectedProcedure
    .input(publishProjectInput)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      // Create version snapshot
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
        include: {
          pages: true,
        },
      });

      if (!project) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const version = await ctx.prisma.version.create({
        data: {
          projectId: input.projectId,
          snapshot: {
            project,
            pages: project.pages,
          },
          isAutoSave: false,
          label: 'Published version',
          createdById: user.id,
        },
      });

      // Update project
      const updated = await ctx.prisma.project.update({
        where: { id: input.projectId },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
          publishedVersion: version.id,
        },
      });

      return updated;
    }),
});

// ================================================================
// PAGES ROUTER
// ================================================================

const pagesRouter = router({
  /**
   * List all pages in project
   */
  list: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const pages = await ctx.prisma.page.findMany({
        where: { projectId: input.projectId },
        orderBy: { slug: 'asc' },
      });

      return pages;
    }),

  /**
   * Get single page
   */
  get: protectedProcedure
    .input(z.object({ pageId: z.string() }))
    .query(async ({ ctx, input }) => {
      const page = await ctx.prisma.page.findUnique({
        where: { id: input.pageId },
        include: {
          project: true,
        },
      });

      if (!page) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Page not found',
        });
      }

      return page;
    }),

  /**
   * Create new page
   */
  create: protectedProcedure
    .input(createPageInput)
    .mutation(async ({ ctx, input }) => {
      const page = await ctx.prisma.page.create({
        data: {
          name: input.name,
          slug: input.slug,
          projectId: input.projectId,
          content: input.content || { components: [] },
          isHomepage: false,
        },
      });

      return page;
    }),

  /**
   * Update page
   */
  update: protectedProcedure
    .input(updatePageInput)
    .mutation(async ({ ctx, input }) => {
      const { pageId, ...data } = input;

      const page = await ctx.prisma.page.update({
        where: { id: pageId },
        data,
      });

      return page;
    }),

  /**
   * Delete page
   */
  delete: protectedProcedure
    .input(z.object({ pageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if homepage
      const page = await ctx.prisma.page.findUnique({
        where: { id: input.pageId },
      });

      if (page?.isHomepage) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot delete homepage',
        });
      }

      await ctx.prisma.page.delete({
        where: { id: input.pageId },
      });

      return { success: true };
    }),

  /**
   * Duplicate page
   */
  duplicate: protectedProcedure
    .input(z.object({ pageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const original = await ctx.prisma.page.findUnique({
        where: { id: input.pageId },
      });

      if (!original) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const duplicate = await ctx.prisma.page.create({
        data: {
          name: `${original.name} (Copy)`,
          slug: `${original.slug}-copy`,
          projectId: original.projectId,
          content: original.content,
          mobileContent: original.mobileContent,
          tabletContent: original.tabletContent,
          metaTitle: original.metaTitle,
          metaDescription: original.metaDescription,
          isHomepage: false,
        },
      });

      return duplicate;
    }),
});

// ================================================================
// COMPONENTS ROUTER
// ================================================================

const componentsRouter = router({
  /**
   * Get component library (all pre-built components)
   */
  library: publicProcedure.query(async ({ ctx }) => {
    const components = await ctx.prisma.componentLibrary.findMany({
      orderBy: { category: 'asc' },
    });

    return components;
  }),

  /**
   * Get single component from library
   */
  getLibraryComponent: publicProcedure
    .input(z.object({ componentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const component = await ctx.prisma.componentLibrary.findUnique({
        where: { id: input.componentId },
      });

      if (!component) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Component not found',
        });
      }

      return component;
    }),

  /**
   * List user templates (saved components)
   */
  listTemplates: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const templates = await ctx.prisma.component.findMany({
        where: {
          organizationId: input.organizationId,
          isTemplate: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return templates;
    }),

  /**
   * Save component as template
   */
  saveTemplate: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        name: z.string(),
        type: z.enum([
          'LAYOUT',
          'CONTENT',
          'FORM',
          'NAVIGATION',
          'ECOMMERCE',
          'BLOG',
          'CUSTOM',
        ]),
        schema: z.any(),
        libraryComponentId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.prisma.component.create({
        data: {
          ...input,
          isTemplate: true,
        },
      });

      return template;
    }),
});

// ================================================================
// ASSETS ROUTER
// ================================================================

const assetsRouter = router({
  /**
   * List all assets in organization
   */
  list: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        projectId: z.string().optional(),
        type: z
          .enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'FONT', 'ICON'])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const assets = await ctx.prisma.asset.findMany({
        where: {
          organizationId: input.organizationId,
          projectId: input.projectId,
          type: input.type,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      });

      return assets;
    }),

  /**
   * Get upload URL (signed URL for R2)
   */
  getUploadUrl: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        fileName: z.string(),
        fileType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check storage limit
      const totalStorage = await ctx.prisma.asset.aggregate({
        where: { organizationId: input.organizationId },
        _sum: { size: true },
      });

      const org = await ctx.prisma.organization.findUnique({
        where: { id: input.organizationId },
      });

      if (!org) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const usedMB = (totalStorage._sum.size || 0) / (1024 * 1024);
      if (usedMB >= org.storageLimit) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Storage limit exceeded',
        });
      }

      // Generate signed URL for upload
      // (Implementation depends on R2 SDK)
      const uploadUrl = 'https://r2.bubblegum.app/upload/...'; // Placeholder
      const assetUrl = 'https://cdn.bubblegum.app/assets/...'; // Placeholder

      return {
        uploadUrl,
        assetUrl,
        key: `${input.organizationId}/${Date.now()}-${input.fileName}`,
      };
    }),

  /**
   * Confirm upload (save asset to database)
   */
  confirmUpload: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        projectId: z.string().optional(),
        name: z.string(),
        type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'FONT', 'ICON']),
        url: z.string().url(),
        key: z.string(),
        size: z.number(),
        mimeType: z.string(),
        width: z.number().optional(),
        height: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const asset = await ctx.prisma.asset.create({
        data: {
          ...input,
          uploadedById: user.id,
        },
      });

      return asset;
    }),

  /**
   * Delete asset
   */
  delete: protectedProcedure
    .input(z.object({ assetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete from R2 (implementation depends on R2 SDK)
      // await deleteFromR2(asset.key);

      await ctx.prisma.asset.delete({
        where: { id: input.assetId },
      });

      return { success: true };
    }),
});

// ================================================================
// AI ROUTER
// ================================================================

const aiRouter = router({
  /**
   * Generate site from prompt
   */
  generateSite: protectedProcedure
    .input(generateSiteInput)
    .mutation(async ({ ctx, input }) => {
      // Call AI service (Anthropic Claude)
      const prompt = `Generate a ${input.businessType || 'website'} based on: ${input.prompt}`;

      // AI generation logic here
      // const result = await generateWithClaude(prompt);

      // Placeholder result
      const generatedSite = {
        pages: [
          {
            name: 'Homepage',
            slug: '/',
            content: {
              components: [
                {
                  id: 'hero_1',
                  type: 'Hero',
                  props: {
                    title: 'Welcome',
                    subtitle: 'AI-generated site',
                  },
                },
              ],
            },
          },
        ],
      };

      return generatedSite;
    }),

  /**
   * AI chat (context-aware assistance)
   */
  chat: protectedProcedure.input(aiChatInput).mutation(async ({ ctx, input }) => {
    // Get project context
    const project = await ctx.prisma.project.findUnique({
      where: { id: input.projectId },
      include: {
        pages: true,
      },
    });

    if (!project) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    // Call AI with context
    // const response = await chatWithClaude(input.message, project);

    // Placeholder response
    const response = {
      message: 'AI response here',
      suggestions: ['Add a hero section', 'Create an about page'],
    };

    return response;
  }),
});

// ================================================================
// ANALYTICS ROUTER (Phase 1 - MVP)
// ================================================================

const analyticsRouter = router({
  /**
   * Get page views for project
   */
  getPageViews: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        groupBy: z.enum(['day', 'week', 'month']).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const startDate =
        input.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      const endDate = input.endDate || new Date();

      const pageViews = await ctx.prisma.pageView.findMany({
        where: {
          projectId: input.projectId,
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { timestamp: 'asc' },
      });

      return pageViews;
    }),

  /**
   * Get top pages by views
   */
  getTopPages: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        limit: z.number().min(1).max(50).default(10),
        period: z.enum(['7d', '30d', '90d']).default('30d'),
      })
    )
    .query(async ({ ctx, input }) => {
      const daysAgo = parseInt(input.period);
      const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      const topPages = await ctx.prisma.pageView.groupBy({
        by: ['path'],
        where: {
          projectId: input.projectId,
          timestamp: { gte: startDate },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: input.limit,
      });

      return topPages.map((page) => ({
        path: page.path,
        views: page._count.id,
      }));
    }),

  /**
   * Get unique visitors count
   */
  getUniqueVisitors: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const startDate =
        input.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = input.endDate || new Date();

      const uniqueVisitors = await ctx.prisma.pageView.findMany({
        where: {
          projectId: input.projectId,
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        distinct: ['visitorId'],
      });

      return {
        count: uniqueVisitors.length,
        startDate,
        endDate,
      };
    }),

  /**
   * Get traffic sources (referrers)
   */
  getTrafficSources: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const sources = await ctx.prisma.pageView.groupBy({
        by: ['referrer'],
        where: {
          projectId: input.projectId,
          referrer: { not: null },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: input.limit,
      });

      return sources.map((source) => ({
        referrer: source.referrer || 'Direct',
        count: source._count.id,
      }));
    }),

  /**
   * Get visitor geography
   */
  getGeography: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const countries = await ctx.prisma.pageView.groupBy({
        by: ['country'],
        where: {
          projectId: input.projectId,
          country: { not: null },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: input.limit,
      });

      return countries.map((country) => ({
        country: country.country || 'Unknown',
        count: country._count.id,
      }));
    }),

  /**
   * Get analytics dashboard summary
   */
  getDashboardSummary: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const last60Days = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

      // Total views (last 30 days)
      const totalViews = await ctx.prisma.pageView.count({
        where: {
          projectId: input.projectId,
          timestamp: { gte: last30Days },
        },
      });

      // Previous period views (30-60 days ago)
      const previousViews = await ctx.prisma.pageView.count({
        where: {
          projectId: input.projectId,
          timestamp: {
            gte: last60Days,
            lt: last30Days,
          },
        },
      });

      // Unique visitors
      const uniqueVisitors = await ctx.prisma.pageView.findMany({
        where: {
          projectId: input.projectId,
          timestamp: { gte: last30Days },
        },
        distinct: ['visitorId'],
      });

      // Form submissions
      const formSubmissions = await ctx.prisma.formSubmission.count({
        where: {
          projectId: input.projectId,
          createdAt: { gte: last30Days },
        },
      });

      const viewsChange =
        previousViews > 0
          ? ((totalViews - previousViews) / previousViews) * 100
          : 0;

      return {
        totalViews,
        uniqueVisitors: uniqueVisitors.length,
        formSubmissions,
        viewsChange: Math.round(viewsChange * 10) / 10, // Round to 1 decimal
      };
    }),
});

// ================================================================
// FORMS ROUTER (Phase 1 - MVP)
// ================================================================

const formsRouter = router({
  /**
   * List form submissions for project
   */
  listSubmissions: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        formId: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const submissions = await ctx.prisma.formSubmission.findMany({
        where: {
          projectId: input.projectId,
          formId: input.formId,
        },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        skip: input.offset,
      });

      const total = await ctx.prisma.formSubmission.count({
        where: {
          projectId: input.projectId,
          formId: input.formId,
        },
      });

      return {
        submissions,
        total,
        limit: input.limit,
        offset: input.offset,
      };
    }),

  /**
   * Get single form submission
   */
  getSubmission: protectedProcedure
    .input(z.object({ submissionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const submission = await ctx.prisma.formSubmission.findUnique({
        where: { id: input.submissionId },
      });

      if (!submission) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Submission not found',
        });
      }

      return submission;
    }),

  /**
   * Export form submissions as CSV
   */
  exportSubmissions: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        formId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const submissions = await ctx.prisma.formSubmission.findMany({
        where: {
          projectId: input.projectId,
          formId: input.formId,
        },
        orderBy: { createdAt: 'desc' },
      });

      // Convert to CSV (implementation depends on CSV library)
      // const csv = convertToCSV(submissions);

      return {
        data: submissions,
        format: 'csv',
      };
    }),

  /**
   * Delete form submission
   */
  deleteSubmission: protectedProcedure
    .input(z.object({ submissionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.formSubmission.delete({
        where: { id: input.submissionId },
      });

      return { success: true };
    }),
});

// ================================================================
// PRODUCTS ROUTER (Phase 2 - E-commerce)
// ================================================================

const productsRouter = router({
  /**
   * List all products in organization
   */
  list: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        isPublished: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.prisma.product.findMany({
        where: {
          organizationId: input.organizationId,
          isPublished: input.isPublished,
        },
        include: {
          variants: true,
          _count: {
            select: {
              variants: true,
              orders: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        skip: input.offset,
      });

      const total = await ctx.prisma.product.count({
        where: {
          organizationId: input.organizationId,
          isPublished: input.isPublished,
        },
      });

      return {
        products,
        total,
        limit: input.limit,
        offset: input.offset,
      };
    }),

  /**
   * Get single product
   */
  get: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.productId },
        include: {
          variants: true,
        },
      });

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        });
      }

      return product;
    }),

  /**
   * Create new product
   */
  create: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        name: z.string().min(1).max(200),
        description: z.string().optional(),
        slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
        price: z.number().min(0), // Price in cents
        compareAtPrice: z.number().min(0).optional(),
        sku: z.string().optional(),
        quantity: z.number().min(0).default(0),
        images: z.array(z.string().url()).default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.create({
        data: {
          ...input,
          isPublished: false,
        },
      });

      return product;
    }),

  /**
   * Update product
   */
  update: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        slug: z.string().optional(),
        price: z.number().optional(),
        compareAtPrice: z.number().optional(),
        sku: z.string().optional(),
        quantity: z.number().optional(),
        images: z.array(z.string().url()).optional(),
        isPublished: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, ...data } = input;

      const product = await ctx.prisma.product.update({
        where: { id: productId },
        data,
      });

      return product;
    }),

  /**
   * Delete product
   */
  delete: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.product.delete({
        where: { id: input.productId },
      });

      return { success: true };
    }),

  /**
   * Add product variant
   */
  addVariant: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        name: z.string(),
        sku: z.string().optional(),
        price: z.number().optional(),
        quantity: z.number().min(0).default(0),
        options: z.any(), // JSON: { size: "M", color: "Red" }
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, ...data } = input;

      const variant = await ctx.prisma.productVariant.create({
        data: {
          ...data,
          productId,
        },
      });

      return variant;
    }),

  /**
   * Update product variant
   */
  updateVariant: protectedProcedure
    .input(
      z.object({
        variantId: z.string(),
        name: z.string().optional(),
        sku: z.string().optional(),
        price: z.number().optional(),
        quantity: z.number().optional(),
        options: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { variantId, ...data } = input;

      const variant = await ctx.prisma.productVariant.update({
        where: { id: variantId },
        data,
      });

      return variant;
    }),

  /**
   * Delete product variant
   */
  deleteVariant: protectedProcedure
    .input(z.object({ variantId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.productVariant.delete({
        where: { id: input.variantId },
      });

      return { success: true };
    }),
});

// ================================================================
// ORDERS ROUTER (Phase 2 - E-commerce)
// ================================================================

const ordersRouter = router({
  /**
   * List all orders in organization
   */
  list: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        paymentStatus: z.enum(['pending', 'paid', 'failed']).optional(),
        fulfillmentStatus: z
          .enum(['unfulfilled', 'fulfilled', 'shipped'])
          .optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const orders = await ctx.prisma.order.findMany({
        where: {
          organizationId: input.organizationId,
          paymentStatus: input.paymentStatus,
          fulfillmentStatus: input.fulfillmentStatus,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        skip: input.offset,
      });

      const total = await ctx.prisma.order.count({
        where: {
          organizationId: input.organizationId,
          paymentStatus: input.paymentStatus,
          fulfillmentStatus: input.fulfillmentStatus,
        },
      });

      return {
        orders,
        total,
        limit: input.limit,
        offset: input.offset,
      };
    }),

  /**
   * Get single order
   */
  get: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findUnique({
        where: { id: input.orderId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Order not found',
        });
      }

      return order;
    }),

  /**
   * Update order status
   */
  updateStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        paymentStatus: z.enum(['pending', 'paid', 'failed']).optional(),
        fulfillmentStatus: z
          .enum(['unfulfilled', 'fulfilled', 'shipped'])
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { orderId, ...data } = input;

      const order = await ctx.prisma.order.update({
        where: { id: orderId },
        data,
      });

      return order;
    }),

  /**
   * Get order statistics
   */
  getStats: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const startDate =
        input.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = input.endDate || new Date();

      const orders = await ctx.prisma.order.findMany({
        where: {
          organizationId: input.organizationId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');

      return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        paidOrders: paidOrders.length,
        conversionRate:
          totalOrders > 0 ? (paidOrders.length / totalOrders) * 100 : 0,
        startDate,
        endDate,
      };
    }),
});

// ================================================================
// BLOG ROUTER (Phase 3)
// ================================================================

const blogRouter = router({
  /**
   * List all blog posts in organization
   */
  listPosts: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        isPublished: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.blogPost.findMany({
        where: {
          organizationId: input.organizationId,
          isPublished: input.isPublished,
        },
        include: {
          categories: true,
          tags: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        skip: input.offset,
      });

      const total = await ctx.prisma.blogPost.count({
        where: {
          organizationId: input.organizationId,
          isPublished: input.isPublished,
        },
      });

      return {
        posts,
        total,
        limit: input.limit,
        offset: input.offset,
      };
    }),

  /**
   * Get single blog post
   */
  getPost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.blogPost.findUnique({
        where: { id: input.postId },
        include: {
          categories: true,
          tags: true,
          comments: {
            where: { isApproved: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Blog post not found',
        });
      }

      return post;
    }),

  /**
   * Create new blog post
   */
  createPost: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        title: z.string().min(1).max(200),
        slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
        excerpt: z.string().optional(),
        content: z.string(),
        featuredImage: z.string().url().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        categoryIds: z.array(z.string()).optional(),
        tagIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const { categoryIds, tagIds, ...postData } = input;

      const post = await ctx.prisma.blogPost.create({
        data: {
          ...postData,
          authorId: user.id,
          isPublished: false,
          categories: categoryIds
            ? {
                connect: categoryIds.map((id) => ({ id })),
              }
            : undefined,
          tags: tagIds
            ? {
                connect: tagIds.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          categories: true,
          tags: true,
        },
      });

      return post;
    }),

  /**
   * Update blog post
   */
  updatePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        featuredImage: z.string().url().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        isPublished: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, ...data } = input;

      const post = await ctx.prisma.blogPost.update({
        where: { id: postId },
        data: {
          ...data,
          publishedAt: data.isPublished ? new Date() : undefined,
        },
      });

      return post;
    }),

  /**
   * Delete blog post
   */
  deletePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.blogPost.delete({
        where: { id: input.postId },
      });

      return { success: true };
    }),

  /**
   * List categories
   */
  listCategories: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const categories = await ctx.prisma.blogCategory.findMany({
        where: { organizationId: input.organizationId },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      return categories;
    }),

  /**
   * Create category
   */
  createCategory: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        name: z.string(),
        slug: z.string().regex(/^[a-z0-9-]+$/),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.blogCategory.create({
        data: input,
      });

      return category;
    }),

  /**
   * List tags
   */
  listTags: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tags = await ctx.prisma.blogTag.findMany({
        where: { organizationId: input.organizationId },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      return tags;
    }),

  /**
   * Create tag
   */
  createTag: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        name: z.string(),
        slug: z.string().regex(/^[a-z0-9-]+$/),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tag = await ctx.prisma.blogTag.create({
        data: input,
      });

      return tag;
    }),

  /**
   * List comments (with moderation)
   */
  listComments: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        isApproved: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.blogComment.findMany({
        where: {
          postId: input.postId,
          isApproved: input.isApproved,
        },
        orderBy: { createdAt: 'desc' },
      });

      return comments;
    }),

  /**
   * Approve comment
   */
  approveComment: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.blogComment.update({
        where: { id: input.commentId },
        data: { isApproved: true },
      });

      return comment;
    }),

  /**
   * Delete comment
   */
  deleteComment: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.blogComment.delete({
        where: { id: input.commentId },
      });

      return { success: true };
    }),
});

// ================================================================
// VERSIONS ROUTER
// ================================================================

const versionsRouter = router({
  /**
   * List version history for project
   */
  list: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const versions = await ctx.prisma.version.findMany({
        where: { projectId: input.projectId },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      });

      return versions;
    }),

  /**
   * Get single version
   */
  get: protectedProcedure
    .input(z.object({ versionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const version = await ctx.prisma.version.findUnique({
        where: { id: input.versionId },
        include: {
          project: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      });

      if (!version) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Version not found',
        });
      }

      return version;
    }),

  /**
   * Restore version (revert to previous state)
   */
  restore: protectedProcedure
    .input(z.object({ versionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const version = await ctx.prisma.version.findUnique({
        where: { id: input.versionId },
      });

      if (!version) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const snapshot = version.snapshot as any;

      // Restore project state
      // (Implementation depends on snapshot structure)

      return { success: true };
    }),
});

// ================================================================
// MAIN APP ROUTER
// ================================================================

export const appRouter = router({
  auth: authRouter,
  organizations: organizationsRouter,
  projects: projectsRouter,
  pages: pagesRouter,
  components: componentsRouter,
  assets: assetsRouter,
  analytics: analyticsRouter,
  forms: formsRouter,
  ai: aiRouter,
  versions: versionsRouter,
  // E-commerce (Phase 2)
  products: productsRouter,
  orders: ordersRouter,
  // Blog (Phase 3)
  blog: blogRouter,
});

export type AppRouter = typeof appRouter;

// ================================================================
// EXPORT FOR CLIENT
// ================================================================

/**
 * Example client usage:
 * 
 * import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
 * import type { AppRouter } from './server/trpc/router';
 * 
 * const trpc = createTRPCProxyClient<AppRouter>({
 *   links: [
 *     httpBatchLink({
 *       url: 'http://localhost:3001/trpc',
 *     }),
 *   ],
 * });
 * 
 * // Usage
 * const projects = await trpc.projects.list.query({ organizationId: '...' });
 */