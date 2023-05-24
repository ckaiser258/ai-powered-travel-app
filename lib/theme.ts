import {
  ThemeOptions,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";

// https://mui.com/material-ui/about-the-lab/
import type {} from "@mui/lab/themeAugmentation";

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
      main: "#9d0208",
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

export const lightTheme = responsiveFontSizes(createTheme(baseTheme));
