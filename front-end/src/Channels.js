/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'
import {data} from './dummyData.js'

export const Channels = () => {
  return (
    <div css={styles.channels}>
    <h1>Channel list</h1>
    <ul>
      { data.channels.map( (channel, i) => (
        <li key={i}>
          <span># {channel.name}</span>
        </li>
      ))}
    </ul>
    </div>
  );
}
