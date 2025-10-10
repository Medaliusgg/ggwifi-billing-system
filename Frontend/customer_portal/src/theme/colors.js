// GGNetworks Simplified 5-Color System
// Clean, consistent, and emotionally engaging

export const colors = {
  // 1. PRIMARY - Electric Blue (#3AB3F0)
  primary: {
    50: '#E8F4FD',
    100: '#C7E7FA',
    200: '#A3D8F7',
    300: '#7CC9F4',
    400: '#5BBEF2',
    500: '#3AB3F0', // Main brand blue
    600: '#34A2E0',
    700: '#2C8FCC',
    800: '#247DB8',
    900: '#1A5A8A',
  },

  // 2. SECONDARY - Vibrant Coral (#FF6B6B)
  secondary: {
    50: '#FFF0F0',
    100: '#FFE0E0',
    200: '#FFC7C7',
    300: '#FFA8A8',
    400: '#FF8A8A',
    500: '#FF6B6B', // Vibrant coral
    600: '#FF5252',
    700: '#FF3838',
    800: '#FF1E1E',
    900: '#E60000',
  },

  // 3. SUCCESS - Emerald Green (#1ABC9C)
  success: {
    50: '#E8F8F5',
    100: '#D1F2EB',
    200: '#A3E4D7',
    300: '#76D6C3',
    400: '#48C8AF',
    500: '#1ABC9C', // Emerald green
    600: '#17A689',
    700: '#138D75',
    800: '#0F6B5A',
    900: '#0B4A3F',
  },

  // 4. WARNING - Golden Amber (#F39C12)
  warning: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#F39C12', // Golden amber
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },

  // 5. ERROR - Deep Red (#E74C3C)
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#E74C3C', // Deep red
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },

  // Background Colors - Dark Theme
  background: {
    primary: '#0F1419', // Deep space blue
    secondary: '#1A2332', // Rich navy
    card: '#2C3E50', // Dark card background
    modal: '#1A2332', // Dark modal background
    surface: '#34495E', // Slate gray
  },

  // Text Colors - High Contrast
  text: {
    primary: '#FFFFFF', // Pure white
    secondary: '#E8E8E8', // Light gray
    tertiary: '#B0B0B0', // Medium gray
    muted: '#808080', // Dark gray
    inverse: '#0F1419', // Dark text for light backgrounds
  },

  // Gradients - Using only the 5 main colors
  gradients: {
    primary: 'linear-gradient(135deg, #3AB3F0 0%, #2C8FCC 100%)', // Blue gradient
    secondary: 'linear-gradient(135deg, #FF6B6B 0%, #E74C3C 100%)', // Coral to Red
    success: 'linear-gradient(135deg, #1ABC9C 0%, #17A689 100%)', // Green gradient
    warning: 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)', // Gold gradient
    error: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)', // Red gradient
    
    // Background gradients
    backgroundPrimary: 'linear-gradient(135deg, #0F1419 0%, #1A2332 50%, #2C3E50 100%)',
    backgroundSecondary: 'linear-gradient(135deg, #1A2332 0%, #2C3E50 50%, #34495E 100%)',
    cardBackground: 'linear-gradient(135deg, #2C3E50 0%, #34495E 50%, #3A4A5C 100%)',
    modalBackground: 'linear-gradient(135deg, #1A2332 0%, #2C3E50 50%, #34495E 100%)',
  },

  // Special Effects - Enhanced Visual Impact
  effects: {
    glow: {
      primary: '0 0 30px rgba(58, 179, 240, 0.4)',
      secondary: '0 0 30px rgba(255, 107, 107, 0.4)',
      success: '0 0 30px rgba(26, 188, 156, 0.4)',
      warning: '0 0 30px rgba(243, 156, 18, 0.4)',
      error: '0 0 30px rgba(231, 76, 60, 0.4)',
    },
    shadow: {
      light: '0 4px 12px rgba(0, 0, 0, 0.15)',
      medium: '0 8px 24px rgba(0, 0, 0, 0.2)',
      heavy: '0 12px 36px rgba(0, 0, 0, 0.25)',
      colored: '0 8px 32px rgba(58, 179, 240, 0.3)',
      glow: '0 0 20px rgba(58, 179, 240, 0.3)',
    },
    glass: {
      primary: 'rgba(44, 62, 80, 0.8)',
      secondary: 'rgba(26, 35, 50, 0.9)',
      modal: 'rgba(15, 20, 25, 0.95)',
    },
  },

  // Status Colors - Using the 5 main colors
  status: {
    online: '#1ABC9C', // Success green
    offline: '#E74C3C', // Error red
    pending: '#F39C12', // Warning gold
    processing: '#3AB3F0', // Primary blue
    success: '#1ABC9C', // Success green
    error: '#E74C3C', // Error red
    warning: '#F39C12', // Warning gold
    info: '#3AB3F0', // Primary blue
  },
};

// Color utility functions
export const colorUtils = {
  // Get contrast color for text
  getContrastColor: (backgroundColor) => {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  },

  // Generate gradient from two colors
  createGradient: (color1, color2, angle = '135deg') => {
    return `linear-gradient(${angle}, ${color1} 0%, ${color2} 100%)`;
  },

  // Add transparency to color
  addTransparency: (color, alpha = 0.5) => {
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  },
};

export default colors; 