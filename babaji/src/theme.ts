import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00579C",
    },
    secondary: {
      main: "#9c27b0",
    },
    error: {
      main: "#D20000",
    },
  },
  typography: {
    h1: {
      fontFamily: "Montserrat",
      fontWeight: 400,
      fontSize: "75px",
      lineHeight: "75px",
      letterSpacing: "-0.2px",
    },
    h2: {
      fontFamily: "Montserrat",
      fontWeight: 400,
      fontSize: "64px",
      lineHeight: "64px",
      letterSpacing: "-0.2px",
    },
    h3: {
      fontFamily: "Montserrat",
      fontWeight: 400,
      fontSize: "52px",
      lineHeight: "52px",
      letterSpacing: "-0.2px",
    },
    h4: {
      fontFamily: "Montserrat",
      fontWeight: 400,
      fontSize: "36px",
      lineHeight: "42px",
    },
    body1: {
      fontFamily: "Montserrat",
      fontWeight: 500,
      fontSize: "16px",
      lineHeight: "18px",
      letterSpacing: "20%",
    },
    subtitle1: {
      fontFamily: "Montserrat",
      fontWeight: 600,
      fontSize: "24px",
      lineHeight: "26px",
    },
    subtitle2: {
      fontFamily: "Montserrat",
      fontWeight: 600,
      fontSize: "18px",
      lineHeight: "24px",
    },
    caption: {
      fontFamily: "Montserrat",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "18px",
    },
    overline: {
      fontFamily: "Montserrat",
      fontWeight: 600,
      fontSize: "12px",
      lineHeight: "14px",
    },
    button: {
      fontFamily: "Montserrat",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "16px",
    },
    body2: {
      fontFamily: "Montserrat",
      fontWeight: 600,
      fontSize: "18px",
      lineHeight: "18px",
    },
  },
});

export default theme;
