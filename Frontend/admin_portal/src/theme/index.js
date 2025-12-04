import { createTheme } from '@mui/material/styles';

const palette = {
  gold: '#F2C94C',
  goldStrong: '#E0B335',
  black: '#0A0A0A',
  white: '#FFFFFF',
  neutral100: '#F6F6F6',
  neutral200: '#F0F0F0',
  neutral300: '#E8E8E8',
  neutral500: '#9F9F9F',
  neutral700: '#4B4B4B',
};

// Create the GGNetworks theme
const theme = createTheme({
  palette: {
    primary: {
      main: palette.gold,
      light: '#F8DEA1',
      dark: palette.goldStrong,
      contrastText: palette.black,
    },
    secondary: {
      main: palette.black,
      contrastText: palette.white,
    },
    success: {
      main: '#2E7D32',
      contrastText: palette.white,
    },
    error: {
      main: '#C62828',
      contrastText: palette.white,
    },
    warning: {
      main: '#E65100',
      contrastText: palette.white,
    },
    info: {
      main: '#424242',
      contrastText: palette.white,
    },
    grey: {
      50: palette.white,
      100: palette.neutral100,
      200: palette.neutral200,
      300: palette.neutral300,
      500: palette.neutral500,
      700: palette.neutral700,
      900: palette.black,
    },
    background: {
      default: palette.neutral100,
      paper: palette.white,
    },
    text: {
      primary: palette.black,
      secondary: palette.neutral700,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.45,
    },
    h6: {
      fontSize: '0.95rem',
      fontWeight: 600,
      lineHeight: 1.45,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.9rem',
      lineHeight: 1.55,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 20px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(10, 10, 10, 0.12)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            backgroundColor: palette.gold,
            color: palette.black,
            '&:hover': {
              backgroundColor: palette.goldStrong,
            },
          },
          '&.MuiButton-containedSecondary': {
            backgroundColor: palette.black,
            color: palette.white,
            '&:hover': {
              backgroundColor: '#1F1F1F',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 6px 18px rgba(10, 10, 10, 0.06)',
          border: `1px solid ${palette.neutral300}`,
          '&:hover': {
            boxShadow: '0 14px 32px rgba(10, 10, 10, 0.08)',
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
            borderRadius: 12,
            backgroundColor: palette.white,
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: palette.gold,
                borderWidth: 2,
              },
            },
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: palette.gold,
              },
            },
            '& .MuiOutlinedInput-input': {
              caretColor: palette.gold,
            },
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              color: palette.goldStrong,
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
          background: palette.white,
          color: palette.black,
          borderBottom: `1px solid ${palette.neutral300}`,
          boxShadow: '0 8px 20px rgba(10, 10, 10, 0.06)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: palette.white,
          color: palette.black,
          borderRight: `1px solid ${palette.neutral300}`,
          boxShadow: '4px 0 12px rgba(10, 10, 10, 0.05)',
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