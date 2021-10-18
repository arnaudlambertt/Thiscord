import {useState} from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'
import {Messages} from './Messages.js'
import {MessageForm} from './MessageForm.js'
import {data} from './dummyData.js'

export const Channel = ({channel}) => {
  const [messages, setMessages] = useState(data.messages);

  const addMessage = (message) => {
    setMessages([
      ...messages,
      message
    ])
  }

  return (
    <div css={styles.channel}>
      <h1># {channel.name}</h1>
      <hr style={{width:'100%',textAlign:'left',marginLeft:0, borderColor:'rgba(0,0,0,.2)'}}/>
      <Messages messages={messages} channelName={channel} />
      <MessageForm sendMessage={addMessage} />
    </div>
  );
}
