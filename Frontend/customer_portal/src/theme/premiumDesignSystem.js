// Premium Design System - ZenoPay-Style White Theme
// Customer Portal Design Tokens

export const premiumDesignSystem = {
  colors: {
    goldPrime: '#F5C400',        // Primary Golden Yellow
    goldDeep: '#D4A100',         // Gold Deep - Hover states
    goldLight: '#FFD700',        // Gold Light
    goldPale: '#FFE89C',         // Secondary Pale Golden Yellow
    carbonBlack: '#0B0B0B',      // Carbon Black
    jetBlack: '#111111',         // Jet Black
    darkGrey: '#2A2A2A',         // Dark Grey
    softWhite: '#FFFFFF',        // Soft White
    frostGrey: '#EDEDED',        // Frost Grey
    slateGrey: '#8D8D8D',        // Slate Grey
    goldGlass: 'rgba(245, 196, 0, 0.1)',  // Gold Glass effect
    goldGlow: 'rgba(245, 196, 0, 0.2)',  // Gold Glow effect
    // Text colors
    textHeading: '#0A0A0A',      // Headings Black
    textBody: '#1A1A1A',         // Body Text Black
    textLabel: '#505050',        // Labels/Descriptions Grey
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
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',  // For cards
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
    md: '0 4px 12px rgba(0, 0, 0, 0.1)',
    lg: '0 2px 16px rgba(0, 0, 0, 0.14)',
    card: '0 2px 8px rgba(0, 0, 0, 0.05)',
    xl: '0 8px 24px rgba(0, 0, 0, 0.12)',
    innerGold: 'inset 0 1px 2px rgba(255, 255, 255, 0.2)',
    goldGlow: '0 0 20px rgba(245, 196, 0, 0.5)',
  },
  transitions: {
    fast: '100ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #F5C400 0%, #D4A100 100%)',
    primaryHover: 'linear-gradient(135deg, #D4A100 0%, #F5C400 100%)',
    card: 'linear-gradient(145deg, #ffffff, #f9f9f9)',
  },
};

export default premiumDesignSystem;



