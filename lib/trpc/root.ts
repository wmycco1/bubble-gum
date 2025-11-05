/**
 * Root tRPC Router
 * Combines all sub-routers
 */

import { createTRPCRouter } from './trpc';
import { projectRouter } from './routers/project';
import { pageRouter } from './routers/page';
import { aiRouter } from './routers/ai';

export const appRouter = createTRPCRouter({
  project: projectRouter,
  page: pageRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
