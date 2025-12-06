import { createTheme } from '@mui/material/styles';
import premiumDesignSystem from './premiumDesignSystem.js';
import designTokens from './designSystem.js';

// Safety check - ensure imports are valid
if (!premiumDesignSystem || !designTokens) {
  console.error('Theme initialization error: premiumDesignSystem or designTokens is undefined');
}

// Map premium design tokens to MUI theme
const colors = {
  primary: {
    500: premiumDesignSystem.colors.goldPrime,
    400: premiumDesignSystem.colors.goldLight,
    600: premiumDesignSystem.colors.goldDeep,
  },
  secondary: {
    500: premiumDesignSystem.colors.carbonBlack,
    400: premiumDesignSystem.colors.jetBlack,
    600: premiumDesignSystem.colors.darkGrey,
  },
  text: {
    primary: premiumDesignSystem.colors.carbonBlack,
    secondary: premiumDesignSystem.colors.slateGrey,
    tertiary: premiumDesignSystem.colors.frostGrey,
    dark: premiumDesignSystem.colors.carbonBlack,
    inverse: premiumDesignSystem.colors.softWhite,
  },
  background: {
    primary: premiumDesignSystem.colors.softWhite,
    secondary: premiumDesignSystem.colors.frostGrey,
    card: premiumDesignSystem.colors.softWhite,
  },
  success: {
    500: '#4CAF50',
    400: '#66BB6A',
    600: '#388E3C',
  },
  warning: {
    500: '#FF9800',
    400: '#FFB74D',
    600: '#F57C00',
  },
  error: {
    500: '#F44336',
    400: '#EF5350',
    600: '#D32F2F',
  },
  gradients: {
    primary: `linear-gradient(135deg, ${designTokens.colors.gold} 0%, ${designTokens.colors.goldStrong} 100%)`,
    secondary: `linear-gradient(135deg, ${designTokens.colors.goldStrong} 0%, ${designTokens.colors.gold} 100%)`,
    goldenAccent: `linear-gradient(135deg, ${designTokens.colors.gold} 0%, ${designTokens.colors.goldStrong} 100%)`,
    blueAccent: `linear-gradient(135deg, #2196F3 0%, #1976D2 100%)`,
    success: `linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)`,
    warning: `linear-gradient(135deg, #FF9800 0%, #F57C00 100%)`,
    error: `linear-gradient(135deg, #F44336 0%, #D32F2F 100%)`,
    cardBackground: designTokens.colors.white,
    backgroundPrimary: designTokens.colors.white,
    backgroundSecondary: designTokens.colors.neutral100,
    modalBackground: designTokens.colors.white,
  },
  effects: {
    glass: {
      primary: 'rgba(255, 255, 255, 0.9)',
      secondary: 'rgba(242, 201, 76, 0.1)',
      modal: 'rgba(255, 255, 255, 0.95)',
    },
    shadow: {
      medium: designTokens.shadows.card,
      heavy: designTokens.shadows.lg,
      colored: '0 8px 24px rgba(242, 201, 76, 0.3)',
    },
    glow: {
      primary: '0 0 20px rgba(242, 201, 76, 0.4)',
      secondary: '0 0 20px rgba(10, 10, 10, 0.2)',
    },
  },
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
};

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
    fontFamily: premiumDesignSystem.typography.fontFamily.primary,
    h1: {
      fontSize: premiumDesignSystem.typography.fontSize.h1,
      lineHeight: premiumDesignSystem.typography.lineHeight.h1,
      fontWeight: premiumDesignSystem.typography.fontWeight.bold,
      color: premiumDesignSystem.colors.carbonBlack,
    },
    h2: {
      fontSize: premiumDesignSystem.typography.fontSize.h2,
      lineHeight: premiumDesignSystem.typography.lineHeight.h2,
      fontWeight: premiumDesignSystem.typography.fontWeight.semibold,
      color: premiumDesignSystem.colors.carbonBlack,
    },
    h3: {
      fontSize: premiumDesignSystem.typography.fontSize.h3,
      lineHeight: premiumDesignSystem.typography.lineHeight.h3,
      fontWeight: premiumDesignSystem.typography.fontWeight.semibold,
      color: premiumDesignSystem.colors.carbonBlack,
    },
    body1: {
      fontSize: premiumDesignSystem.typography.fontSize.body,
      lineHeight: premiumDesignSystem.typography.lineHeight.body,
      fontWeight: premiumDesignSystem.typography.fontWeight.regular,
      color: premiumDesignSystem.colors.carbonBlack,
    },
    body2: {
      fontSize: premiumDesignSystem.typography.fontSize.bodySmall,
      lineHeight: premiumDesignSystem.typography.lineHeight.small,
      fontWeight: premiumDesignSystem.typography.fontWeight.regular,
      color: premiumDesignSystem.colors.slateGrey,
    },
    button: {
      fontWeight: premiumDesignSystem.typography.fontWeight.semibold,
      textTransform: 'none',
      fontSize: premiumDesignSystem.typography.fontSize.body,
    },
  },
  shape: {
    borderRadius: parseInt(premiumDesignSystem.borderRadius.lg),
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
          background: designTokens.colors.white,
          color: designTokens.colors.black,
          minHeight: '100vh',
          fontFamily: designTokens.typography.fontFamily.primary,
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
          borderRadius: parseInt(designTokens.borderRadius.medium),
          fontWeight: designTokens.typography.fontWeight.semibold,
          textTransform: 'none',
          fontSize: designTokens.typography.fontSize.body,
          padding: '12px 20px',
          transition: 'all 0.2s ease',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: 'none',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${premiumDesignSystem.colors.goldPrime} 0%, ${premiumDesignSystem.colors.goldDeep} 100%)`,
          color: premiumDesignSystem.colors.carbonBlack,
          boxShadow: `0 2px 8px rgba(245, 196, 0, 0.3), ${premiumDesignSystem.shadows.innerGold}`,
          '&:hover': {
            background: `linear-gradient(135deg, ${premiumDesignSystem.colors.goldDeep} 0%, ${premiumDesignSystem.colors.goldPrime} 100%)`,
            boxShadow: `0 4px 16px rgba(245, 196, 0, 0.4), ${premiumDesignSystem.shadows.innerGold}`,
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: premiumDesignSystem.colors.frostGrey,
          borderWidth: '2px',
          color: premiumDesignSystem.colors.carbonBlack,
          '&:hover': {
            borderColor: premiumDesignSystem.colors.goldPrime,
            backgroundColor: premiumDesignSystem.colors.goldGlass,
            boxShadow: premiumDesignSystem.shadows.goldGlow,
          },
        },
        text: {
          color: designTokens.colors.black,
          '&:hover': {
            background: 'rgba(242, 201, 76, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: parseInt(premiumDesignSystem.borderRadius['2xl']),
          background: premiumDesignSystem.colors.softWhite,
          border: `1px solid ${premiumDesignSystem.colors.frostGrey}`,
          boxShadow: premiumDesignSystem.shadows.lg,
          position: 'relative',
          transition: premiumDesignSystem.transitions.normal,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${premiumDesignSystem.colors.goldPrime} 0%, ${premiumDesignSystem.colors.goldDeep} 100%)`,
            borderRadius: `${premiumDesignSystem.borderRadius['2xl']} ${premiumDesignSystem.borderRadius['2xl']} 0 0`,
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: premiumDesignSystem.shadows.xl,
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
            borderRadius: parseInt(designTokens.borderRadius.medium),
            background: designTokens.colors.white,
            '& fieldset': {
              borderColor: designTokens.colors.neutral300,
              borderWidth: 1,
            },
            '&:hover fieldset': {
              borderColor: designTokens.colors.gold,
            },
            '&.Mui-focused fieldset': {
              borderColor: premiumDesignSystem.colors.goldPrime,
              borderWidth: '1px',
              boxShadow: `0 0 0 2px ${premiumDesignSystem.colors.goldGlow}`,
            },
            '& .MuiOutlinedInput-input': {
              fontSize: designTokens.typography.fontSize.body,
              color: designTokens.colors.black,
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: premiumDesignSystem.typography.fontSize.bodySmall,
            color: premiumDesignSystem.colors.slateGrey,
            '&.Mui-focused': {
              color: premiumDesignSystem.colors.goldPrime,
            },
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