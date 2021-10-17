/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'

export const Header = () => {
    return (
      <header className="App-header" css={styles.header}>
      <h1>Header</h1>
      </header>
    );
}
