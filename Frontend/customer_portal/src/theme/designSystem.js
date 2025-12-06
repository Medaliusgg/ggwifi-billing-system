// Design System Tokens - Additional design tokens
// Used alongside premiumDesignSystem

export const designTokens = {
  colors: {
    // Gold colors
    gold: '#F5C400',
    goldStrong: '#D4A100',
    goldLight: '#FFD700',
    goldPale: '#FFE89C',
    
    // Neutral colors
    white: '#FFFFFF',
    black: '#0B0B0B',
    neutral100: '#F6F6F6',
    neutral300: '#EDEDED',
    
    // Status colors
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
    md: '0 4px 12px rgba(0, 0, 0, 0.1)',
    lg: '0 2px 16px rgba(0, 0, 0, 0.14)',
    navbar: '0 2px 8px rgba(0, 0, 0, 0.08)',
    card: '0 2px 8px rgba(0, 0, 0, 0.05)',
    xl: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
  borderRadius: {
    sm: '8px',
    medium: '12px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  typography: {
    fontFamily: {
      primary: '"IBM Plex Sans", "Inter", -apple-system, "Segoe UI", Roboto, sans-serif',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      body: '0.875rem',
      bodySmall: '0.75rem',
      h1: '1.75rem',
      h2: '1.25rem',
      h3: '1.125rem',
    },
    lineHeight: {
      h1: '2rem',
      h2: '1.5rem',
      h3: '1.375rem',
      body: '1.5rem',
      small: '1.25rem',
    },
  },
};

export default designTokens;

