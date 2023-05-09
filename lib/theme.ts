import { ThemeOptions, createTheme } from "@mui/material/styles";

const baseTheme: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#ddbea9",
    },
    secondary: {
      main: "#cb997e",
    },
    error: {
      main: "#6b705c",
    },
    warning: {
      main: "#b7b7a4",
    },
    info: {
      main: "#a5a58d",
    },
    success: {
      main: "#6b705c",
    },
    text: {
      primary: "#6b705c",
    },
    background: {
      default: "#f9ede4",
    },
  },
  typography: {
    fontFamily: "Raleway, sans-serif",
  },
};

export const lightTheme = createTheme(baseTheme);
