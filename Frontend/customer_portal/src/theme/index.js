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
    mode: 'dark',
    primary: {
      main: colors.primary[500],
      light: colors.primary[400],
      dark: colors.primary[600],
      contrastText: colors.text.primary,
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[400],
      dark: colors.secondary[600],
      contrastText: colors.text.primary,
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
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      background: colors.gradients.primary,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      background: colors.gradients.secondary,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      background: colors.gradients.success,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
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
    colors.effects.shadow.light,
    colors.effects.shadow.medium,
    colors.effects.shadow.heavy,
    colors.effects.shadow.colored,
    colors.effects.shadow.glow,
    ...Array(19).fill('none'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: colors.gradients.backgroundPrimary,
          color: colors.text.primary,
          minHeight: '100vh',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: colors.background.secondary,
          },
          '&::-webkit-scrollbar-thumb': {
            background: colors.gradients.primary,
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: colors.gradients.secondary,
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