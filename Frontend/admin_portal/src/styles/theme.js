import { createTheme } from '@mui/material/styles';

// GGWIFI Brand Colors - Official Brand Palette
const ggColors = {
  gold: '#FFC72C', // Golden Yellow - Primary Brand Color
  goldDark: '#E6B800', // Darker Golden Yellow
  goldLight: '#FFD700', // Bright Golden Yellow
  black: '#000000', // Black - Main text, headings, overlays
  blue: '#0072CE', // Blue - Secondary Accent Color
  white: '#FFFFFF', // White - Backgrounds, clean layout areas
  textPrimary: '#000000', // Black - Main text
  textSecondary: '#333333', // Dark Gray - Secondary text
  textMuted: '#666666', // Medium Gray - Muted text
};

// Create MUI theme with GGWIFI branding
export const ggTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: ggColors.gold,
      dark: ggColors.goldDark,
      light: ggColors.goldLight,
      contrastText: ggColors.black,
    },
    secondary: {
      main: ggColors.blue,
      dark: '#0056A3',
      light: '#4A9EFF',
      contrastText: ggColors.white,
    },
    background: {
      default: ggColors.white,
      paper: ggColors.white,
    },
    text: {
      primary: ggColors.textPrimary,
      secondary: ggColors.textSecondary,
      disabled: ggColors.textMuted,
    },
    divider: '#E0E0E0',
    action: {
      hover: `${ggColors.gold}10`,
      selected: `${ggColors.gold}20`,
      disabled: ggColors.textMuted,
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", system-ui, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: ggColors.gold,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: ggColors.textPrimary,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: ggColors.textPrimary,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: ggColors.textPrimary,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: ggColors.textPrimary,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: ggColors.textPrimary,
    },
    body1: {
      fontSize: '1rem',
      color: ggColors.textPrimary,
    },
    body2: {
      fontSize: '0.875rem',
      color: ggColors.textSecondary,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: `0 0 15px ${ggColors.gold}30`,
          '&:hover': {
            boxShadow: `0 0 25px ${ggColors.gold}50`,
          },
        },
        contained: {
          backgroundColor: ggColors.gold,
          color: ggColors.black,
          '&:hover': {
            backgroundColor: ggColors.goldDark,
          },
        },
        outlined: {
          borderColor: ggColors.gold,
          color: ggColors.gold,
          '&:hover': {
            borderColor: ggColors.goldLight,
            backgroundColor: `${ggColors.gold}10`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: ggColors.charcoal,
          border: `1px solid ${ggColors.gold}20`,
          borderRadius: 16,
          '&:hover': {
            borderColor: `${ggColors.gold}40`,
            boxShadow: `0 0 20px ${ggColors.gold}20`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: ggColors.darkGray,
            borderRadius: 12,
            '& fieldset': {
              borderColor: `${ggColors.gold}30`,
            },
            '&:hover fieldset': {
              borderColor: `${ggColors.gold}50`,
            },
            '&.Mui-focused fieldset': {
              borderColor: ggColors.gold,
              boxShadow: `0 0 0 2px ${ggColors.gold}20`,
            },
          },
          '& .MuiInputLabel-root': {
            color: ggColors.textSecondary,
            '&.Mui-focused': {
              color: ggColors.gold,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: ggColors.charcoal,
          borderBottom: `1px solid ${ggColors.gold}20`,
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: ggColors.charcoal,
          borderRight: `1px solid ${ggColors.gold}20`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          '&:hover': {
            backgroundColor: `${ggColors.gold}10`,
          },
          '&.Mui-selected': {
            backgroundColor: `${ggColors.gold}20`,
            '&:hover': {
              backgroundColor: `${ggColors.gold}30`,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: `${ggColors.gold}20`,
          color: ggColors.gold,
          border: `1px solid ${ggColors.gold}30`,
          '&:hover': {
            backgroundColor: `${ggColors.gold}30`,
          },
        },
      },
    },
  },
});

export default ggTheme;
