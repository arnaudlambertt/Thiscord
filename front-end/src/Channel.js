import {useState} from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'
import {Messages, dummy} from './Messages.js'
import {MessageSend} from './MessageSend.js'

export const Channel = ({channel}) => {
  const [messages, setMessages] = useState(dummy);

  const addMessage = (message) => {
    setMessages([
      ...messages,
      message
    ])
  }

  return (
    <div css={styles.channel}>
      <Messages messages={messages} channelName={channel.name} />
      <MessageSend sendMessage={addMessage} />
    </div>
  );
}
