// ═══════════════════════════════════════════════════════════════
// AUTHENTICATION TESTS
// ═══════════════════════════════════════════════════════════════
// Tests for lib/auth/index.ts authentication helpers
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCurrentUser, requireAuth, getUserId, isAuthenticated } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { auth } from '@clerk/nextjs/server';

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

// Mock Prisma
vi.mock('@/lib/db/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

describe('Authentication Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should return user when authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        clerkId: 'clerk-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatarUrl: null,
        subscriptionTier: 'FREE' as const,
        stripeCustomerId: null,
        subscriptionId: null,
        subscriptionStatus: null,
        currentPeriodEnd: null,
        aiGenerationsUsed: 0,
        aiGenerationsLimit: 10,
        lastAiGenerationAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(auth).mockResolvedValue({ userId: 'clerk-123' } as Awaited<ReturnType<typeof auth>>);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(auth).toHaveBeenCalled();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { clerkId: 'clerk-123' },
      });
    });

    it('should return null when not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);

      const result = await getCurrentUser();

      expect(result).toBeNull();
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('should return null when user not found in database', async () => {
      vi.mocked(auth).mockResolvedValue({ userId: 'clerk-123' } as Awaited<ReturnType<typeof auth>>);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('requireAuth', () => {
    it('should return user when authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        clerkId: 'clerk-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        avatarUrl: null,
        subscriptionTier: 'FREE' as const,
        stripeCustomerId: null,
        subscriptionId: null,
        subscriptionStatus: null,
        currentPeriodEnd: null,
        aiGenerationsUsed: 0,
        aiGenerationsLimit: 10,
        lastAiGenerationAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(auth).mockResolvedValue({ userId: 'clerk-123' } as Awaited<ReturnType<typeof auth>>);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await requireAuth();

      expect(result).toEqual(mockUser);
    });

    it('should throw error when not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);

      await expect(requireAuth()).rejects.toThrow('Unauthorized - Authentication required');
    });

    it('should throw error when user not in database', async () => {
      vi.mocked(auth).mockResolvedValue({ userId: 'clerk-123' } as Awaited<ReturnType<typeof auth>>);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(requireAuth()).rejects.toThrow('Unauthorized - Authentication required');
    });
  });

  describe('getUserId', () => {
    it('should return userId when authenticated', async () => {
      vi.mocked(auth).mockResolvedValue({ userId: 'clerk-123' } as Awaited<ReturnType<typeof auth>>);

      const result = await getUserId();

      expect(result).toBe('clerk-123');
      expect(auth).toHaveBeenCalled();
    });

    it('should return null when not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);

      const result = await getUserId();

      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when authenticated', async () => {
      vi.mocked(auth).mockResolvedValue({ userId: 'clerk-123' } as Awaited<ReturnType<typeof auth>>);

      const result = await isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);

      const result = await isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false when userId is undefined', async () => {
      vi.mocked(auth).mockResolvedValue({ userId: undefined } as Awaited<ReturnType<typeof auth>>);

      const result = await isAuthenticated();

      expect(result).toBe(false);
    });
  });
});
