/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'
import { DateTime } from 'luxon'


export const Messages = ({messages, channel}) => {
  return (
      <div css={styles.messages}>
        <ul>
          { messages.map( (message, i) => (
            <li key={i} css={styles.message}>
              <p>
                <span css={styles.author}>{message.author}</span>
                {' '}
                <span css={styles.timeStamp}>{DateTime.fromJSDate(new Date(message.creation)).toFormat("MMMM dd, yyyy 'at' t")}</span></p>
                <div>
                {
                  message.content
                  .split(/(\n +\n)/)
                  .filter( el => el.trim() )
                  .map( el => <p key="{el}">{el}</p>)
                }
                </div>
            </li>
          ))}
        </ul>
        </div>
    );
}
