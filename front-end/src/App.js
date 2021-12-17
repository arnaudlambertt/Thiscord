
/** @jsxImportSource @emotion/react */
import { useContext,useMemo } from 'react'
// Local
import Main from './Main'
import Login from './Login'
import Context from './Context'
import { createTheme,ThemeProvider } from '@mui/material/styles';
// Rooter
import {
  BrowserRouter as Router,
} from "react-router-dom";
import {
  Route,
  Routes,
} from "react-router-dom"

const styles = {
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#565E71',
    height:'100%',
    width:'100%',
  },
}

export default function App() {
  const {oauth,mode} = useContext(Context)

  const theme = useMemo(
     () =>
       createTheme({
         palette: {
           mode,
           ...(mode === 'light'
           ? {
             background: {
               default: "#EEEEEE",
               paper: "#AAAAAA",
               middle:"#BBBBBB"
             },
             primary: {
               main: "#416BEB",
               dark: "#3457BE",
               contrastText:"#EEEEEE",
             },
             secondary: {
               main: "#444444",
               contrastText:"#FFFFFF",
             },
             terciary: {
               main: "#EEEEEE",
               contrastText:"#282928",
             },
             text: {
               primary: "#282928",
               secondary: "#282928"
             }
        }
      : {
        background: {
          default: "#35393F",
          paper: "#2E3136",
          middle:"#2a2b2a"
        },
        primary: {
          main: "#416BEB",
          dark: "#3457BE",
          contrastText:"#EEEEEE",
        },
        secondary: {
          main: "#DDDDDD",
          contrastText:"#282928",
        },
        terciary: {
          main: "#35393F",
          contrastText:"#EEEEEE"
        },
        text: {
          primary: "#C9C9C9",
          secondary: "#C9C9C9"
        }
        }),
         },
         typography:{
           button: {
             textTransform: "none"
           }
         },
       }),
     [mode],
   );
  return (
    <div className="App" css={styles.root}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/*" element={oauth ? <Main /> : <Login />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}
