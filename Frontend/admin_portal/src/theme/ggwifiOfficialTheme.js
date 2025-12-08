// ✅ GG WiFi — OFFICIAL MUI THEME
// Production-ready, enterprise-grade theme system

import { createTheme } from "@mui/material/styles";

export const ggwifiOfficialTheme = createTheme({
  palette: {
    primary: {
      main: "#F2C94C",        // --gg-gold
      dark: "#E0B335",        // --gg-gold-strong
      light: "#F8D97A",
      contrastText: "#0A0A0A", // --gg-black
    },
    secondary: {
      main: "#0A0A0A",        // --gg-black
      contrastText: "#FFFFFF", // --gg-white
    },
    text: {
      primary: "#0A0A0A",     // --gg-black
      secondary: "#666666",   // --neutral-600
    },
    background: {
      default: "#FFFFFF",     // --gg-white
      paper: "#FFFFFF",       // --gg-white
    },
    success: {
      main: "#10B981",        // --sec-green
      light: "#ECFDF5",       // --sec-green-light
    },
    warning: {
      main: "#FF8A3D",        // --sec-orange
      light: "#FFF3E6",       // --sec-orange-light
    },
    info: {
      main: "#3A8DFF",        // --sec-blue
      light: "#EAF4FF",       // --sec-blue-light
    },
    error: {
      main: "#F44336",
      light: "#FFEBEE",
    },
    divider: "#EEEEEE",       // --neutral-200
  },

  typography: {
    fontFamily: "Inter, sans-serif",
    h1: { 
      fontWeight: 700, 
      fontSize: "28px",
      color: "#0A0A0A",
    },
    h2: { 
      fontWeight: 600, 
      fontSize: "22px",
      color: "#0A0A0A",
    },
    h3: { 
      fontWeight: 600, 
      fontSize: "18px",
      color: "#0A0A0A",
    },
    h4: {
      fontWeight: 600,
      fontSize: "16px",
      color: "#0A0A0A",
    },
    body1: { 
      fontWeight: 400, 
      fontSize: "14px",
      color: "#0A0A0A",
    },
    body2: {
      fontWeight: 400,
      fontSize: "12px",
      color: "#666666",
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
          backgroundColor: "#F2C94C",
          color: "#0A0A0A",
          "&:hover": {
            backgroundColor: "#E0B335",
          },
        },
        containedSecondary: {
          backgroundColor: "#0A0A0A",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#1A1A1A",
          },
        },
        outlinedPrimary: {
          borderColor: "#F2C94C",
          color: "#0A0A0A",
          "&:hover": {
            borderColor: "#E0B335",
            backgroundColor: "rgba(242, 201, 76, 0.1)",
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
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          border: "1px solid #EEEEEE",
          color: "#0A0A0A",
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
            borderColor: "#E0E0E0",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F2C94C",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F2C94C",
            borderWidth: "2px",
          },
          "&.Mui-focused": {
            boxShadow: "0 0 0 3px rgba(242, 201, 76, 0.35)",
          },
        },
        input: {
          color: "#0A0A0A",
          "&::placeholder": {
            color: "#666666",
            opacity: 1,
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "#666666",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#F2C94C",
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
          backgroundColor: "#FFFFFF",
          color: "#0A0A0A",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          borderBottom: "1px solid #EEEEEE",
        },
      },
    },

    // ============================================
    // SIDEBAR / NAVIGATION
    // White background, active = Gold w/ black text
    // ============================================
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #EEEEEE",
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          margin: "4px 8px",
          "&.Mui-selected": {
            backgroundColor: "#F2C94C",
            color: "#0A0A0A",
            "&:hover": {
              backgroundColor: "#E0B335",
            },
            "& .MuiListItemIcon-root": {
              color: "#0A0A0A",
            },
          },
          "&:hover": {
            backgroundColor: "rgba(242, 201, 76, 0.1)",
          },
        },
      },
    },

    // ============================================
    // CHIP / BADGES
    // ============================================
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: "#F2C94C",
          color: "#0A0A0A",
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

    // ============================================
    // TABLES
    // ============================================
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#FAFAFA",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#EEEEEE",
          color: "#0A0A0A",
        },
        head: {
          fontWeight: 600,
          color: "#0A0A0A",
        },
      },
    },
  },
});



