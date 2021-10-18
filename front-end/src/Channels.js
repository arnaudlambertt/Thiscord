/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'

export const channels = [
  {
    name: 'Channel 1'
  },
  {
    name: 'Channel 2'
  },
  {
    name: 'Channel 3'
  }
]

export const Channels = () => {
  return (
    <div css={styles.channels}>
    <h1>Channel list</h1>
    <ul>
      { channels.map( (channel, i) => (
        <li key={i} css={styles.channel}>
          <span>{channel.name}</span>
        </li>
      ))}
    </ul>
    </div>
  );
}
