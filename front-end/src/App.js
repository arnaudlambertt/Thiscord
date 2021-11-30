
/** @jsxImportSource @emotion/react */
import { useContext } from 'react'
// Local
import Header from './Header'
import Main from './Main'
import Login from './Login'
import Context from './Context'
// Rooter
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
  const {oauth} = useContext(Context)

  return (
    <div className="App" css={styles.root}>
      <Header />
      <Routes>
        <Route path="/*" element={oauth ? <Main /> : <Login />} />
      </Routes>
    </div>
  );
}
