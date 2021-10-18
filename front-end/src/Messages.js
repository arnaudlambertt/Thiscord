/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'

export const Messages = ({messages, channel}) => {
  return (
      <div css={styles.messages}>
        <ul>
          { messages.map( (message, i) => (
            <li key={i} css={styles.message}>
              <p>
                <span css={styles.author}>{message.author}</span>
                {' '}
                <span>{(new Date(message.creation)).toString()}</span>                  </p>
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
