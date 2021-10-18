import './App.css';
/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'
import {Header} from './Header.js'
import {Main} from './Main.js'
import {Footer} from './Footer.js'

export default () => {
  return (
    <div className="App" css={styles.root}>
      <Header/>
      <Main/>
      <Footer/>
    </div>
  );
}
