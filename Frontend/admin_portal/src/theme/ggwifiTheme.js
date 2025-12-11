// GG WiFi Theme - Design System Tokens
// Used for styling components across the admin portal

const ggwifiTheme = {
  colors: {
    gold: '#F2C94C',
    goldStrong: '#E0B335',
    black: '#0A0A0A',
    white: '#FFFFFF',
    neutral100: '#F6F6F6',
    neutral200: '#F0F0F0',
    neutral300: '#EDEDED',
    neutral500: '#9F9F9F',
    neutral700: '#4B4B4B',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #F2C94C 0%, #E0B335 100%)',
    card: 'linear-gradient(135deg, rgba(242, 201, 76, 0.05) 0%, rgba(224, 179, 53, 0.02) 100%)',
    gold: 'linear-gradient(135deg, #F2C94C 0%, #E0B335 100%)',
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
    md: '0 4px 12px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
    golden: '0 4px 16px rgba(242, 201, 76, 0.3)',
    card: '0 2px 8px rgba(0, 0, 0, 0.05)',
    navbar: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: {
      primary: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      secondary: '"Poppins", "Inter", sans-serif',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      md: '1rem',       // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.75rem', // 28px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
};

export default ggwifiTheme;
