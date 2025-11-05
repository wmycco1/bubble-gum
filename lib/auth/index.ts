// ═══════════════════════════════════════════════════════════════
// AUTHENTICATION HELPERS
// ═══════════════════════════════════════════════════════════════
// Reusable authentication utilities for Server Components & API routes
// ═══════════════════════════════════════════════════════════════

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db/prisma';
import type { User } from '@prisma/client';

/**
 * Get the current authenticated user from database
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  return user;
}

/**
 * Require authentication - throws error if not authenticated
 * @returns User object (guaranteed to be non-null)
 * @throws Error if user is not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized - Authentication required');
  }

  return user;
}

/**
 * Get user ID from Clerk (doesn't query database)
 * Useful for quick auth checks without DB query
 * @returns Clerk user ID or null
 */
export async function getUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * Check if user is authenticated (boolean check)
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const { userId } = await auth();
  return !!userId;
}

/**
 * Get or create user in database
 * Useful for first-time logins via webhook
 * @param clerkId - Clerk user ID
 * @param email - User email
 * @returns User object
 */
export async function getOrCreateUser(
  clerkId: string,
  email: string
): Promise<User> {
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId,
        email,
      },
    });
  }

  return user;
}
