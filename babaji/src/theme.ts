import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3B82F6",
    },
    secondary: {
      main: "#7425B0",
    },
    error: {
      main: "#9CA3AF",
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    h1: {
      fontFamily: "DM Serif Display",
      fontWeight: 400,
      fontSize: "75px",
      lineHeight: "75px",
      letterSpacing: "-0.2px",
    },
    h2: {
      fontFamily: "DM Serif Display",
      fontWeight: 400,
      fontSize: "64px",
      lineHeight: "64px",
      letterSpacing: "-0.2px",
    },
    h3: {
      fontFamily: "DM Serif Display",
      fontWeight: 400,
      fontSize: "52px",
      lineHeight: "52px",
      letterSpacing: "-0.2px",
    },
    h4: {
      fontFamily: "DM Serif Display",
      fontWeight: 400,
      fontSize: "36px",
      lineHeight: "42px",
    },
    body1: {
      fontFamily: "DM Sans",
      fontWeight: 500,
      fontSize: "16px",
      lineHeight: "18px",
      letterSpacing: "20%",
    },
    subtitle1: {
      fontFamily: "DM Sans",
      fontWeight: 600,
      fontSize: "24px",
      lineHeight: "26px",
    },
    subtitle2: {
      fontFamily: "DM Sans",
      fontWeight: 600,
      fontSize: "18px",
      lineHeight: "24px",
    },
    caption: {
      fontFamily: "DM Sans",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "18px",
    },
    overline: {
      fontFamily: "DM Sans",
      fontWeight: 600,
      fontSize: "12px",
      lineHeight: "14px",
    },
    button: {
      fontFamily: "DM Sans",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "16px",
    },
    body2: {
      fontFamily: "DM Sans",
      fontWeight: 600,
      fontSize: "18px",
      lineHeight: "18px",
    },
  },
});

export default theme;
