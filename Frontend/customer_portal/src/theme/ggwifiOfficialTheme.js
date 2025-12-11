// ✅ GG WiFi — OFFICIAL MUI THEME
// Production-ready, enterprise-grade theme system

import { createTheme } from "@mui/material/styles";

export const ggwifiOfficialTheme = createTheme({
  palette: {
    // ✅ GG Wi-Fi OFFICIAL BRAND COLORS (LOCKED-IN)
    primary: {
      main: "#FFCC00",        // Primary Yellow - GG Wi-Fi brand color
      dark: "#E6B800",        // Darker yellow for hover
      light: "#FFD633",       // Lighter yellow
      contrastText: "#000000", // Deep Black Text
    },
    secondary: {
      main: "#000000",        // Deep Black Text
      contrastText: "#FFFFFF", // Clean White
    },
    text: {
      primary: "#000000",     // Deep Black Text
      secondary: "#333333",   // Dark Gray Text
    },
    background: {
      default: "#FFFFFF",     // Clean White
      paper: "#FFFFFF",       // Clean White
    },
    // Secondary Accents (supportive only, never override primary brand)
    success: {
      main: "#10B981",        // Green - Success, offer packages
      light: "#ECFDF5",
      dark: "#059669",
    },
    warning: {
      main: "#F59E0B",        // Orange - Alerts, offer banners
      light: "#FFF3E6",
      dark: "#D97706",
    },
    info: {
      main: "#3B82F6",        // Blue - Package category colors, trust badges
      light: "#EAF4FF",
      dark: "#2563EB",
    },
    error: {
      main: "#EF4444",        // Red - Error states
      light: "#FFEBEE",
      dark: "#DC2626",
    },
    // Purple for premium plans (custom color)
    purple: {
      main: "#8B5CF6",        // Purple - Premium plans
      light: "#F3E8FF",
      dark: "#7C3AED",
    },
    divider: "#E5E7EB",       // Light gray divider
  },

  typography: {
    fontFamily: "Inter, sans-serif",
    h1: { 
      fontWeight: 700, 
      fontSize: "28px",
      color: "#000000", // Deep Black
    },
    h2: { 
      fontWeight: 600, 
      fontSize: "22px",
      color: "#000000", // Deep Black
    },
    h3: { 
      fontWeight: 600, 
      fontSize: "18px",
      color: "#000000", // Deep Black
    },
    h4: {
      fontWeight: 600,
      fontSize: "16px",
      color: "#000000", // Deep Black
    },
    body1: { 
      fontWeight: 400, 
      fontSize: "14px",
      color: "#000000", // Deep Black
    },
    body2: {
      fontWeight: 400,
      fontSize: "12px",
      color: "#333333", // Dark Gray
    },
    button: { 
      fontWeight: 600, 
      textTransform: "none",
      fontSize: "14px",
    },
  },

  shape: {
    borderRadius: 12,         // --radius-md
  },

  components: {
    // ============================================
    // BUTTONS
    // Gold background, black text, hover = strong gold
    // ============================================
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "12px 20px",
          fontWeight: 600,
          textTransform: "none",
          fontSize: "14px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          },
        },
        containedPrimary: {
          backgroundColor: "#FFCC00", // Primary Yellow
          color: "#000000", // Deep Black Text
          "&:hover": {
            backgroundColor: "#E6B800", // Darker yellow
          },
        },
        containedSecondary: {
          backgroundColor: "#000000", // Deep Black
          color: "#FFFFFF", // Clean White
          "&:hover": {
            backgroundColor: "#1A1A1A",
          },
        },
        outlinedPrimary: {
          borderColor: "#FFCC00", // Primary Yellow
          color: "#000000", // Deep Black Text
          "&:hover": {
            borderColor: "#E6B800",
            backgroundColor: "rgba(255, 204, 0, 0.1)",
          },
        },
      },
    },

    // ============================================
    // CARDS
    // White, soft shadow, black text, minimal borders
    // ============================================
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          backgroundColor: "#FFFFFF",
          color: "#0A0A0A",
        },
        elevation1: {
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        },
        elevation2: {
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        },
        elevation3: {
          boxShadow: "0 12px 36px rgba(0,0,0,0.10)",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF", // Clean White
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          border: "1px solid #E5E7EB",
          color: "#000000", // Deep Black
        },
      },
    },

    // ============================================
    // INPUTS
    // White background, light border, gold focus glow
    // ============================================
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          backgroundColor: "#FFFFFF",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E5E7EB",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FFCC00", // Primary Yellow
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FFCC00", // Primary Yellow
            borderWidth: "2px",
          },
          "&.Mui-focused": {
            boxShadow: "0 0 0 3px rgba(255, 204, 0, 0.35)",
          },
        },
        input: {
          color: "#000000", // Deep Black
          "&::placeholder": {
            color: "#333333", // Dark Gray
            opacity: 1,
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "#333333", // Dark Gray Text
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#FFCC00", // Primary Yellow
          },
        },
      },
    },

    // ============================================
    // APP BAR / NAVIGATION
    // White background, black text
    // ============================================
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF", // Clean White
          color: "#000000", // Deep Black Text
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          borderBottom: "1px solid #E5E7EB",
        },
      },
    },

    // ============================================
    // DIALOG / MODAL
    // ============================================
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "16px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 12px 36px rgba(0,0,0,0.10)",
        },
      },
    },

    // ============================================
    // ALERT
    // ============================================
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
        standardSuccess: {
          backgroundColor: "#ECFDF5",
          color: "#10B981",
        },
        standardError: {
          backgroundColor: "#FFEBEE",
          color: "#F44336",
        },
        standardWarning: {
          backgroundColor: "#FFF3E6",
          color: "#FF8A3D",
        },
        standardInfo: {
          backgroundColor: "#EAF4FF",
          color: "#3A8DFF",
        },
      },
    },
  },
});



