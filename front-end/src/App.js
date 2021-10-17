import {useState} from 'react';
import './App.css';
/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'
import {Header} from './Header.js'
//import {Main} from './Main.js'
import {Messages} from './Messages.js'
import {Footer} from './Footer.js'


export default () => {
  return (
    <div className="App" css={styles.root}>
      <Header/>
      <main className="App-main" css={styles.main}>
        <div css={styles.channels}>
        </div>
        <Messages />
      </main>
      <Footer/>
    </div>
  );
}
