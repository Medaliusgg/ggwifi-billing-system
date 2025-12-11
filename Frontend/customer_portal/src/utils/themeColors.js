/**
 * GG Color Theme Helper
 * Centralized color definitions using theme palette
 * DO NOT use hardcoded colors - always use theme colors
 */

export const getThemeColors = (theme) => ({
  // Backgrounds
  background: theme.palette.background.default,
  backgroundPaper: theme.palette.background.paper,
  backgroundLight: '#F5F9FC', // Light background - can be added to theme if needed
  
  // Text
  textPrimary: theme.palette.text.primary,
  textSecondary: theme.palette.text.secondary,
  
  // Brand Colors (from GG theme)
  primary: theme.palette.primary.main,        // Gold #F2C94C
  primaryDark: theme.palette.primary.dark,     // Dark Gold #E0B335
  secondary: theme.palette.secondary.main,     // Black #0A0A0A
  
  // Action Colors
  info: theme.palette.info.main,              // Sky Blue #48C7F2
  infoDark: theme.palette.info.dark,          // Dark Sky Blue #38B2D0
  warning: theme.palette.warning.main,         // Orange #F48C06
  warningDark: theme.palette.warning.dark,    // Dark Orange #D97706
  success: theme.palette.success.main,        // Green #48BB78
  successDark: theme.palette.success.dark,     // Dark Green #38A169
  error: theme.palette.error.main,            // Red #F44336
  
  // Light variants
  infoLight: theme.palette.info.light,
  warningLight: theme.palette.warning.light,
  successLight: theme.palette.success.light,
  errorLight: theme.palette.error.light,
  
  // Borders
  divider: theme.palette.divider,
});

export default getThemeColors;
