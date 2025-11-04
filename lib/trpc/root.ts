/**
 * Root tRPC Router
 * Combines all sub-routers
 */

import { createTRPCRouter } from './trpc';
import { projectRouter } from './routers/project';

export const appRouter = createTRPCRouter({
  project: projectRouter,
});

export type AppRouter = typeof appRouter;
