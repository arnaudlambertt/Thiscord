/** @jsx jsx */
import { jsx } from '@emotion/core'

const styles = {
  main: {
    backgroundColor: '#373B44',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  }
}

export const Main = () => {
    return (
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
    );
}
