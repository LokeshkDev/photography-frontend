import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0d6efd", // Corporate blue
    },
    secondary: {
      main: "#6c757d",
    },
    background: {
      default: "#f7f9fc", // soft gray
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 8, // Slightly rounded corners
  },
  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
    button: {
      textTransform: "none", // Stop uppercase buttons
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 4px rgba(0,0,0,0.07)",
        },
      },
    },
  },
});

export default theme;
