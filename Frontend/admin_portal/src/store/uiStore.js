import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  // Sidebar state
  sidebarOpen: true,
  sidebarWidth: 280,

  // Theme state
  darkMode: true,
  primaryColor: '#FFD700',

  // Loading states
  globalLoading: false,
  pageLoading: false,

  // Notifications
  notifications: [],
  unreadCount: 0,

  // Search state
  searchQuery: '',
  searchResults: [],

  // Modal states
  modals: {
    createUser: false,
    createPackage: false,
    createRouter: false,
    bulkGenerateVouchers: false,
    confirmDialog: false,
  },

  // Actions
  toggleSidebar: () => {
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
      sidebarWidth: state.sidebarOpen ? 60 : 280,
    }));
  },

  setSidebarOpen: (open) => {
    set({
      sidebarOpen: open,
      sidebarWidth: open ? 280 : 60,
    });
  },

  setGlobalLoading: (loading) => {
    set({ globalLoading: loading });
  },

  setPageLoading: (loading) => {
    set({ pageLoading: loading });
  },

  // Notification actions
  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      timestamp: new Date(),
      read: false,
      ...notification,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));

    // Auto remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 5000);

    return id;
  },

  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === id);
      const unreadDecrease = notification && !notification.read ? 1 : 0;
      
      return {
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: Math.max(0, state.unreadCount - unreadDecrease),
      };
    });
  },

  markNotificationAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  // Search actions
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setSearchResults: (results) => {
    set({ searchResults: results });
  },

  // Modal actions
  openModal: (modalName) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: true,
      },
    }));
  },

  closeModal: (modalName) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: false,
      },
    }));
  },

  closeAllModals: () => {
    set((state) => ({
      modals: Object.keys(state.modals).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
    }));
  },

  // Utility actions
  showSuccessNotification: (message, title = 'Success') => {
    get().addNotification({
      type: 'success',
      title,
      message,
    });
  },

  showErrorNotification: (message, title = 'Error') => {
    get().addNotification({
      type: 'error',
      title,
      message,
    });
  },

  showWarningNotification: (message, title = 'Warning') => {
    get().addNotification({
      type: 'warning',
      title,
      message,
    });
  },

  showInfoNotification: (message, title = 'Info') => {
    get().addNotification({
      type: 'info',
      title,
      message,
    });
  },
}));
