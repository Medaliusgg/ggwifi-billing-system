// GG Wi-Fi Brand Color Palette - Official Brand Colors
// Based on the professional GG Wi-Fi logo analysis

export const GG_WIFI_COLORS = {
  // Primary Brand Colors
  PRIMARY: {
    GOLDEN_YELLOW: '#F5B700',    // Main brand accent - Energy, positivity, warmth
    BRIGHT_AMBER: '#FFCB00',     // Highlight variant - Hover effects, gradients
    DARK_GOLDEN: '#E6A500',      // Darker variant for depth
  },

  // Secondary Colors
  SECONDARY: {
    DEEP_BLACK: '#000000',       // Backgrounds, power, professionalism
    WARM_GRAY: '#2E2E2E',        // Supporting shade for text/UI
    LIGHT_GRAY: '#424242',       // Light gray for secondary elements
    DARK_GRAY: '#1A1A1A',        // Dark gray for depth
  },

  // Neutral Colors
  NEUTRAL: {
    PURE_WHITE: '#FFFFFF',       // Clarity, balance, backgrounds
    OFF_WHITE: '#FAFAFA',        // Soft backgrounds
    BORDER_GRAY: '#E0E0E0',      // Borders and dividers
  },

  // Semantic Colors (for UI states)
  SEMANTIC: {
    SUCCESS: '#4CAF50',          // Green for success states
    ERROR: '#F44336',            // Red for error states
    WARNING: '#FF9800',          // Orange for warnings
    INFO: '#2196F3',             // Blue for information
  },

  // Gradient Combinations
  GRADIENTS: {
    PRIMARY: 'linear-gradient(135deg, #F5B700 0%, #FFCB00 100%)',
    PRIMARY_REVERSE: 'linear-gradient(135deg, #FFCB00 0%, #F5B700 100%)',
    BACKGROUND: 'linear-gradient(135deg, #F5B700 0%, #000000 100%)',
    SUBTLE: 'linear-gradient(135deg, #F5B70015 0%, #FFCB0015 100%)',
  },

  // Shadow Colors
  SHADOWS: {
    PRIMARY: 'rgba(245, 183, 0, 0.3)',
    PRIMARY_LIGHT: 'rgba(245, 183, 0, 0.15)',
    PRIMARY_DARK: 'rgba(245, 183, 0, 0.5)',
    BLACK: 'rgba(0, 0, 0, 0.1)',
    BLACK_DARK: 'rgba(0, 0, 0, 0.2)',
  },

  // Text Colors
  TEXT: {
    PRIMARY: '#2E2E2E',          // Main text color
    SECONDARY: '#424242',        // Secondary text
    DISABLED: '#9E9E9E',         // Disabled text
    ON_PRIMARY: '#000000',       // Text on golden background
    ON_DARK: '#FFFFFF',          // Text on dark background
  }
};

// Brand Usage Guidelines
export const BRAND_USAGE = {
  // Logo Usage
  LOGO: {
    BACKGROUND: GG_WIFI_COLORS.SECONDARY.DEEP_BLACK,
    OUTER_CIRCLE: GG_WIFI_COLORS.PRIMARY.GOLDEN_YELLOW,
    TEXT_GG: GG_WIFI_COLORS.PRIMARY.GOLDEN_YELLOW,
    TEXT_WIFI: GG_WIFI_COLORS.NEUTRAL.PURE_WHITE,
  },

  // UI Element Usage
  UI: {
    PRIMARY_BUTTON: GG_WIFI_COLORS.GRADIENTS.PRIMARY,
    PRIMARY_BUTTON_HOVER: GG_WIFI_COLORS.GRADIENTS.PRIMARY_REVERSE,
    PRIMARY_BUTTON_TEXT: GG_WIFI_COLORS.TEXT.ON_PRIMARY,
    SECONDARY_BUTTON: GG_WIFI_COLORS.SECONDARY.WARM_GRAY,
    SECONDARY_BUTTON_TEXT: GG_WIFI_COLORS.NEUTRAL.PURE_WHITE,
    INPUT_FOCUS: GG_WIFI_COLORS.PRIMARY.GOLDEN_YELLOW,
    INPUT_HOVER: GG_WIFI_COLORS.PRIMARY.BRIGHT_AMBER,
    BORDER_ACCENT: GG_WIFI_COLORS.PRIMARY.GOLDEN_YELLOW,
  },

  // Dashboard KPI Colors
  DASHBOARD: {
    NEW_CUSTOMERS: GG_WIFI_COLORS.PRIMARY.GOLDEN_YELLOW,
    ACTIVE_CUSTOMERS: GG_WIFI_COLORS.SEMANTIC.SUCCESS,
    SALES: GG_WIFI_COLORS.SEMANTIC.WARNING,
    VOUCHERS: '#9C27B0', // Purple
    ONLINE_CUSTOMERS: GG_WIFI_COLORS.SEMANTIC.INFO,
    ROUTERS: '#795548', // Brown
    TRAFFIC: '#607D8B', // Blue Gray
    PACKAGES: '#FF5722', // Deep Orange
    LOCATION_A: GG_WIFI_COLORS.PRIMARY.GOLDEN_YELLOW,
    LOCATION_B: GG_WIFI_COLORS.PRIMARY.BRIGHT_AMBER,
    ALL_LOCATIONS: GG_WIFI_COLORS.SECONDARY.WARM_GRAY,
  },

  // Status Colors
  STATUS: {
    ONLINE: GG_WIFI_COLORS.SEMANTIC.SUCCESS,
    OFFLINE: GG_WIFI_COLORS.SEMANTIC.ERROR,
    PENDING: GG_WIFI_COLORS.SEMANTIC.WARNING,
    ACTIVE: GG_WIFI_COLORS.SEMANTIC.SUCCESS,
    INACTIVE: GG_WIFI_COLORS.SECONDARY.LIGHT_GRAY,
  }
};

