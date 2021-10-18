/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'

export const Footer = () => {
  return (
    <footer className="App-footer" style={styles.footer}>
      <p>Made with ❤️ by Arnaud & Clément</p>
    </footer>
  );
}
