
/** @jsxImportSource @emotion/react */
import {useState, useEffect} from 'react';
import axios from 'axios';
// Layout
import { Link } from '@mui/material';
import { useTheme } from '@mui/styles';

const useStyles = (theme) => ({
  root: {
    background: theme.palette.background.paper,
    minWidth: '200px',
  },
  channel: {
    padding: '.2rem .5rem',
    whiteSpace: 'nowrap',
  }
})

export default function Channels({
  onChannel
}) {
  const [channels, setChannels] = useState([])
  useEffect( () => {
    const fetch = async () => {
      const {data: channels} = await axios.get('http://localhost:3001/channels')
      channels.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      setChannels(channels)
    }
    fetch()
  }, [])
  const styles = useStyles(useTheme());
  return (
    <ul style={styles.root}>
      { channels.map( (channel, i) => (
        <li key={i} css={styles.channel}>
          <Link
            href="#"
            onClick={ (e) => {
              e.preventDefault()
              onChannel(channel)
            }}
            >
            {channel.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
