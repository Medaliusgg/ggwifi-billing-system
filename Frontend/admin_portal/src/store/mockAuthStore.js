import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

      // Initialize store
      initialize: () => {
        console.log('🔍 Mock AuthStore - Initializing...');
        const state = get();
        console.log('🔍 Mock AuthStore - Current state:', {
          isAuthenticated: state.isAuthenticated,
          user: state.user?.username,
          token: state.token ? 'present' : 'null'
        });
      },

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          console.log('🔍 Mock AuthStore - Attempting login with:', credentials);

          // Mock authentication - accept any credentials for demo
          const mockUser = {
            id: 1,
            username: credentials.username || 'admin',
            email: 'admin@ggwifi.co.tz',
            role: 'ADMIN',
            permissions: ['USER_MANAGE', 'PACKAGE_MANAGE', 'ROUTER_CONFIGURE', 'REPORT_VIEW'],
            phoneNumber: credentials.phoneNumber || '0742844024',
            staffId: credentials.staffId || 'STAFF001',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          const mockToken = `mock_token_${Date.now()}`;

          // Set session timeout (8 hours)
          const timeout = 8 * 60 * 60 * 1000;
          const sessionTimeout = setTimeout(() => {
            get().logout('Session expired');
          }, timeout);

          set({
            user: mockUser,
            token: mockToken,
            refreshToken: null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            sessionTimeout,
            lastActivity: Date.now(),
            permissions: mockUser.permissions || []
          });

          // Track user activity for session management
          get().updateActivity();

          console.log('🔍 Mock AuthStore - Login successful:', mockUser);
          console.log('🔍 Mock AuthStore - Authentication state:', {
            isAuthenticated: true,
            user: mockUser.username,
            role: mockUser.role
          });

          return { success: true, user: mockUser };
        } catch (error) {
          const errorMessage = error.message || 'Login failed';
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
        console.log('🔍 Mock AuthStore - Logging out:', reason);
        
        const { sessionTimeout } = get();
        if (sessionTimeout) {
          clearTimeout(sessionTimeout);
        }

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          sessionTimeout: null,
          lastActivity: null,
          permissions: []
        });
      },

      clearError: () => {
        set({ error: null });
      },

      updateActivity: () => {
        set({ lastActivity: Date.now() });
      },

      refreshToken: async () => {
        // Mock refresh - just return success
        return { success: true };
      },

      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },

      setUserPreferences: (preferences) => {
        set({ userPreferences: preferences });
      },

      // Mock API methods that don't require backend
      mockApiCall: async (endpoint, data) => {
        console.log('🔍 Mock API call:', endpoint, data);
        return { success: true, data: {} };
      }
    }),
    {
      name: 'ggwifi-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions
      }),
      onRehydrateStorage: () => (state) => {
        console.log('🔍 Mock AuthStore - Rehydrating state:', state);
        if (state?.token && state?.isAuthenticated) {
          console.log('🔍 Mock AuthStore - User is authenticated:', state.user?.username);
        } else {
          console.log('🔍 Mock AuthStore - User is not authenticated');
        }
      }
    }
  )
);

export default useAuthStore;
