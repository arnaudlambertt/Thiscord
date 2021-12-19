
/** @jsxImportSource @emotion/react */
import {useContext, useRef, useState, useEffect} from 'react';
import axios from 'axios';
// Layout
import { useTheme } from '@mui/styles';
import {Fab} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// Local
import Form from './channel/Form'
import List from './channel/List'
import Context from './Context'
import { useNavigate, useParams } from 'react-router-dom'

const useStyles = (theme) => ({
  root: {
    height: '100%',
    flex: '1 1 auto',
    display: 'flex',
    color:theme.palette.text.primary,
    flexDirection: 'column',
    position: 'relative',
    overflowX: 'auto',
  },
  fab: {
    position: 'absolute !important',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabDisabled: {
    display: 'none !important',
  }
})

export default function Channel() {
  const navigate = useNavigate()
  const { id } = useParams()
  const {channels, oauth, setCurrentChannel, authors} = useContext(Context)
  const channel = channels.find( channel => channel.id === id)
  const styles = useStyles(useTheme())
  const listRef = useRef()
  const [messages, setMessages] = useState([])
  const [scrollDown, setScrollDown] = useState(false)
  const addMessage = (message) => {
    setMessages([...messages, message])
  }

  useEffect( () => {
    const fetch = async () => {
      try{
        const {data: messages} = await axios.get(`http://localhost:3001/channels/${id}/messages`, {
          headers: {
              'Authorization': `Bearer ${oauth.access_token}`
          }
        })
        setMessages(messages)
        if(listRef.current){
          listRef.current.scroll()
        }
      }catch(err){
        navigate('/')
      }
    }
    fetch()
    setCurrentChannel(channel)
  },[navigate,channel,setCurrentChannel,id,oauth])
  const onScrollDown = (scrollDown) => {
    setScrollDown(scrollDown)
  }
  const onClickScroll = () => {
    listRef.current.scroll()
  }

  const messagesReady = () => {
    for(const message of messages){
      if(!authors[message.author])
        return false
    }
      return true
  }

  if(!channel)
    return <div></div>

  if(!messagesReady()){
    return(
    <div css={styles.root}>
      <h1>Messages for {channel.name}</h1>
    </div>)
  }
  return (
    <div css={styles.root}>
      <List
        channel={channel}
        setMessages={setMessages}
        messages={messages}
        onScrollDown={onScrollDown}
        ref={listRef}
      />
      <Form addMessage={addMessage} channel={channel} />
      <Fab
        color="primary"
        aria-label="Latest messages"
        css={[styles.fab, scrollDown || styles.fabDisabled]}
        onClick={onClickScroll}
      >
        <ArrowDropDownIcon />
      </Fab>
    </div>
  );
}
