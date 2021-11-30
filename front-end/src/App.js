
/** @jsxImportSource @emotion/react */
import { useContext } from 'react'
// Local
import Oups from './Oups'
import Header from './Header'
import Main from './Main'
import Login from './Login'
import Context from './Context'
// Rooter
import {
  Route,
  Routes,
  Navigate,
  useLocation
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
  const location = useLocation()
  const {oauth} = useContext(Context)

  const gochannels = (<Navigate
    to={{
      pathname: "/channels",
      state: { from: location }
    }}
  />)
  const gohome = (<Navigate
    to={{
      pathname: "/",
      state: { from: location }
    }}
  />)
  return (
    <div className="App" css={styles.root}>
      <Header />
      <Routes>
        <Route exact path="/" element={oauth ? (gochannels) : (<Login />)}/>
        <Route path="/channels/*" element={oauth ? (<Main />) : (gohome)}/>
        <Route path="/Oups" element={<Oups />} />
      </Routes>
    </div>
  );
}
