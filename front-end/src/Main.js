
/** @jsxImportSource @emotion/react */
import {useState} from 'react'
import { useTheme } from '@mui/styles';

// Local
import Channels from './Channels'
import Channel from './Channel'
import Welcome from './Welcome'

const useStyles = (theme) => ({
  main: {
    background: theme.palette.background.default,
    overflow: 'hidden',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
})

export default function Main() {
  const [channel, setChannel] = useState(null)
  const fetchChannel = async (channel) => {
    setChannel(channel)
  }
  const styles = useStyles(useTheme());
  return (
    <main css={styles.main}>
      <Channels onChannel={fetchChannel} />
      {channel ? <Channel channel={channel} messages={[]} /> : <Welcome />}
    </main>
  );
}
