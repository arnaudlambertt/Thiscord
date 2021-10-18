/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'
import {channels} from './Channels.js'
import {Channel} from './Channel.js'

export const Main = () => {
    return (
      <main className="App-main" css={styles.main}>
        <div css={styles.channels}>
        </div>
        <Channel channel={channels}/>
      </main>
    );
}
