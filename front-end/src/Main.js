/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'
import {Channels, channels} from './Channels.js'
import {Channel} from './Channel.js'

export const Main = () => {
    return (
      <main className="App-main" css={styles.main}>
        <Channels />
        <Channel channel={channels[0]}/>
      </main>
    );
}
