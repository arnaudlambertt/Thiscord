
/** @jsxImportSource @emotion/react */
import {useContext} from 'react';
import { Routes, Route } from 'react-router-dom';
import {Context} from './Context'
import './App.css';
import Main from './Main'
import Login from './Login'

const styles = {
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#35393F',
    padding: '0px',
  },
}

export default function App() {
  const {user} = useContext(Context)
  return (
    <div className="App" css={styles.root}>
      <Routes>
         <Route path="/*" element={user ? <Main /> : <Login />} />
      </Routes>
    </div>
  );
}
