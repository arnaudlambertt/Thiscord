
/** @jsxImportSource @emotion/react */
import {useContext, useRef, useState, useEffect} from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

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
  const {channels, authors, oauth, setCurrentChannel, setAuthors} = useContext(Context)
  const channel = channels.find( channel => channel.id === id)
  const styles = useStyles(useTheme())
  const listRef = useRef()
  const [messages, setMessages] = useState([])
  const [,reRender] = useState(false)
  const [scrollDown, setScrollDown] = useState(false)
  useEffect( () => {
    const fetch = async () => {
      if(channel)
      {
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
    }
    fetch()
    setCurrentChannel(channel)
  },[navigate,channel,setCurrentChannel,id,oauth])

  useEffect( () => {
    const authorsTemp = {}
    const addAuthor = async (id) => {
      try{
        const {data: author} = await axios.get(`http://localhost:3001/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${oauth.access_token}`
          }
        })
        if(!authorsTemp[id])
          authorsTemp[id] = author
      }catch(err){
        console.error(err)
      }
    }
    const fetch = async () => {
      for(const channel of channels){
        for(const member of channel.allMembers){
          if(!authorsTemp[member])
            await addAuthor(member)
        }
      }
      setAuthors(u => u = {...u,...authorsTemp})
      reRender(u => !u)
    }
    fetch()
  },[oauth, setAuthors,reRender, channels])

  useEffect(() => {
    const socket = socketIOClient('http://localhost:3001', {
      withCredentials: true,
      extraHeaders: {
     'Authorization': `Bearer ${oauth.access_token}`
    }
    });
    socket.on('update author', author => {
        setAuthors((u) => {
          const pair = {}
          pair[author.id] = author
          return {...u,...pair}
        })
    });
    socket.on('delete author', author => {
        setAuthors((u) => {
          delete u[author.id]
          return u
        })
    });
    
  },[setAuthors,oauth])

  const onScrollDown = (scrollDown) => {
    setScrollDown(scrollDown)
  }
  const onClickScroll = () => {
    listRef.current.scroll()
  }

  if(!channel || Object.keys(authors).length === 0)
    return (<div css={styles.root}>
              {channel ? <h1>Messages for {channel.name}</h1> : ''}
            </div>)

    return (
      <div css={styles.root}>
        <List
          channel={channel}
          setMessages={setMessages}
          messages={messages}
          onScrollDown={onScrollDown}
          ref={listRef}
        />
        <Form channel={channel} />
        <Fab
          color="primary"
          aria-label="Latest messages"
          css={[styles.fab, scrollDown || styles.fabDisabled]}
          onClick={onClickScroll}
        >
          <ArrowDropDownIcon />
        </Fab>
      </div>
    )

}
