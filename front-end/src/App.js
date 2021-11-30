
/** @jsxImportSource @emotion/react */
import { useContext } from 'react'
// Local
import Oups from './Oups'
import Footer from './Footer'
import Header from './Header'
import Main from './Main'
import Login from './Login'
import Context from './Context'
// Rooter
import {
  Route,
  Routes,
  Navigate
} from "react-router-dom"

const styles = {
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#565E71',
    padding: '50px',
  },
}

export default function App() {
  const {oauth} = useContext(Context)

  return (
    <div className="App" css={styles.root}>
      <Header />
      <Routes>
        <Route path="/*" element={oauth ? <Main /> : <Login />} />
        <Route path="oups" element={oauth ? <Oups /> : <Navigate to='/' />} />
      </Routes>
      <Footer />
    </div>
  );
}
