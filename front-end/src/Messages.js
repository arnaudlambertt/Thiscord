/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'

export const Messages = ({messages, channelName}) => {
  return (
      <div css={styles.messages}>
        <h1>Messages for {channelName}</h1>
        <ul>
          { messages.map( (message, i) => (
            <li key={i} css={styles.message}>
              <p>
                <span>{message.author}</span>
                {' '}
                <span>{(new Date(message.creation)).toString()}</span>                  </p>
                <div>
                {
                  message.content
                  .split(/(\n +\n)/)
                  .filter( el => el.trim() )
                  .map( el => <p>{el}</p>)
                }
                </div>
            </li>
          ))}
        </ul>
        </div>
    );
}
