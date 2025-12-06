// GG Wi-Fi Brand Theme System
// "The Signal That Cares" - Premium yet caring wireless internet provider

// Updated to Premium Design System Colors
const tokens = {
  gold: '#F5C400',           // Gold Prime
  goldStrong: '#D4A100',     // Gold Deep
  goldLight: '#FFD700',      // Gold Light
  black: '#0B0B0B',          // Carbon Black
  white: '#FFFFFF',          // Soft White
  neutral100: '#F6F6F6',     // Frost Grey (light)
  neutral300: '#EDEDED',     // Frost Grey
  neutral600: '#8D8D8D',     // Slate Grey
};

export const ggwifiTheme = {
  colors: {
    primary: tokens.gold,
    primaryHover: tokens.goldStrong,
    secondary: tokens.black,
    contrast: tokens.white,
    neutral: tokens.black,
  },
  typography: {
    fontFamily: {
      primary: '"Inter", "Poppins", sans-serif',
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
      base: '1rem',
      lg: '1.25rem',
      xl: '1.75rem',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    pill: '999px',
  },
  shadows: {
    sm: '0 4px 12px rgba(10, 10, 10, 0.06)',
    md: '0 12px 28px rgba(10, 10, 10, 0.08)',
  },
  gradients: {
    primary: `linear-gradient(120deg, ${tokens.gold}, ${tokens.goldStrong})`,
    card: 'linear-gradient(145deg, #ffffff, #f9f9f9)',
  },
};

export const componentStyles = {
  primaryButton: {
    background: ggwifiTheme.gradients.primary,
    color: ggwifiTheme.colors.neutral,
    border: 'none',
    borderRadius: ggwifiTheme.borderRadius.md,
    padding: `${ggwifiTheme.spacing.sm} ${ggwifiTheme.spacing.lg}`,
    fontWeight: ggwifiTheme.typography.fontWeight.semibold,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: ggwifiTheme.shadows.sm,
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: ggwifiTheme.shadows.md,
    },
  },
  card: {
    background: ggwifiTheme.colors.contrast,
    borderRadius: ggwifiTheme.borderRadius.lg,
    border: `1px solid ${tokens.neutral300}`,
    boxShadow: ggwifiTheme.shadows.sm,
    padding: ggwifiTheme.spacing.lg,
  },
  navLink: {
    color: tokens.black,
    padding: `${ggwifiTheme.spacing.sm} ${ggwifiTheme.spacing.md}`,
    borderRadius: ggwifiTheme.borderRadius.md,
    transition: 'color 0.2s ease',
    '&:hover': {
      color: ggwifiTheme.colors.primaryHover,
    },
  },
};

export default ggwifiTheme;