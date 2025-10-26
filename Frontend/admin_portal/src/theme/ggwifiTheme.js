// GG Wi-Fi Brand Theme System
// "The Signal That Cares" - Premium yet caring wireless internet provider

export const ggwifiTheme = {
  // Brand Colors - Official GG Wi-Fi Brand Palette
  colors: {
    primary: '#FFC72C',        // Golden Yellow - Call-to-action buttons, key highlights
    primaryHover: '#E6B800',   // Darker Golden Yellow - hover effects
    secondary: '#0072CE',      // Blue - Secondary Accent Color (Subtle accents, links, minor highlights)
    contrast: '#FFFFFF',       // White - Backgrounds, text overlays, clean layout areas
    neutral: '#000000',        // Black - Main text, headings, overlays, icons
    success: '#4CAF50',        // Green - success states
    error: '#F44336',          // Red - error states
    warning: '#FF9800',        // Orange - warning states
    info: '#0072CE',           // Blue - info states (using brand blue)
  },

  // Typography
  typography: {
    fontFamily: {
      primary: '"Poppins", "Inter", sans-serif',
      secondary: '"Inter", sans-serif',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },

  // Border Radius
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    full: '50px',    // 50px for buttons
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    golden: '0 4px 20px rgba(245, 183, 0, 0.3)',
    goldenHover: '0 8px 30px rgba(245, 183, 0, 0.4)',
  },

  // Transitions
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #FFC72C 0%, #FFD700 100%)',
    primaryHover: 'linear-gradient(135deg, #E6B800 0%, #FFC72C 100%)',
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)',
    card: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  },

  // Brand Elements
  brand: {
    name: 'GG Wi-Fi',
    tagline: 'The Signal That Cares',
    logo: {
      text: 'GG',
      subtext: 'Wi-Fi',
    },
  },
};

// CSS-in-JS styles for common components
export const componentStyles = {
  // Button Styles
  primaryButton: {
    background: ggwifiTheme.gradients.primary,
    color: ggwifiTheme.colors.neutral, // Black text on golden yellow
    border: 'none',
    borderRadius: ggwifiTheme.borderRadius.full,
    padding: `${ggwifiTheme.spacing.md} ${ggwifiTheme.spacing.xl}`,
    fontSize: ggwifiTheme.typography.fontSize.base,
    fontWeight: ggwifiTheme.typography.fontWeight.semibold,
    cursor: 'pointer',
    transition: ggwifiTheme.transitions.normal,
    boxShadow: ggwifiTheme.shadows.golden,
    '&:hover': {
      background: ggwifiTheme.gradients.primaryHover,
      boxShadow: ggwifiTheme.shadows.goldenHover,
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },

  // Card Styles
  card: {
    background: ggwifiTheme.colors.contrast,
    borderRadius: ggwifiTheme.borderRadius.lg,
    boxShadow: ggwifiTheme.shadows.lg,
    padding: ggwifiTheme.spacing.xl,
    border: `1px solid rgba(245, 183, 0, 0.1)`,
    transition: ggwifiTheme.transitions.normal,
    '&:hover': {
      boxShadow: ggwifiTheme.shadows.golden,
      transform: 'translateY(-4px)',
    },
  },

  // Input Styles
  input: {
    border: `2px solid ${ggwifiTheme.colors.neutral}`,
    borderRadius: ggwifiTheme.borderRadius.md,
    padding: `${ggwifiTheme.spacing.md} ${ggwifiTheme.spacing.lg}`,
    fontSize: ggwifiTheme.typography.fontSize.base,
    fontFamily: ggwifiTheme.typography.fontFamily.primary,
    transition: ggwifiTheme.transitions.normal,
    backgroundColor: ggwifiTheme.colors.contrast,
    '&:focus': {
      outline: 'none',
      borderColor: ggwifiTheme.colors.primary,
      boxShadow: `0 0 0 3px rgba(245, 183, 0, 0.1)`,
    },
    '&::placeholder': {
      color: ggwifiTheme.colors.neutral,
    },
  },

  // Header Styles
  header: {
    background: ggwifiTheme.colors.contrast, // White background
    color: ggwifiTheme.colors.neutral, // Black text
    padding: `${ggwifiTheme.spacing.md} ${ggwifiTheme.spacing.xl}`,
    boxShadow: ggwifiTheme.shadows.md,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottom: `1px solid #E0E0E0`, // Light border
  },

  // Navigation Link Styles
  navLink: {
    color: ggwifiTheme.colors.neutral, // Black text
    textDecoration: 'none',
    padding: `${ggwifiTheme.spacing.sm} ${ggwifiTheme.spacing.md}`,
    borderRadius: ggwifiTheme.borderRadius.md,
    transition: ggwifiTheme.transitions.normal,
    position: 'relative',
    '&:hover': {
      color: ggwifiTheme.colors.primary, // Golden yellow on hover
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: ggwifiTheme.colors.primary,
        borderRadius: '1px',
      },
    },
  },
};

export default ggwifiTheme;
