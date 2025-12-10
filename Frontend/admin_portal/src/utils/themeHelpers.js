/**
 * Theme Helper Utilities
 * Consistent styling helpers using customer portal theme
 */

export const themeColors = {
  gold: '#F2C94C',
  goldStrong: '#E0B335',
  goldLight: '#F8D97A',
  black: '#0A0A0A',
  white: '#FFFFFF',
  success: '#10B981',
  successLight: '#ECFDF5',
  info: '#3A8DFF',
  infoLight: '#EAF4FF',
  warning: '#FF8A3D',
  warningLight: '#FFF3E6',
  error: '#F44336',
  errorLight: '#FFEBEE',
  neutral200: '#EEEEEE',
  neutral600: '#666666',
};

export const cardStyles = {
  root: {
    backgroundColor: themeColors.white,
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    border: `1px solid ${themeColors.neutral200}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
    },
  },
  withAccent: (color = themeColors.gold) => ({
    ...cardStyles.root,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      backgroundColor: color,
    },
  }),
};

export const buttonStyles = {
  primary: {
    backgroundColor: themeColors.gold,
    color: themeColors.black,
    fontWeight: 600,
    '&:hover': {
      backgroundColor: themeColors.goldStrong,
      boxShadow: '0 4px 12px rgba(242, 201, 76, 0.3)',
    },
  },
  secondary: {
    backgroundColor: themeColors.black,
    color: themeColors.white,
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#1A1A1A',
      boxShadow: '0 4px 12px rgba(10, 10, 10, 0.2)',
    },
  },
  outlined: {
    borderColor: themeColors.gold,
    color: themeColors.black,
    '&:hover': {
      borderColor: themeColors.goldStrong,
      backgroundColor: 'rgba(242, 201, 76, 0.1)',
    },
  },
};

export const chipStyles = {
  success: {
    backgroundColor: themeColors.successLight,
    color: themeColors.success,
    border: `1px solid ${themeColors.success}`,
    fontWeight: 600,
  },
  error: {
    backgroundColor: themeColors.errorLight,
    color: themeColors.error,
    border: `1px solid ${themeColors.error}`,
    fontWeight: 600,
  },
  info: {
    backgroundColor: themeColors.infoLight,
    color: themeColors.info,
    border: `1px solid ${themeColors.info}`,
    fontWeight: 600,
  },
  warning: {
    backgroundColor: themeColors.warningLight,
    color: themeColors.warning,
    border: `1px solid ${themeColors.warning}`,
    fontWeight: 600,
  },
  primary: {
    backgroundColor: themeColors.gold,
    color: themeColors.black,
    fontWeight: 600,
  },
};

export const statCardStyles = {
  container: {
    backgroundColor: themeColors.white,
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    border: `1px solid ${themeColors.neutral200}`,
    position: 'relative',
    overflow: 'hidden',
  },
  accentBar: (color = themeColors.gold) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: color,
  }),
};

export const tabStyles = {
  root: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    minHeight: 48,
    color: themeColors.neutral600,
    '&.Mui-selected': {
      color: themeColors.gold,
    },
  },
  indicator: {
    backgroundColor: themeColors.gold,
    height: 3,
  },
};

export default {
  themeColors,
  cardStyles,
  buttonStyles,
  chipStyles,
  statCardStyles,
  tabStyles,
};
