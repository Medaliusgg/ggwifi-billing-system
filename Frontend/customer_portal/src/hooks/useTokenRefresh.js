import { useEffect, useRef } from 'react';
import { customerAuthAPI } from '../services/api';
import { getDeviceFingerprint } from '../utils/deviceFingerprint';
import { toast } from 'react-hot-toast';

const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes before expiry

export const useTokenRefresh = (session, onSessionUpdate, onLogout) => {
  const refreshTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 3;

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('customerRefreshToken');
      if (!refreshToken) {
        console.warn('No refresh token available');
        return false;
      }

      const fingerprint = await getDeviceFingerprint();
      const response = await customerAuthAPI.refreshToken({
        refreshToken,
        deviceFingerprint: fingerprint,
      });

      if (response?.data?.status === 'success' && response?.data?.token) {
        const newToken = response.data.token;
        const newRefreshToken = response.data.refreshToken || refreshToken;

        localStorage.setItem('authToken', newToken);
        localStorage.setItem('customerRefreshToken', newRefreshToken);

        const updatedSession = {
          ...session,
          token: newToken,
          refreshToken: newRefreshToken,
        };

        localStorage.setItem('customerSession', JSON.stringify(updatedSession));
        onSessionUpdate?.(updatedSession);

        reconnectAttemptsRef.current = 0;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      reconnectAttemptsRef.current += 1;

      if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        toast.error('Session expired. Please log in again.');
        onLogout?.();
        return false;
      }

      return false;
    }
  };

  const scheduleRefresh = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    refreshTimerRef.current = setTimeout(async () => {
      const success = await refreshToken();
      if (success) {
        scheduleRefresh();
      }
    }, TOKEN_REFRESH_INTERVAL - TOKEN_EXPIRY_BUFFER);
  };

  useEffect(() => {
    if (session?.token) {
      scheduleRefresh();
    }

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [session?.token]);

  return { refreshToken };
};






