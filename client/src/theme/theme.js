import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#d45c2d",
      dark: "#a94018",
      light: "#f39a73",
    },
    secondary: {
      main: "#1f6b52",
    },
    background: {
      default: "#f6f4ef",
      paper: "#fffdf9",
    },
    text: {
      primary: "#1f1d17",
      secondary: "#5e5a50",
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: '"Manrope", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: "clamp(2.6rem, 5vw, 4.8rem)",
      lineHeight: 1.05,
      letterSpacing: "-0.04em",
    },
    h2: {
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },
    h5: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          boxShadow: "0 24px 70px rgba(39, 31, 20, 0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
        },
      },
    },
  },
});

