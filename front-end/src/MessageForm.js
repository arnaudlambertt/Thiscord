/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'

export const MessageForm = (
  {sendMessage}
) => {
  const onSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    sendMessage({
      content: data.get('content'),
      author: 'Anonymous',
      creation: Date.now(),
    })
    e.target.elements.content.value = ''
  }
  return (
    <form css={styles.form}  onSubmit={onSubmit}>
      <input type="input" name="content" css={styles.content} />
      <input type="submit" value=">" css={styles.send} />
    </form>
  );
}
