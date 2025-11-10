#!/usr/bin/env node

/**
 * Clear Editor State Script
 *
 * This script helps clear old component data from localStorage
 * that may have outdated prop formats causing React warnings.
 *
 * Usage:
 * 1. Open browser DevTools (F12)
 * 2. Go to Console tab
 * 3. Copy and paste this code
 * 4. Press Enter
 * 5. Refresh the page
 */

(function clearEditorState() {
  try {
    // Get all localStorage keys
    const keys = Object.keys(localStorage);

    // Find canvas-store key (it's persisted by Zustand)
    const canvasStoreKey = keys.find(key => key.includes('canvas-store'));

    if (canvasStoreKey) {
      console.log('🧹 Found canvas store:', canvasStoreKey);

      // Parse the stored state
      const storedData = JSON.parse(localStorage.getItem(canvasStoreKey));

      console.log('📊 Current state:', {
        components: storedData?.state?.components?.length || 0,
        selectedComponentId: storedData?.state?.selectedComponentId,
      });

      // Clear components but keep other state
      if (storedData?.state) {
        storedData.state.components = [];
        storedData.state.selectedComponentId = null;
        localStorage.setItem(canvasStoreKey, JSON.stringify(storedData));

        console.log('✅ Cleared all components from canvas store');
        console.log('🔄 Please refresh the page to see changes');
      }
    } else {
      console.log('ℹ️ No canvas store found in localStorage');
    }

    // Also clear any other editor-related keys
    const editorKeys = keys.filter(key =>
      key.includes('editor') ||
      key.includes('canvas') ||
      key.includes('component')
    );

    if (editorKeys.length > 0) {
      console.log('🧹 Clearing additional editor keys:', editorKeys);
      editorKeys.forEach(key => localStorage.removeItem(key));
    }

    console.log('✨ Editor state cleared successfully!');
    console.log('📝 Add fresh components to verify fixes are working');

  } catch (error) {
    console.error('❌ Error clearing editor state:', error);
  }
})();
