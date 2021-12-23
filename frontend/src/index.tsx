import React from "react";
import ReactDOM from "react-dom";
import App from "App";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AuthLayer from "components/AuthLayer";
import theme from "styles/theme";
import "styles/index.scss";

ReactDOM.render(
  <ThemeProvider theme={createTheme(theme)}>
    <CssBaseline />
    <AuthLayer>
      <App />
    </AuthLayer>
  </ThemeProvider>,
  document.getElementById("root")
);
