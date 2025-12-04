// GG Wi-Fi Brand Theme System
// "The Signal That Cares" - Premium yet caring wireless internet provider

const tokens = {
  gold: '#F2C94C',
  goldStrong: '#E0B335',
  black: '#0A0A0A',
  white: '#FFFFFF',
  neutral100: '#F6F6F6',
  neutral300: '#E8E8E8',
  neutral600: '#5C5C5C',
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
