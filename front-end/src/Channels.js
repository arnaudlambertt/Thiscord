
/** @jsxImportSource @emotion/react */
import {useContext,useRef,useEffect,useState} from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
// Layout
// Local
import Context from './Context'
import { useTheme } from '@mui/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from './sidebar/List'
import Parameters from './sidebar/Parameters'
import {useNavigate} from 'react-router-dom';
const useStyles = (theme) => ({
  root: {
    height: '70%',
    flex: '1 1 auto',
    display: 'flex',
    backgroundColor:theme.palette.background.paper,
    flexDirection: 'column',
    position: 'relative',
    overflowX: 'auto',
  },
})

export default function Channels() {
  const {
    oauth,
    setChannels,
    user
  } = useContext(Context)

  const navigate = useNavigate();
  const listRef = useRef()
  const styles = useStyles(useTheme(), user)

  useEffect( () => {
    const fetch = async () => {
      try{
        const {data: channels} = await axios.get('http://localhost:3001/channels', {
          headers: {
            'Authorization': `Bearer ${oauth.access_token}`
          }
        })
        setChannels(channels)
        if(listRef.current){
          listRef.current.scroll()
        }
      }catch(err){
        console.error(err)
      }
    }
    fetch()

    const socket = socketIOClient('http://localhost:3001', {
      withCredentials: true,
      extraHeaders: {
     'Authorization': `Bearer ${oauth.access_token}`
    }
    });
    socket.on('update channel', channel => {
      setChannels(channels =>
      {
        const localChannelIndex = channels.findIndex(c => c.id === channel.id)
        if(localChannelIndex === -1)
          return[...channels, channel]

        channels.splice(localChannelIndex,1,channel)
        return[...channels]
      })
    });
    socket.on('delete channel', channel => {
      setChannels(channels =>
      {
        console.log('delete channel')
        const localChannelIndex = channels.findIndex(c => c.id === channel.id)
        if(localChannelIndex !== -1)
          channels.splice(localChannelIndex,1)
        return [...channels]
      })
    });

  }, [oauth,setChannels])


//add members
  return (
    <div css={styles.root}>
    <Button
    color='primary'
    onClick={ (e) => {
      e.preventDefault()
      navigate(`/`)
      }}
      sx={{
        width: '100%',
        height: 50,
        spacing:0,
        justifyContent:'center',
        '&:hover': {
          backgroundColor: 'background.default',
          opacity: [0.9, 0.8, 0.7],
        },
      }}>
        <h3>  Home </h3>
      </Button>
      <Divider sx={{color:'#FF0000'}} />
    <List
      ref={listRef}
    />
    <Parameters />
  </div>
  );
}
