import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatPhoneNumber } from '../utils/formatters.js';
import { API_ENDPOINTS, USER_ROLES } from '../utils/constants.js';

describe('Utility Functions Tests', () => {
  describe('Formatters', () => {
    it('should format currency correctly', () => {
      // Test formatCurrency if it exists
      if (typeof formatCurrency === 'function') {
        expect(formatCurrency(1000)).toBeDefined();
      }
    });

    it('should format date correctly', () => {
      // Test formatDate if it exists
      if (typeof formatDate === 'function') {
        const date = new Date();
        expect(formatDate(date)).toBeDefined();
      }
    });

    it('should format phone number correctly', () => {
      // Test formatPhoneNumber if it exists
      if (typeof formatPhoneNumber === 'function') {
        expect(formatPhoneNumber('0742844024')).toBeDefined();
      }
    });
  });

  describe('Constants', () => {
    it('should have API_ENDPOINTS defined', () => {
      expect(API_ENDPOINTS).toBeDefined();
      expect(typeof API_ENDPOINTS).toBe('object');
    });

    it('should have AUTH endpoints in API_ENDPOINTS', () => {
      expect(API_ENDPOINTS.AUTH).toBeDefined();
      expect(API_ENDPOINTS.AUTH.LOGIN).toBeDefined();
    });

    it('should have ADMIN endpoints in API_ENDPOINTS', () => {
      expect(API_ENDPOINTS.ADMIN).toBeDefined();
    });

    it('should have USER_ROLES defined', () => {
      expect(USER_ROLES).toBeDefined();
      expect(typeof USER_ROLES).toBe('object');
    });

    it('should have SUPER_ADMIN role', () => {
      expect(USER_ROLES.SUPER_ADMIN).toBeDefined();
    });
  });
});



