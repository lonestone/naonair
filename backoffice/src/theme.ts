import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#25244E",
      light: "#8382A6",
      "100": "#D8D8E1",
      "50": "#F1F0F9",
    },
    error: {
      main: red.A200,
    },
    success: { main: "#1D9D8B" },
  },

  typography: {
    h1: {
      fontFamily: "Raleway",
      fontWeight: "bold",
      fontSize: "26px",
      lineHeight: "34px",
    },
    h2: {
      fontFamily: "Raleway",
      fontWeight: "bold",
      fontSize: "26px",
      lineHeight: "34px",
    },
    h3: {
      fontFamily: "Raleway",
      fontWeight: "700",
      fontSize: "20px",
      lineHeight: "24px",
    },
    h4: {
      fontFamily: "Lato",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: 700,
      lineHeight: "24px",
      textlign: "left",
    },
    caption: {
      fontFamily: "Lato",
      fontWeight: "700",
      fontSize: "16px",
      lineHeight: "24px",
    },

    body1: {
      fontFamily: "Lato",
      fontWeight: "400",
      fontSize: "14px",
      lineHeight: "20px",
    },

    button: {
      fontFamily: "Lato",
      fontWeight: "700",
      fontSize: "14px",
      lineHeight: "20px",
      textTransform: "none",
    },
  },
});

export default theme;
