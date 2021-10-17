/** @jsx jsx */
import { jsx } from '@emotion/core'
import {styles} from './styles.js'
import {Messages} from './Messages.js'

export const Channel = (channel) => {
  return (
    <div css={styles.channel}>
      <Messages/>
    </div>
  );
}
