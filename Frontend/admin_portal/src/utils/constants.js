// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    OTP_GENERATE: '/auth/otp/generate',
    OTP_VALIDATE: '/auth/otp/validate',
    OTP_RESEND: '/auth/otp/resend',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    PACKAGES: '/admin/packages',
    VOUCHERS: '/admin/vouchers',
    ROUTERS: '/admin/mikrotik/routers',
    PAYMENTS: '/admin/payments',
    CUSTOMERS: '/admin/customers',
    LOYALTY: '/admin/loyalty',
  },
  SYSTEM: {
    STATUS: '/system/status',
    CONFIG: '/system/config',
    HEALTH: '/health',
  },
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  PPPOE_USER: 'PPPOE_USER',
  HOTSPOT_USER: 'HOTSPOT_USER',
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED',
  BANNED: 'BANNED',
};

// Package Types
export const PACKAGE_TYPES = {
  HOTSPOT: 'HOTSPOT',
  PPPOE: 'PPPOE',
};

// Voucher Status
export const VOUCHER_STATUS = {
  AVAILABLE: 'AVAILABLE',
  USED: 'USED',
  EXPIRED: 'EXPIRED',
  SUSPENDED: 'SUSPENDED',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

// Payment Methods
export const PAYMENT_METHODS = {
  MOBILE_MONEY: 'MOBILE_MONEY',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CASH: 'CASH',
};

// Router Status
export const ROUTER_STATUS = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  MAINTENANCE: 'MAINTENANCE',
  ERROR: 'ERROR',
};

// Router Types
export const ROUTER_TYPES = {
  HOTSPOT: 'HOTSPOT',
  PPPOE: 'PPPOE',
  HYBRID: 'HYBRID',
};

// Customer Types
export const CUSTOMER_TYPES = {
  HOTSPOT_USER: 'HOTSPOT_USER',
  PPPOE_USER: 'PPPOE_USER',
  BOTH: 'BOTH',
};

// Loyalty Tiers
export const LOYALTY_TIERS = {
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
  DIAMOND: 'DIAMOND',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#FFD700',
  SECONDARY: '#E6C200',
  SUCCESS: '#4CAF50',
  ERROR: '#F44336',
  WARNING: '#FF9800',
  INFO: '#2196F3',
  GRAY: '#9E9E9E',
};

// Breakpoints
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 960,
  LG: 1280,
  XL: 1920,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'ggwifi_auth_token',
  REFRESH_TOKEN: 'ggwifi_refresh_token',
  USER_DATA: 'ggwifi_user_data',
  THEME: 'ggwifi_theme',
  SIDEBAR_STATE: 'ggwifi_sidebar_state',
};

// Form Validation
export const VALIDATION_RULES = {
  PHONE_NUMBER: {
    PATTERN: /^(\+255|255|0)[0-9]{9}$/,
    MESSAGE: 'Please enter a valid Tanzanian phone number',
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MESSAGE: 'Password must be at least 8 characters long',
  },
  OTP: {
    PATTERN: /^[0-9]{6}$/,
    MESSAGE: 'OTP must be 6 digits',
  },
};

// Time Constants
export const TIME_CONSTANTS = {
  TOKEN_REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  API_TIMEOUT: 10000, // 10 seconds
  DEBOUNCE_DELAY: 300, // 300ms
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
};

// Dashboard Stats
export const DASHBOARD_STATS = {
  REFRESH_INTERVAL: 30 * 1000, // 30 seconds
  CHART_DATA_POINTS: 30, // Last 30 data points
};

// Navigation Items
export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'Dashboard',
    path: '/dashboard',
    roles: [USER_ROLES.ADMIN],
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'People',
    path: '/customers',
    roles: [USER_ROLES.ADMIN],
  },
  {
    id: 'routers',
    label: 'Routers',
    icon: 'Router',
    path: '/routers',
    roles: [USER_ROLES.ADMIN],
  },
  {
    id: 'packages',
    label: 'Packages',
    icon: 'Package',
    path: '/packages',
    roles: [USER_ROLES.ADMIN],
  },
  {
    id: 'vouchers',
    label: 'Vouchers',
    icon: 'ConfirmationNumber',
    path: '/vouchers',
    roles: [USER_ROLES.ADMIN],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: 'AttachMoney',
    path: '/finance',
    roles: [USER_ROLES.ADMIN],
  },
  {
    id: 'loyalty',
    label: 'Loyalty',
    icon: 'Star',
    path: '/loyalty',
    roles: [USER_ROLES.ADMIN],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/settings',
    roles: [USER_ROLES.ADMIN],
  },
];

// Export all constants
export default {
  API_ENDPOINTS,
  USER_ROLES,
  USER_STATUS,
  PACKAGE_TYPES,
  VOUCHER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  ROUTER_STATUS,
  ROUTER_TYPES,
  CUSTOMER_TYPES,
  LOYALTY_TIERS,
  NOTIFICATION_TYPES,
  CHART_COLORS,
  BREAKPOINTS,
  PAGINATION,
  STORAGE_KEYS,
  VALIDATION_RULES,
  TIME_CONSTANTS,
  FILE_UPLOAD,
  DASHBOARD_STATS,
  NAVIGATION_ITEMS,
};
