import { createTheme } from '@mui/material/styles';
import { colors } from './colors';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[500],
      light: colors.primary[400],
      dark: colors.primary[600],
      contrastText: colors.text.dark,
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[400],
      dark: colors.secondary[600],
      contrastText: colors.text.inverse,
    },
    success: {
      main: colors.success[500],
      light: colors.success[400],
      dark: colors.success[600],
      contrastText: colors.text.primary,
    },
    warning: {
      main: colors.warning[500],
      light: colors.warning[400],
      dark: colors.warning[600],
      contrastText: colors.text.inverse,
    },
    error: {
      main: colors.error[500],
      light: colors.error[400],
      dark: colors.error[600],
      contrastText: colors.text.primary,
    },
    info: {
      main: colors.primary[500], // Use primary blue for info
      light: colors.primary[400],
      dark: colors.primary[600],
      contrastText: colors.text.primary,
    },
    background: {
      default: colors.background.primary,
      paper: colors.background.card,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      background: colors.gradients.goldenAccent,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      background: colors.gradients.blueAccent,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      color: colors.text.primary,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: colors.text.primary,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: colors.text.primary,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: colors.text.primary,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      color: colors.text.secondary,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: colors.text.tertiary,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: colors.gradients.backgroundPrimary,
          color: colors.text.primary,
          minHeight: '100vh',
          fontFamily: '"Montserrat", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: colors.background.secondary,
          },
          '&::-webkit-scrollbar-thumb': {
            background: colors.gradients.goldenAccent,
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: colors.gradients.blueAccent,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '1rem',
          padding: '12px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: colors.effects.shadow.colored,
          },
        },
        contained: {
          background: colors.gradients.primary,
          color: colors.text.primary,
          '&:hover': {
            background: colors.gradients.secondary,
            boxShadow: colors.effects.glow.primary,
          },
        },
        outlined: {
          borderColor: colors.primary[500],
          color: colors.primary[500],
          '&:hover': {
            background: colors.primary[500],
            color: colors.text.primary,
            boxShadow: colors.effects.glow.primary,
          },
        },
        text: {
          color: colors.text.primary,
          '&:hover': {
            background: colors.effects.glass.primary,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: colors.gradients.cardBackground,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors.effects.glass.primary}`,
          boxShadow: colors.effects.shadow.medium,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: colors.effects.shadow.heavy,
            background: colors.gradients.backgroundSecondary,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: colors.gradients.cardBackground,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors.effects.glass.primary}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: colors.effects.glass.primary,
            backdropFilter: 'blur(10px)',
            '& fieldset': {
              borderColor: colors.primary[500],
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: colors.secondary[500],
              boxShadow: colors.effects.glow.secondary,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.secondary[500],
              borderWidth: 3,
              boxShadow: colors.effects.glow.secondary,
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.text.secondary,
            '&.Mui-focused': {
              color: colors.secondary[500],
            },
          },
          '& .MuiInputBase-input': {
            color: colors.text.primary,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
          fontSize: '0.875rem',
          background: colors.gradients.primary,
          color: colors.text.primary,
          '&:hover': {
            background: colors.gradients.secondary,
            transform: 'scale(1.05)',
          },
        },
        colorPrimary: {
          background: colors.gradients.primary,
        },
        colorSecondary: {
          background: colors.gradients.secondary,
        },
        colorSuccess: {
          background: colors.gradients.success,
        },
        colorWarning: {
          background: colors.gradients.warning,
        },
        colorError: {
          background: colors.gradients.error,
        },
        colorInfo: {
          background: colors.gradients.primary,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          height: 8,
          background: colors.effects.glass.primary,
        },
        bar: {
          borderRadius: 10,
          background: colors.gradients.primary,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: colors.primary[500],
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: colors.gradients.modalBackground,
          backdropFilter: 'blur(25px)',
          borderRadius: 24,
          border: `1px solid ${colors.effects.glass.modal}`,
          boxShadow: colors.effects.shadow.heavy,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: colors.gradients.backgroundSecondary,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.effects.glass.primary}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: colors.gradients.backgroundSecondary,
          backdropFilter: 'blur(20px)',
          borderRight: `1px solid ${colors.effects.glass.primary}`,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: colors.effects.glass.primary,
            backdropFilter: 'blur(10px)',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: colors.effects.glass.secondary,
          },
          '&.Mui-selected': {
            background: colors.gradients.primary,
            '&:hover': {
              background: colors.gradients.secondary,
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: colors.effects.glass.primary,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.effects.glass.primary}`,
        },
        standardSuccess: {
          background: colors.gradients.success,
          color: colors.text.primary,
        },
        standardWarning: {
          background: colors.gradients.warning,
          color: colors.text.inverse,
        },
        standardError: {
          background: colors.gradients.error,
          color: colors.text.primary,
        },
        standardInfo: {
          background: colors.gradients.primary,
          color: colors.text.primary,
        },
      },
    },
  },
  custom: {
    colors,
    gradients: colors.gradients,
    effects: colors.effects,
    status: colors.status,
  },
});

export default theme; 