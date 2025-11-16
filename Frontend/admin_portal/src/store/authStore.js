import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api/client';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      sessionTimeout: null,
      lastActivity: null,
      permissions: [],
      userPreferences: {},
      expiresAt: null,
      idleTimer: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🔍 Debug: AuthStore - Attempting login with:', credentials);
          
          // Use the proper dual login endpoints
          let endpoint;
          let loginCredentials;
          
          if (credentials.loginType === 'admin') {
            if (!credentials.phoneNumber) {
              throw new Error('Phone number is required for admin login');
            }
            endpoint = '/auth/admin-login';
            loginCredentials = {
              username: credentials.username,
              phoneNumber: credentials.phoneNumber,
              password: credentials.password
            };
            console.log('🔍 Debug: Admin login - Phone:', credentials.phoneNumber);
          } else {
            if (!credentials.staffId) {
              throw new Error('Staff ID is required for staff login');
            }
            endpoint = '/auth/staff-login';
            loginCredentials = {
              username: credentials.username,
              staffId: credentials.staffId,
              password: credentials.password
            };
            console.log('🔍 Debug: Staff login - Staff ID:', credentials.staffId);
          }
          
          const response = await apiClient.post(endpoint, loginCredentials);
          console.log('🔍 Debug: AuthStore - Login response:', response);
          
          if (response.data.status === 'success') {
            const { user, token } = response.data.data;
            const permissions = user.permissions || [];
            
            // Store tokens for both new client and legacy axios usage
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
              localStorage.setItem('authToken', token);
              localStorage.setItem('user', JSON.stringify({ ...user, permissions }));
            } catch (e) {
              console.warn('Failed to persist auth token to localStorage:', e);
            }
            
            // Derive expiry from JWT if present; fallback 8h
            const decodeJwt = (jwt) => {
              try {
                const base64 = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
                const json = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                return JSON.parse(json);
              } catch (e) { return {}; }
            };
            const claims = decodeJwt(token) || {};
            const expMs = claims.exp ? claims.exp * 1000 : (Date.now() + 8 * 60 * 60 * 1000);

            // Timer to enforce absolute expiry
            const sessionTimeout = setTimeout(() => {
              get().logout('Session expired');
            }, Math.max(0, expMs - Date.now()));
            
            set({
              user: { ...user, permissions },
              token,
              refreshToken: null, // Current backend doesn't provide refresh token
              isAuthenticated: true,
              isLoading: false,
              error: null,
              sessionTimeout,
              lastActivity: Date.now(),
              permissions: permissions || [],
              expiresAt: expMs
            });
            
            // Track user activity for session management
            get().initSessionWatch();
            
            return { success: true, user: { ...user, permissions } };
          } else {
            throw new Error(response.data.message || 'Login failed');
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
            sessionTimeout: null,
            lastActivity: null,
            permissions: []
          });
          
          return { success: false, error: errorMessage };
        }
      },

      logout: (reason = 'User logout') => {
        // Clear session timeout
        const { sessionTimeout } = get();
        if (sessionTimeout) {
          clearTimeout(sessionTimeout);
        }
        
        // Clear tokens
        delete apiClient.defaults.headers.common['Authorization'];
        
        // Log logout event
        console.log(`User logged out: ${reason}`);
        
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          sessionTimeout: null,
          lastActivity: null,
          permissions: [],
          userPreferences: {}
        });
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout('No refresh token');
          return false;
        }

        try {
          const response = await apiClient.post('/auth/refresh', { refreshToken });
          const payload = response.data;
          if (payload?.status === 'success') {
            const { token, refreshToken: newRefreshToken, expiresIn } = payload.data || {};

            if (!token) throw new Error('Missing token in refresh response');

            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Reset session timeout
            const timeout = expiresIn ? expiresIn * 1000 : 8 * 60 * 60 * 1000;
            const sessionTimeout = setTimeout(() => {
              get().logout('Session expired');
            }, timeout);

            set({
              token,
              refreshToken: newRefreshToken || refreshToken,
              sessionTimeout,
              lastActivity: Date.now()
            });

            return true;
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().logout('Token refresh failed');
          return false;
        }

        return false;
      },

      updateActivity: () => {
        const state = get();
        const now = Date.now();
        set({ lastActivity: now });
        // Reset idle timer on any activity
        if (state.idleTimer) clearTimeout(state.idleTimer);
        const idleMinutes = Number(import.meta.env.VITE_SESSION_MAX_IDLE_MINUTES || 30);
        const idleMs = idleMinutes * 60 * 1000;
        const newIdle = setTimeout(() => {
          get().logout('Logged out due to inactivity');
        }, idleMs);
        set({ idleTimer: newIdle });
      },

      initSessionWatch: () => {
        // Attach listeners once per session
        const activityEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
        const onActivity = () => get().updateActivity();
        activityEvents.forEach(evt => window.addEventListener(evt, onActivity, { passive: true }));
        // Initialize idle timer immediately
        get().updateActivity();
      },

      clearError: () => set({ error: null }),

      setLoading: (isLoading) => set({ isLoading }),

      updateUserProfile: async (profileData) => {
        try {
          const response = await apiClient.put('/auth/profile', profileData);
          if (response.status === 'success') {
            set({ user: { ...get().user, ...response.data.user } });
            return { success: true };
          }
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      changePassword: async (currentPassword, newPassword) => {
        try {
          const response = await apiClient.put('/auth/change-password', {
            currentPassword,
            newPassword
          });
          return { success: response.status === 'success' };
        } catch (error) {
          return { success: false, error: error.response?.data?.message || error.message };
        }
      },

      // Role-based access control
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },

      hasAnyRole: (roles) => {
        const { user } = get();
        return roles.includes(user?.role);
      },

      // Permission-based access control
      hasPermission: (permission) => {
        const { user, permissions } = get();
        return permissions.includes(permission) || user?.role === 'SUPER_ADMIN';
      },

      hasAnyPermission: (permissions) => {
        const { user, permissions: userPermissions } = get();
        return permissions.some(permission => 
          userPermissions.includes(permission) || user?.role === 'SUPER_ADMIN'
        );
      },

      // Session management
      isSessionValid: () => {
        const { lastActivity, isAuthenticated, expiresAt } = get();
        if (!isAuthenticated || !lastActivity) return false;
        
        // Inactivity limit (default 30m)
        const idleMinutes = Number(import.meta.env.VITE_SESSION_MAX_IDLE_MINUTES || 30);
        const idleMs = idleMinutes * 60 * 1000;
        const notIdle = Date.now() - lastActivity < idleMs;
        const notExpired = !expiresAt || Date.now() < expiresAt;
        return notIdle && notExpired;
      },

      // Get user display name
      getUserDisplayName: () => {
        const { user } = get();
        if (!user) return 'Guest';
        return user.fullName || user.username || user.email || 'Unknown User';
      },

      // Check if user can access specific module
      canAccessModule: (module) => {
        const { user } = get();
        if (!user) return false;
        
        // Super admin can access everything
        if (user.role === 'SUPER_ADMIN') return true;
        
        // Check module-specific permissions
        const modulePermissions = {
          dashboard: ['VIEW_DASHBOARD'],
          customers: ['VIEW_CUSTOMERS', 'MANAGE_CUSTOMERS'],
          routers: ['VIEW_ROUTERS', 'MANAGE_ROUTERS'],
          packages: ['VIEW_PACKAGES', 'MANAGE_PACKAGES'],
          vouchers: ['VIEW_VOUCHERS', 'MANAGE_VOUCHERS'],
          finance: ['VIEW_FINANCE', 'MANAGE_FINANCE'],
          reports: ['VIEW_REPORTS'],
          settings: ['VIEW_SETTINGS', 'MANAGE_SETTINGS']
        };
        
        const requiredPermissions = modulePermissions[module] || [];
        return get().hasAnyPermission(requiredPermissions);
      },

      // User preferences
      setUserPreference: (key, value) => {
        const preferences = { ...get().userPreferences, [key]: value };
        set({ userPreferences: preferences });
      },

      getUserPreference: (key, defaultValue = null) => {
        return get().userPreferences[key] || defaultValue;
      },

      // Audit logging
      logUserAction: async (action, details = {}) => {
        try {
          await apiClient.post('/auth/audit-log', {
            action,
            details,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ip: 'client-side'
          });
        } catch (error) {
          console.error('Failed to log user action:', error);
        }
      },

      // Security functions
      validateSession: () => {
        if (!get().isSessionValid()) {
          get().logout('Session invalid');
          return false;
        }
        get().updateActivity();
        return true;
      },

      // Getters for backward compatibility
      getUser: () => get().user,
      getToken: () => get().token,
      isLoggedIn: () => get().isAuthenticated,
    }),
    {
      name: 'ggwifi-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity,
        permissions: state.permissions,
        userPreferences: state.userPreferences,
        expiresAt: state.expiresAt
      }),
      // Security: Only persist essential data
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
        }
        // Resume session watchers after reload
        if (state?.isAuthenticated) {
          setTimeout(() => {
            try { get().initSessionWatch(); } catch (_) {}
          }, 0);
        }
      }
    }
  )
);

export default useAuthStore;