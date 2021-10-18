/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'
import {Channels} from './Channels.js'
import {Channel} from './Channel.js'
import {data} from './dummyData.js'

export const Main = () => {
    return (
      <main className="App-main" css={styles.main}>
        <Channels />
        <Channel channel={data.channels[0]}/>
      </main>
    );
}
