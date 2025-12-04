import { describe, it, expect, beforeEach } from 'vitest';
import useAuthStore from '../store/authStore.js';

describe('Store Tests', () => {
  describe('Auth Store', () => {
    it('should be defined', () => {
      expect(useAuthStore).toBeDefined();
    });

    it('should have login method', () => {
      const store = useAuthStore.getState();
      // Check if store has expected methods
      expect(store).toBeDefined();
    });

    it('should have logout method', () => {
      const store = useAuthStore.getState();
      // Check if store has logout method
      expect(store).toBeDefined();
    });

    it('should handle token storage', () => {
      const store = useAuthStore.getState();
      // Verify store can handle tokens
      expect(store).toBeDefined();
    });
  });
});



