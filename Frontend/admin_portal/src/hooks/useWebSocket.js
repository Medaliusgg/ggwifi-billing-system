import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

/**
 * WebSocket Hook for Real-Time Session Monitoring
 * Connects to backend WebSocket server for live session updates
 */
export const useWebSocket = (url = '/ws') => {
  const [connected, setConnected] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    // Get API base URL from environment
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.ggwifi.co.tz';
    const wsUrl = `${apiBaseUrl.replace('https://', 'wss://').replace('http://', 'ws://')}${url}`;

    // Create STOMP client
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected');
        setConnected(true);
        setError(null);

        // Subscribe to live session updates
        client.subscribe('/topic/sessions', (message) => {
          try {
            const data = JSON.parse(message.body);
            handleSessionUpdate(data);
          } catch (err) {
            console.error('Failed to parse session update:', err);
          }
        });

        // Request initial session list
        client.publish({
          destination: '/app/sessions/subscribe',
          body: JSON.stringify({})
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setError(frame.headers['message'] || 'WebSocket connection error');
        setConnected(false);
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        setConnected(false);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection failed');
        setConnected(false);
      }
    });

    clientRef.current = client;
    client.activate();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [url]);

  const handleSessionUpdate = (data) => {
    switch (data.type) {
      case 'session_created':
      case 'session_update':
        setSessions((prev) => {
          const existing = prev.findIndex(s => s.voucherCode === data.session?.voucherCode);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = data.session;
            return updated;
          }
          return [...prev, data.session];
        });
        break;
      case 'session_terminated':
        setSessions((prev) => 
          prev.filter(s => s.voucherCode !== data.voucherCode)
        );
        break;
      default:
        console.log('Unknown session update type:', data.type);
    }
  };

  const terminateSession = (voucherCode) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination: '/app/sessions/terminate',
        body: JSON.stringify({ voucherCode })
      });
    }
  };

  return {
    connected,
    sessions,
    error,
    terminateSession
  };
};


