
/** @jsxImportSource @emotion/react */
import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
// Layout
import { Routes, Route, Link } from 'react-router-dom';
import { useTheme } from '@mui/styles';
import {Context} from './Context'

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

export default function Channels() {
  const {fetchChannels, channels} = useContext(Context);
  useEffect( () => {
     const fetch = async () => {
      await fetchChannels();
    }
    fetch()
  }, [])

  const channelsArray = channels ? Object.values(channels) : [];
  channelsArray.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

  const styles = useStyles(useTheme());
  return (
    <ul style={styles.root}>
      { channelsArray.map((channel) => (
        <li key={channel.id} css={styles.channel}>
          <Link to={`channel/${channel.id}`}>
            {channel.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
