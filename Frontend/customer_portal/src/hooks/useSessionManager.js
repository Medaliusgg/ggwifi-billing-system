import React, { useState, useEffect, useCallback, useRef } from 'react';
import { customerPortalAPI } from '../services/customerPortalApi';
import { getStoredFingerprintHash } from '../utils/deviceFingerprint';
import toast from 'react-hot-toast';

/**
 * Session Manager Hook
 * Manages voucher session lifecycle, reconnection, and status monitoring
 */
export const useSessionManager = () => {
  const [sessionStatus, setSessionStatus] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const heartbeatIntervalRef = useRef(null);
  const statusCheckIntervalRef = useRef(null);

  // Get stored session info
  const getStoredSession = useCallback(() => {
    const token = localStorage.getItem('ggwifi_session_token');
    const voucherCode = localStorage.getItem('ggwifi_voucher_code');
    return { token, voucherCode };
  }, []);

  // Check session status
  const checkSessionStatus = useCallback(async (voucherCode) => {
    try {
      const response = await customerPortalAPI.getSessionStatus(voucherCode);
      const data = response.data || response;
      
      if (data.status === 'success') {
        setSessionStatus(data);
        setIsConnected(data.connected || false);
        setRemainingTime(data.remainingTimeSeconds || 0);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Failed to check session status:', error);
      return null;
    }
  }, []);

  // Start heartbeat
  const startHeartbeat = useCallback((voucherCode, intervalSeconds = 60) => {
    // Clear existing heartbeat
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(async () => {
      try {
        const fingerprintHash = getStoredFingerprintHash();
        await customerPortalAPI.recordHeartbeat(voucherCode, {
          deviceFingerprintHash: fingerprintHash
        });
        console.log('Heartbeat sent');
      } catch (error) {
        console.error('Heartbeat failed:', error);
        // Try to reconnect
        await reconnectSession(voucherCode);
      }
    }, intervalSeconds * 1000);
  }, []);

  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // Start status monitoring
  const startStatusMonitoring = useCallback((voucherCode, intervalSeconds = 30) => {
    // Clear existing monitoring
    if (statusCheckIntervalRef.current) {
      clearInterval(statusCheckIntervalRef.current);
    }

    statusCheckIntervalRef.current = setInterval(async () => {
      await checkSessionStatus(voucherCode);
    }, intervalSeconds * 1000);
  }, [checkSessionStatus]);

  // Stop status monitoring
  const stopStatusMonitoring = useCallback(() => {
    if (statusCheckIntervalRef.current) {
      clearInterval(statusCheckIntervalRef.current);
      statusCheckIntervalRef.current = null;
    }
  }, []);

  // Reconnect session
  const reconnectSession = useCallback(async (voucherCode) => {
    setIsReconnecting(true);
    try {
      const fingerprintHash = getStoredFingerprintHash();
      const macAddress = '00:00:00:00:00:00'; // Will be detected by backend
      const ipAddress = '0.0.0.0'; // Will be detected by backend

      const response = await customerPortalAPI.reconnectSession(voucherCode, {
        macAddress,
        ipAddress,
        deviceFingerprintHash: fingerprintHash
      });

      const data = response.data || response;

      if (data.status === 'success') {
        setIsConnected(true);
        toast.success('Session reconnected successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Reconnection failed:', error);
      return false;
    } finally {
      setIsReconnecting(false);
    }
  }, []);

  // Reconnect using token
  const reconnectWithToken = useCallback(async (token) => {
    setIsReconnecting(true);
    try {
      const fingerprintHash = getStoredFingerprintHash();
      const macAddress = '00:00:00:00:00:00';
      const ipAddress = '0.0.0.0';

      const response = await customerPortalAPI.reconnectWithToken({
        sessionToken: token,
        macAddress,
        ipAddress,
        deviceFingerprintHash: fingerprintHash
      });

      const data = response.data || response;

      if (data.status === 'success') {
        setIsConnected(true);
        toast.success('Session reconnected using saved token');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token reconnection failed:', error);
      return false;
    } finally {
      setIsReconnecting(false);
    }
  }, []);

  // Auto-reconnect on mount
  useEffect(() => {
    const { token, voucherCode } = getStoredSession();
    
    if (token && voucherCode) {
      // Try to reconnect with token first
      reconnectWithToken(token).then((success) => {
        if (success && voucherCode) {
          // Start monitoring
          checkSessionStatus(voucherCode);
          startStatusMonitoring(voucherCode);
        } else if (voucherCode) {
          // Fallback to voucher code reconnection
          reconnectSession(voucherCode).then((success) => {
            if (success) {
              checkSessionStatus(voucherCode);
              startStatusMonitoring(voucherCode);
            }
          });
        }
      });
    }

    return () => {
      stopHeartbeat();
      stopStatusMonitoring();
    };
  }, []);

  // Format remaining time
  const formatRemainingTime = useCallback((seconds) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  }, []);

  return {
    sessionStatus,
    isConnected,
    remainingTime,
    isReconnecting,
    checkSessionStatus,
    reconnectSession,
    reconnectWithToken,
    startHeartbeat,
    stopHeartbeat,
    startStatusMonitoring,
    stopStatusMonitoring,
    formatRemainingTime,
    getStoredSession,
  };
};

