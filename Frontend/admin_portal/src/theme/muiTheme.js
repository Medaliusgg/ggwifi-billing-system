// MUI Theme Configuration - GGNetworks Premium Design System
import { createTheme } from '@mui/material/styles';
import premiumDesignSystem from './premiumDesignSystem.js';
import designTokens from './designSystem.js';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: premiumDesignSystem.colors.goldPrime,
      dark: premiumDesignSystem.colors.goldDeep,
      light: premiumDesignSystem.colors.goldLight,
      contrastText: premiumDesignSystem.colors.carbonBlack,
    },
    secondary: {
      main: premiumDesignSystem.colors.carbonBlack,
      contrastText: premiumDesignSystem.colors.softWhite,
    },
    background: {
      default: premiumDesignSystem.colors.softWhite,
      paper: premiumDesignSystem.colors.softWhite,
    },
    text: {
      primary: premiumDesignSystem.colors.carbonBlack,
      secondary: premiumDesignSystem.colors.slateGrey,
    },
    divider: designTokens.colors.neutral300,
    success: {
      main: designTokens.colors.success,
    },
    error: {
      main: designTokens.colors.error,
    },
    warning: {
      main: designTokens.colors.warning,
    },
    info: {
      main: designTokens.colors.info,
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
    },
    body2: {
      fontSize: premiumDesignSystem.typography.fontSize.bodySmall,
      lineHeight: premiumDesignSystem.typography.lineHeight.small,
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
    designTokens.shadows.sm,
    designTokens.shadows.md,
    designTokens.shadows.lg,
    designTokens.shadows.xl,
    designTokens.shadows.navbar,
    designTokens.shadows.card,
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: parseInt(premiumDesignSystem.borderRadius.lg),
          padding: '12px 20px',
          fontWeight: premiumDesignSystem.typography.fontWeight.semibold,
          textTransform: 'none',
          boxShadow: 'none',
          transition: premiumDesignSystem?.transitions?.normal || '200ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${premiumDesignSystem.colors.goldPrime} 0%, ${premiumDesignSystem.colors.goldDeep} 100%)`,
          color: premiumDesignSystem.colors.carbonBlack,
          boxShadow: `0 2px 8px rgba(245, 196, 0, 0.3), ${premiumDesignSystem?.shadows?.innerGold || 'inset 0 1px 2px rgba(255, 255, 255, 0.2)'}`,
          '&:hover': {
            background: `linear-gradient(135deg, ${premiumDesignSystem.colors.goldDeep} 0%, ${premiumDesignSystem.colors.goldPrime} 100%)`,
            boxShadow: `0 4px 16px rgba(245, 196, 0, 0.4), ${premiumDesignSystem?.shadows?.innerGold || 'inset 0 1px 2px rgba(255, 255, 255, 0.2)'}`,
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: premiumDesignSystem.colors.frostGrey,
          borderWidth: '2px',
          color: premiumDesignSystem.colors.carbonBlack,
          '&:hover': {
            borderColor: premiumDesignSystem.colors.goldPrime,
            backgroundColor: premiumDesignSystem?.colors?.goldPale || '#FFE89C',
            boxShadow: premiumDesignSystem?.shadows?.goldGlow || '0 0 20px rgba(245, 196, 0, 0.5)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: parseInt(premiumDesignSystem.borderRadius['2xl']),
          boxShadow: premiumDesignSystem.shadows.lg,
          border: `1px solid ${premiumDesignSystem.colors.frostGrey}`,
          position: 'relative',
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
            boxShadow: premiumDesignSystem?.shadows?.xl || '0 8px 24px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
          transition: premiumDesignSystem?.transitions?.normal || '200ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: premiumDesignSystem?.borderRadius?.md || '12px',
            backgroundColor: premiumDesignSystem?.colors?.softWhite || '#FFFFFF',
            '& fieldset': {
              borderColor: designTokens.colors.neutral300,
            },
            '&:hover fieldset': {
              borderColor: premiumDesignSystem?.colors?.goldPrime || '#F5C400',
            },
            '&.Mui-focused fieldset': {
              borderColor: premiumDesignSystem?.colors?.goldPrime || '#F5C400',
              borderWidth: '1px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: premiumDesignSystem?.typography?.fontSize?.bodySmall || '0.75rem',
            color: premiumDesignSystem?.colors?.slateGrey || '#8D8D8D',
            '&.Mui-focused': {
              color: premiumDesignSystem?.colors?.goldPrime || '#F5C400',
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: premiumDesignSystem.colors.carbonBlack,
          color: premiumDesignSystem.colors.softWhite,
          width: premiumDesignSystem?.layout?.sidebarWidth || '260px',
          boxShadow: premiumDesignSystem?.shadows?.xl || '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: premiumDesignSystem.colors.softWhite,
          color: premiumDesignSystem.colors.carbonBlack,
          boxShadow: premiumDesignSystem.shadows.sm,
          height: premiumDesignSystem?.layout?.topbarHeight || '64px',
          borderBottom: `1px solid ${premiumDesignSystem.colors.frostGrey}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: premiumDesignSystem?.borderRadius?.sm || '8px',
          marginBottom: premiumDesignSystem?.spacing?.xs || '4px',
          '&:hover': {
            backgroundColor: 'rgba(242, 201, 76, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: premiumDesignSystem.colors.goldPrime,
            color: premiumDesignSystem.colors.carbonBlack,
            borderLeft: `3px solid ${premiumDesignSystem.colors.carbonBlack}`,
            fontWeight: premiumDesignSystem.typography.fontWeight.semibold,
            boxShadow: premiumDesignSystem?.shadows?.goldGlow || '0 0 20px rgba(245, 196, 0, 0.5)',
            '&:hover': {
              backgroundColor: premiumDesignSystem.colors.goldDeep,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.sm,
          fontWeight: premiumDesignSystem?.typography?.fontWeight?.medium || 500,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: designTokens.colors.neutral100,
          '& .MuiTableCell-head': {
            fontWeight: premiumDesignSystem?.typography?.fontWeight?.semibold || 600,
            fontSize: premiumDesignSystem?.typography?.fontSize?.body || '0.875rem',
            color: premiumDesignSystem?.colors?.carbonBlack || '#0B0B0B',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(242, 201, 76, 0.06)',
          },
        },
      },
    },
  },
});

export default muiTheme;
