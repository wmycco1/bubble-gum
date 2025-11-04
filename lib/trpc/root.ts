/**
 * Root tRPC Router
 * Combines all sub-routers
 */

import { createTRPCRouter } from './trpc';
import { projectRouter } from './routers/project';
import { pageRouter } from './routers/page';

export const appRouter = createTRPCRouter({
  project: projectRouter,
  page: pageRouter,
});

export type AppRouter = typeof appRouter;
