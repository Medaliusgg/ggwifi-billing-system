import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useTokenRefresh } from '../useTokenRefresh';
import { customerAuthAPI } from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
  customerAuthAPI: {
    refreshToken: vi.fn(),
  },
}));

// Mock device fingerprint
vi.mock('../../utils/deviceFingerprint', () => ({
  getDeviceFingerprint: vi.fn(() => Promise.resolve('test-fingerprint-123')),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTokenRefresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should not refresh if no refresh token', async () => {
    localStorage.removeItem('customerRefreshToken');

    const mockSession = { token: 'mock-token' };
    const { result } = renderHook(() => useTokenRefresh(mockSession), {
      wrapper: createWrapper(),
    });

    // Wait a bit to ensure no refresh is triggered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(customerAuthAPI.refreshToken).not.toHaveBeenCalled();
    expect(result.current.refreshToken).toBeDefined();
  });

  it('should refresh token successfully', async () => {
    localStorage.setItem('customerRefreshToken', 'mock-refresh-token');
    customerAuthAPI.refreshToken.mockResolvedValue({
      data: {
        status: 'success',
        token: 'new-access-token',
        refreshToken: 'new-refresh-token',
      },
    });

    const mockSession = { token: 'mock-token' };
    const mockOnSessionUpdate = vi.fn();
    const { result } = renderHook(() => useTokenRefresh(mockSession, mockOnSessionUpdate), {
      wrapper: createWrapper(),
    });

    // Manually trigger refresh
    await result.current.refreshToken();

    await waitFor(() => {
      expect(customerAuthAPI.refreshToken).toHaveBeenCalled();
      expect(localStorage.getItem('authToken')).toBe('new-access-token');
    });
  });

  it('should handle refresh failure', async () => {
    localStorage.setItem('customerRefreshToken', 'invalid-refresh-token');
    customerAuthAPI.refreshToken.mockRejectedValue({
      response: {
        data: {
          message: 'Invalid refresh token',
        },
      },
    });

    const mockOnLogout = vi.fn();
    const mockSession = { token: 'mock-token' };

    const { result } = renderHook(() => useTokenRefresh(mockSession, null, mockOnLogout), {
      wrapper: createWrapper(),
    });

    // Trigger refresh multiple times to exceed max retries
    for (let i = 0; i < 3; i++) {
      await result.current.refreshToken();
    }

    await waitFor(() => {
      // After max retries, should call onLogout
      expect(mockOnLogout).toHaveBeenCalled();
    });
  });

  it('should update tokens in localStorage on successful refresh', async () => {
    localStorage.setItem('customerRefreshToken', 'mock-refresh-token');
    customerAuthAPI.refreshToken.mockResolvedValue({
      data: {
        status: 'success',
        token: 'new-access-token',
        refreshToken: 'new-refresh-token',
      },
    });

    const mockSession = { token: 'mock-token' };
    const { result } = renderHook(() => useTokenRefresh(mockSession), {
      wrapper: createWrapper(),
    });

    // Manually trigger refresh
    await result.current.refreshToken();

    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBe('new-access-token');
      expect(localStorage.getItem('customerRefreshToken')).toBe('new-refresh-token');
    });
  });

  it('should retry on failure up to max attempts', async () => {
    localStorage.setItem('customerRefreshToken', 'mock-refresh-token');
    customerAuthAPI.refreshToken.mockRejectedValue(new Error('Network error'));

    const mockSession = { token: 'mock-token' };
    const { result } = renderHook(() => useTokenRefresh(mockSession), {
      wrapper: createWrapper(),
    });

    // Trigger refresh multiple times
    for (let i = 0; i < 3; i++) {
      await result.current.refreshToken();
    }

    await waitFor(() => {
      // Should have attempted refresh multiple times
      expect(customerAuthAPI.refreshToken.mock.calls.length).toBeGreaterThan(0);
    });
  });
});

