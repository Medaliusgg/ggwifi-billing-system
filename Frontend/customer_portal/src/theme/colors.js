// GG Wi-Fi Brand Color System
// Golden Yellow, Black, White, Blue Accents

export const colors = {
  // 1. PRIMARY - Golden Yellow (#FFC72C)
  primary: {
    50: '#FFFDF7',
    100: '#FFF8E1',
    200: '#FFF3C4',
    300: '#FFEC9E',
    400: '#FFE578',
    500: '#FFC72C', // Main brand golden yellow
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },

  // 2. SECONDARY - Blue Accent (#0072CE)
  secondary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#0072CE', // Blue accent
    600: '#1976D2',
    700: '#1565C0',
    800: '#0D47A1',
    900: '#0A3D91',
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

  // 4. WARNING - Golden Yellow (#FFC72C)
  warning: {
    50: '#FFFDF7',
    100: '#FFF8E1',
    200: '#FFF3C4',
    300: '#FFEC9E',
    400: '#FFE578',
    500: '#FFC72C', // Golden yellow for warnings
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

  // Background Colors - Light Theme with GG Wi-Fi Branding
  background: {
    primary: '#FFFFFF', // Pure white
    secondary: '#F8F9FA', // Light gray
    card: '#FFFFFF', // White card background
    modal: '#FFFFFF', // White modal background
    surface: '#F5F5F5', // Light surface
    dark: '#000000', // Black for contrast
  },

  // Text Colors - GG Wi-Fi Brand Colors
  text: {
    primary: '#000000', // Black for main text
    secondary: '#333333', // Dark gray
    tertiary: '#666666', // Medium gray
    muted: '#999999', // Light gray
    inverse: '#FFFFFF', // White text for dark backgrounds
    golden: '#FFC72C', // Golden yellow text
    blue: '#0072CE', // Blue accent text
  },

  // Gradients - GG Wi-Fi Brand Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)', // Golden yellow gradient
    secondary: 'linear-gradient(135deg, #0072CE 0%, #0056A3 100%)', // Blue gradient
    success: 'linear-gradient(135deg, #1ABC9C 0%, #17A689 100%)', // Green gradient
    warning: 'linear-gradient(135deg, #FFC72C 0%, #FFA000 100%)', // Golden gradient
    error: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)', // Red gradient
    
    // Background gradients - Light theme
    backgroundPrimary: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
    backgroundSecondary: 'linear-gradient(135deg, #F8F9FA 0%, #F5F5F5 100%)',
    cardBackground: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
    modalBackground: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
    goldenAccent: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
    blueAccent: 'linear-gradient(135deg, #0072CE 0%, #0056A3 100%)',
    
    // Modern gradients
    hero: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 50%, #0072CE 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    darkGlass: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%)',
    premium: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 25%, #0072CE 75%, #0056A3 100%)',
  },

  // Special Effects - GG Wi-Fi Brand Effects
  effects: {
    glow: {
      primary: '0 0 30px rgba(255, 199, 44, 0.4)',
      secondary: '0 0 30px rgba(0, 114, 206, 0.4)',
      success: '0 0 30px rgba(26, 188, 156, 0.4)',
      warning: '0 0 30px rgba(255, 199, 44, 0.4)',
      error: '0 0 30px rgba(231, 76, 60, 0.4)',
    },
    shadow: {
      light: '0 4px 12px rgba(0, 0, 0, 0.1)',
      medium: '0 8px 24px rgba(0, 0, 0, 0.15)',
      heavy: '0 12px 36px rgba(0, 0, 0, 0.2)',
      golden: '0 8px 32px rgba(255, 199, 44, 0.3)',
      blue: '0 8px 32px rgba(0, 114, 206, 0.3)',
      glow: '0 0 20px rgba(255, 199, 44, 0.3)',
    },
    glass: {
      primary: 'rgba(255, 255, 255, 0.9)',
      secondary: 'rgba(248, 249, 250, 0.95)',
      modal: 'rgba(255, 255, 255, 0.98)',
    },
  },

  // Status Colors - GG Wi-Fi Brand Colors
  status: {
    online: '#1ABC9C', // Success green
    offline: '#E74C3C', // Error red
    pending: '#FFC72C', // Golden yellow
    processing: '#0072CE', // Blue accent
    success: '#1ABC9C', // Success green
    error: '#E74C3C', // Error red
    warning: '#FFC72C', // Golden yellow
    info: '#0072CE', // Blue accent
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