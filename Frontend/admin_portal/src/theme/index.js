import { createTheme } from '@mui/material/styles';

// GG Wi-Fi Brand Colors - Official Brand Palette
const primaryColors = {
  main: '#FFC72C', // Golden Yellow - Primary Brand Color (Call-to-action buttons, key highlights)
  light: '#FFD700', // Bright Golden Yellow - Highlight Variant
  dark: '#E6B800', // Darker Golden Yellow
};

const secondaryColors = {
  main: '#0072CE', // Blue - Secondary Accent Color (Subtle accents, links, minor highlights)
  light: '#4A9EFF', // Light Blue
  dark: '#0056A3', // Dark Blue
};

const accentColors = {
  main: '#000000', // Black - Main text, headings, overlays
  light: '#333333', // Dark Gray
  dark: '#000000', // Pure Black
};

const successColors = {
  main: '#4CAF50', // Green
  light: '#81C784',
  dark: '#388E3C',
};

const errorColors = {
  main: '#F44336', // Red
  light: '#E57373',
  dark: '#D32F2F',
};

const warningColors = {
  main: '#FF9800', // Orange
  light: '#FFB74D',
  dark: '#F57C00',
};

const infoColors = {
  main: '#2196F3', // Blue
  light: '#64B5F6',
  dark: '#1976D2',
};

const greyColors = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
};

// Create the GGNetworks theme
const theme = createTheme({
  palette: {
    primary: primaryColors,
    secondary: secondaryColors,
    success: successColors,
    error: errorColors,
    warning: warningColors,
    info: infoColors,
    grey: greyColors,
    background: {
      default: '#FFFFFF', // Pure White - Clean layout areas
      paper: '#FFFFFF', // Pure White - Clean layout areas
    },
    text: {
      primary: '#000000', // Black - Main text, headings, overlays
      secondary: '#333333', // Dark Gray for secondary text
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.005em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '-0.005em',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '-0.005em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            background: `linear-gradient(135deg, ${primaryColors.main} 0%, ${primaryColors.light} 100%)`,
            color: '#000000', // Black text on golden background
            fontWeight: 700,
            '&:hover': {
              background: `linear-gradient(135deg, ${primaryColors.light} 0%, ${primaryColors.main} 100%)`,
              boxShadow: `0 8px 32px ${primaryColors.main}40`,
            },
          },
          '&.MuiButton-containedSecondary': {
            background: `linear-gradient(135deg, ${secondaryColors.main} 0%, ${secondaryColors.dark} 100%)`,
            color: '#FFFFFF', // White text on gray background
            '&:hover': {
              background: `linear-gradient(135deg, ${secondaryColors.dark} 0%, ${secondaryColors.main} 100%)`,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F5B700', // GG Wi-Fi Golden Yellow focus
                borderWidth: '2px',
              },
            },
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFCB00', // Bright Amber hover
              },
            },
            '& .MuiOutlinedInput-input': {
              caretColor: '#F5B700 !important', // GG Wi-Fi golden cursor
              '&::selection': {
                backgroundColor: '#F5B70040 !important', // Golden selection
              },
            },
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              color: '#F5B700', // GG Wi-Fi Golden Yellow label focus
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#FFFFFF', // Pure White background
          color: '#2E2E2E', // Warm Gray text
          borderBottom: '2px solid #F5B700', // GG Wi-Fi Golden Yellow accent
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#FFFFFF', // Pure White sidebar
          color: '#2E2E2E', // Warm Gray text
          borderRight: '2px solid #F5B700', // GG Wi-Fi Golden Yellow accent
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme; 