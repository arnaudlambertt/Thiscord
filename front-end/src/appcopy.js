import {useState} from 'react';
import './App.css';
/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'
import {Header} from './Header.js'
//import {Main} from './Main.js'
import {Footer} from './Footer.js'
import {MessageForm} from './MessageForm.js'

export default ({
  channel = {
    name: 'Fake channel'
  }
}) => {
  const [messages, setMessages] = useState([{
    author: 'sergei',
    creation: 1602831101929,
    content: `
    ## 1 - Architecture - Level easy

    It is now the right time to re-organize/refactor our code. Split this
    monolithic react Component into multiple section. In the end, we should end
    up with the following components: 'Header', 'Footer', 'Main', 'Channels',
    'Channel', 'Messages', 'MessageSend':

    - 'App.js' file uses 'Header.js', 'Main.js', 'Footer.js'
    - 'Main.js' file uses 'Channels.js', 'Channel.js'
    - 'Channels.js' prints the list of channels
    - 'Channel.js' prints the messages, uses 'Messages.js' and 'MessageSend.js'
    - 'Messages.js' prints the list of messages inside the current channel
    - 'MessageForm.js' send a new message

    \`\`\`
    +--------------------------------------------+
    |                  Header                    |
    +--------------------------------------------+
    |   Channels    |          Channel           |
    |               | +------------------------+ |
    |               | |        Messages        | |
    |               | +------------------------+ |
    |               | |      MessageSend       | |
    |               | +------------------------+ |
    +--------------------------------------------+
    |                  Footer                    |
    +--------------------------------------------+
    \`\`\`
    `,
  },{
    author: 'david',
    creation: 1602832138892,
    content: `
    ## 2 - Styles - Level easy

    Give it some styles, use CSS to make it looks good. Possible source of
    improvements include changing the colors, replacing the HTML "send" button
    with an icon, working on the header, providing day/night themes ... be creative
    `,
  },{
    author: 'sergei',
    creation: 1602840139202,
    content: `
    ## 3 - Use an external library - Level medium

    Format the date in a human readable format. While the date is generated on
    the server side to ensure its relevance and prevent from forgery, it must be
    displayed according to the user browser local. The
    [Moment.js](https://momentjs.com/) library has been the library of choice
    for many years to accomplish date formatting. Read what is displayed on the
    top right corner of their homepage, it is now depreciated. Read the reasons
    and act accordingly.
    `,
  },{
    author: 'david',
    creation: 1602844139200,
    content: `
    ## 4 - Support message contents in Markdown - Level hard

    Markdown is the most popular syntax to format text into HTML. It is used
    by the majority of the project Readme files, to write documentation and to
    generate websites.

    I recommand you to use the [unified](https://unifiedjs.com/) which is very
    powerful and comes with a lot of plugins. You can read the Markdown to HTML
    guide in the learn section and enrich it with your selection of relevant
    plugins.

    Consider adding syntax highlight support with a library like
    [Prism](https://prismjs.com/).
    `,
  }])
  const addMessage = (message) => {
    setMessages([
      ...messages,
      message
    ])
  }

  return (
    <div className="App" css={styles.root}>
      <Header/>
      <main className="App-main" css={styles.main}>
        <div css={styles.channels}>
        </div>
        <div css={styles.channel}>
          <div css={styles.messages}>
            <h1>Messages for {channel.name}</h1>
            <ul>
              { messages.map( (message, i) => (
                <li key={i} css={styles.message}>
                  <p>
                    <span>{message.author}</span>
                    {' '}
                    <span>{(new Date(message.creation)).toString()}</span>
                  </p>
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
          <MessageForm addMessage={addMessage} />
        </div>
      </main>
      <Footer/>
    </div>
  );
}
