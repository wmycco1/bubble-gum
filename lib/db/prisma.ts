/**
 * Prisma Client Singleton
 * Prevents multiple instances in development with hot reload
 * @see https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
 */

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  // Controllable logging via environment variable
  // Set PRISMA_LOG_QUERIES=true in .env.local to enable SQL query logging
  const enableQueryLogs = process.env.PRISMA_LOG_QUERIES === 'true';

  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? enableQueryLogs
          ? ['query', 'error', 'warn']
          : ['error', 'warn']
        : ['error'],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
