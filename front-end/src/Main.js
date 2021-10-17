/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'
import {Messages} from './Messages.js'

export const Main = () => {
    return (
      <main className="App-main" css={styles.main}>
        <div css={styles.channels}>
        </div>
        <Messages/>
      </main>
    );
}
