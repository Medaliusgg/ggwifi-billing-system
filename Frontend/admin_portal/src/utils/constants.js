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

// User Roles - Complete Management System
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  OPERATOR: 'OPERATOR',
  ACCOUNTANT: 'ACCOUNTANT',
  TECHNICIAN: 'TECHNICIAN',
  CUSTOMER_SERVICE: 'CUSTOMER_SERVICE',
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

// Navigation Items - Complete Management Portal
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
    label: 'Customer Management',
    icon: 'People',
    path: '/customers',
    roles: [USER_ROLES.ADMIN],
    subItems: [
      { id: 'customer-list', label: 'All Customers', path: '/customers/list' },
      { id: 'customer-add', label: 'Add Customer', path: '/customers/add' },
      { id: 'customer-groups', label: 'Customer Groups', path: '/customers/groups' },
      { id: 'customer-import', label: 'Import Customers', path: '/customers/import' },
    ]
  },
  {
    id: 'packages',
    label: 'Internet Plans',
    icon: 'Speed',
    path: '/packages',
    roles: [USER_ROLES.ADMIN],
    subItems: [
      { id: 'hotspot-plans', label: 'Hotspot Plans', path: '/packages/hotspot' },
      { id: 'pppoe-plans', label: 'PPPoE Plans', path: '/packages/pppoe' },
      { id: 'static-plans', label: 'Static IP Plans', path: '/packages/static' },
      { id: 'plan-templates', label: 'Plan Templates', path: '/packages/templates' },
    ]
  },
  {
    id: 'vouchers',
    label: 'Voucher System',
    icon: 'ConfirmationNumber',
    path: '/vouchers',
    roles: [USER_ROLES.ADMIN],
    subItems: [
      { id: 'voucher-generate', label: 'Generate Vouchers', path: '/vouchers/generate' },
      { id: 'voucher-list', label: 'Voucher List', path: '/vouchers/list' },
      { id: 'voucher-bulk', label: 'Bulk Operations', path: '/vouchers/bulk' },
      { id: 'voucher-reports', label: 'Voucher Reports', path: '/vouchers/reports' },
    ]
  },
  {
    id: 'billing',
    label: 'Billing & Invoicing',
    icon: 'Receipt',
    path: '/billing',
    roles: [USER_ROLES.ADMIN],
    subItems: [
      { id: 'invoices', label: 'Invoices', path: '/billing/invoices' },
      { id: 'payments', label: 'Payments', path: '/billing/payments' },
      { id: 'subscriptions', label: 'Subscriptions', path: '/billing/subscriptions' },
      { id: 'billing-cycles', label: 'Billing Cycles', path: '/billing/cycles' },
      { id: 'payment-methods', label: 'Payment Methods', path: '/billing/methods' },
    ]
  },
  {
    id: 'routers',
    label: 'Network Management',
    icon: 'Router',
    path: '/routers',
    roles: [USER_ROLES.ADMIN],
    subItems: [
      { id: 'router-status', label: 'Router Status', path: '/routers/status' },
      { id: 'router-config', label: 'Router Config', path: '/routers/config' },
      { id: 'bandwidth-management', label: 'Bandwidth Management', path: '/routers/bandwidth' },
      { id: 'network-monitoring', label: 'Network Monitoring', path: '/routers/monitoring' },
    ]
  },
  {
    id: 'finance',
    label: 'Financial Management',
    icon: 'AttachMoney',
    path: '/finance',
    roles: [USER_ROLES.ADMIN],
    subItems: [
      { id: 'revenue-reports', label: 'Revenue Reports', path: '/finance/revenue' },
      { id: 'expense-tracking', label: 'Expense Tracking', path: '/finance/expenses' },
      { id: 'profit-loss', label: 'Profit & Loss', path: '/finance/profit-loss' },
      { id: 'tax-reports', label: 'Tax Reports', path: '/finance/tax' },
    ]
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: 'Assessment',
    path: '/reports',
    roles: [USER_ROLES.ADMIN],
    subItems: [
      { id: 'usage-analytics', label: 'Usage Analytics', path: '/reports/usage' },
      { id: 'customer-analytics', label: 'Customer Analytics', path: '/reports/customers' },
      { id: 'network-analytics', label: 'Network Analytics', path: '/reports/network' },
      { id: 'business-intelligence', label: 'Business Intelligence', path: '/reports/business' },
    ]
  },
  {
    id: 'staff',
    label: 'Staff Management',
    icon: 'AdminPanelSettings',
    path: '/staff',
    roles: [USER_ROLES.ADMIN],
    subItems: [
      { id: 'staff-users', label: 'Staff Accounts', path: '/staff/users' },
      { id: 'roles-permissions', label: 'Roles & Permissions', path: '/staff/roles' },
      { id: 'activity-logs', label: 'Activity Logs', path: '/staff/activity' },
      { id: 'staff-schedule', label: 'Staff Schedule', path: '/staff/schedule' },
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'Notifications',
    path: '/notifications',
    roles: [USER_ROLES.ADMIN],
    subItems: [
      { id: 'sms-campaigns', label: 'SMS Campaigns', path: '/notifications/sms' },
      { id: 'email-alerts', label: 'Email Alerts', path: '/notifications/email' },
      { id: 'system-notifications', label: 'System Notifications', path: '/notifications/system' },
      { id: 'notification-templates', label: 'Templates', path: '/notifications/templates' },
    ]
  },
  {
    id: 'loyalty',
    label: 'Loyalty Program',
    icon: 'Star',
    path: '/loyalty',
    roles: [USER_ROLES.ADMIN],
    subItems: [
      { id: 'loyalty-tiers', label: 'Loyalty Tiers', path: '/loyalty/tiers' },
      { id: 'loyalty-rewards', label: 'Rewards', path: '/loyalty/rewards' },
      { id: 'loyalty-customers', label: 'Customer Points', path: '/loyalty/customers' },
    ]
  },
  {
    id: 'settings',
    label: 'System Settings',
    icon: 'Settings',
    path: '/settings',
    roles: [USER_ROLES.ADMIN],
    subItems: [
      { id: 'general-settings', label: 'General Settings', path: '/settings/general' },
      { id: 'payment-settings', label: 'Payment Settings', path: '/settings/payment' },
      { id: 'backup-recovery', label: 'Backup & Recovery', path: '/settings/backup' },
      { id: 'system-maintenance', label: 'System Maintenance', path: '/settings/maintenance' },
    ]
  },
  {
    id: 'backend-test',
    label: 'Backend Test',
    icon: 'BugReport',
    path: '/backend-test',
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