// Brand Emotion Mapping
export const BRAND_EMOTIONS = {
  [GG_WIFI_COLORS.PRIMARY.GOLDEN_YELLOW]: {
    emotion: 'Energy, positivity, warmth, human connection',
    usage: 'Main brand accent, CTAs, highlights, icons',
    psychology: 'Evokes optimism, creativity, and approachability'
  },
  [GG_WIFI_COLORS.SECONDARY.DEEP_BLACK]: {
    emotion: 'Stability, strength, sophistication',
    usage: 'Backgrounds, power elements, professional contrast',
    psychology: 'Conveys reliability, authority, and premium quality'
  },
  [GG_WIFI_COLORS.NEUTRAL.PURE_WHITE]: {
    emotion: 'Simplicity, honesty, clarity',
    usage: 'Clean backgrounds, text areas, balance',
    psychology: 'Represents purity, simplicity, and clarity of service'
  },
  [GG_WIFI_COLORS.SECONDARY.WARM_GRAY]: {
    emotion: 'Professional, balanced, trustworthy',
    usage: 'Text, secondary elements, subtle backgrounds',
    psychology: 'Creates approachable professionalism without harshness'
  }
};

// Material-UI Theme Integration
export const MUI_THEME_COLORS = {
  palette: {
    primary: {
      main: GG_WIFI_COLORS.PRIMARY.GOLDEN_YELLOW,
      light: GG_WIFI_COLORS.PRIMARY.BRIGHT_AMBER,
      dark: GG_WIFI_COLORS.PRIMARY.DARK_GOLDEN,
      contrastText: GG_WIFI_COLORS.TEXT.ON_PRIMARY,
    },
    secondary: {
      main: GG_WIFI_COLORS.SECONDARY.WARM_GRAY,
      light: GG_WIFI_COLORS.SECONDARY.LIGHT_GRAY,
      dark: GG_WIFI_COLORS.SECONDARY.DARK_GRAY,
      contrastText: GG_WIFI_COLORS.NEUTRAL.PURE_WHITE,
    },
    success: {
      main: GG_WIFI_COLORS.SEMANTIC.SUCCESS,
    },
    error: {
      main: GG_WIFI_COLORS.SEMANTIC.ERROR,
    },
    warning: {
      main: GG_WIFI_COLORS.SEMANTIC.WARNING,
    },
    info: {
      main: GG_WIFI_COLORS.SEMANTIC.INFO,
    },
    background: {
      default: GG_WIFI_COLORS.NEUTRAL.PURE_WHITE,
      paper: GG_WIFI_COLORS.NEUTRAL.PURE_WHITE,
    },
    text: {
      primary: GG_WIFI_COLORS.TEXT.PRIMARY,
      secondary: GG_WIFI_COLORS.TEXT.SECONDARY,
    },
  }
};

// CSS Custom Properties for easy usage
export const CSS_CUSTOM_PROPERTIES = `
  :root {
    /* Primary Brand Colors */
    --gg-primary: ${GG_WIFI_COLORS.PRIMARY.GOLDEN_YELLOW};
    --gg-primary-light: ${GG_WIFI_COLORS.PRIMARY.BRIGHT_AMBER};
    --gg-primary-dark: ${GG_WIFI_COLORS.PRIMARY.DARK_GOLDEN};
    
    /* Secondary Colors */
    --gg-secondary: ${GG_WIFI_COLORS.SECONDARY.WARM_GRAY};
    --gg-black: ${GG_WIFI_COLORS.SECONDARY.DEEP_BLACK};
    --gg-white: ${GG_WIFI_COLORS.NEUTRAL.PURE_WHITE};
    
    /* Gradients */
    --gg-gradient-primary: ${GG_WIFI_COLORS.GRADIENTS.PRIMARY};
    --gg-gradient-background: ${GG_WIFI_COLORS.GRADIENTS.BACKGROUND};
    
    /* Shadows */
    --gg-shadow-primary: ${GG_WIFI_COLORS.SHADOWS.PRIMARY};
    --gg-shadow-light: ${GG_WIFI_COLORS.SHADOWS.PRIMARY_LIGHT};
    
    /* Text Colors */
    --gg-text-primary: ${GG_WIFI_COLORS.TEXT.PRIMARY};
    --gg-text-secondary: ${GG_WIFI_COLORS.TEXT.SECONDARY};
    --gg-text-on-primary: ${GG_WIFI_COLORS.TEXT.ON_PRIMARY};
  }
`;

export default GG_WIFI_COLORS;

