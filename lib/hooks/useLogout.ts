// ═══════════════════════════════════════════════════════════════
// LOGOUT HOOK WITH LOCALSTORAGE CLEANUP
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0
// Purpose: Handle logout with localStorage cleanup
// Features:
// - Clear canvas localStorage on logout
// - Support for Clerk sign-out
// - TypeScript strict mode compatible
// ═══════════════════════════════════════════════════════════════

import { useCallback } from 'react';
import { useClerk } from '@clerk/nextjs';
import { clearCanvasLocalStorage } from '@/lib/editor/canvas-store';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Hook Implementation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface UseLogoutReturn {
  /** Logout function that clears localStorage and signs out */
  logout: () => Promise<void>;

  /** Whether logout is in progress */
  isLoggingOut: boolean;
}

/**
 * Hook for handling logout with localStorage cleanup
 *
 * @example
 * ```typescript
 * const { logout, isLoggingOut } = useLogout();
 *
 * <button onClick={logout} disabled={isLoggingOut}>
 *   {isLoggingOut ? 'Logging out...' : 'Logout'}
 * </button>
 * ```
 */
export function useLogout(): UseLogoutReturn {
  const { signOut } = useClerk();

  const logout = useCallback(async () => {
    try {
      console.log('🚪 Logging out...');

      // Clear canvas localStorage
      clearCanvasLocalStorage();

      // Sign out from Clerk
      await signOut();

      console.log('✅ Logout complete');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    }
  }, [signOut]);

  return {
    logout,
    isLoggingOut: false, // Could add state if needed
  };
}
