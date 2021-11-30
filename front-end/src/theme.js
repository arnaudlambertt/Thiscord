import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: "#35393F",
      paper: "#2E3136"
    },
    primary: {
      main: "#416BEB",
      dark: "#3457BE"
    },
    secondary: {
      main: "#000000"
    },
    text: {
      primary: "#C9C9C9",
      secondary: "#C9C9C9"
    }
  },
  typography:{
    button: {
      textTransform: "none"
    }
  }
});

export default theme;
