
/** @jsxImportSource @emotion/react */
import {forwardRef, useContext, useImperativeHandle, useLayoutEffect, useRef, useState, useEffect} from 'react'
import Context from '../Context'
import axios from 'axios';
import Gravatar from 'react-gravatar';
// Layout
import { useTheme } from '@mui/styles';
import { IconButton,Box, Button,Typography } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
// Markdown
import { unified } from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import html from 'rehype-stringify'
// Time
import { DateTime } from 'luxon'

const useStyles = (theme) => ({
  root: {
    position: 'relative',
    flex: '1 1 auto',
    color:theme.palette.text.primary,
    overflow: 'auto',
    '& ul': {
      'margin': 0,
      'padding': 0,
      'textIndent': 0,
      'listStyleType': 0,
    },
  },
  timeStamp: {
   color: theme.palette.text.primary,
   paddingLeft: 5,
   fontSize: 14
 },
 edited: {
  color: theme.palette.text.primary,
  fontSize: 14
},
  fab: {
    position: 'fixed !important',
    top: 0,
    width: '50px',
  },
})

export default forwardRef(({
  channel,
  setMessages,
  messages,
  onScrollDown,
}, ref) => {
  const styles = useStyles(useTheme())
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('')
  const [, refresh] = useState(false)
  const {user,authors,oauth} = useContext(Context)
  // Expose the `scroll` action
  useImperativeHandle(ref, () => ({
    scroll: scroll
  }));

  const rootEl = useRef(null)
  const scrollEl = useRef(null)
  const scroll = () => {
    scrollEl.current.scrollIntoView()
  }
  // See https://dev.to/n8tb1t/tracking-scroll-position-with-react-hooks-3bbj
  const throttleTimeout = useRef(null) // react-hooks/exhaustive-deps

  useLayoutEffect( () => {
    const rootNode = rootEl.current // react-hooks/exhaustive-deps
    const handleScroll = () => {
      if (throttleTimeout.current === null) {
        throttleTimeout.current = setTimeout(() => {
          throttleTimeout.current = null
          const {scrollTop, offsetHeight, scrollHeight} = rootNode // react-hooks/exhaustive-deps
          onScrollDown(scrollTop + offsetHeight < scrollHeight)
        }, 200)
      }
    }
    handleScroll()
    rootNode.addEventListener('scroll', handleScroll)
    return () => rootNode.removeEventListener('scroll', handleScroll)
  })

  const handleOpen = (message) => {
   setOpen(true)
   setContent(message.content)
 }

 const handleClose = () => {
   setOpen(false)
 }
 const handleChange = (e) => {
   setContent(e.target.value)
 }
 const deleteMessage = async (message) => {
   try{
     await axios.delete(
       `http://localhost:3001/channels/${channel.id}/messages`,
       {
       headers: {
         'Authorization': `Bearer ${oauth.access_token}`
       },
       data: message
     })
     messages.splice(messages.findIndex(e => e === message),1)
     setMessages([...messages])
   }catch(err){
     console.log(err)
   }
 }
 const editMessage = async (message) => {
   try{
     if(content){
       const {data: edited} = await axios.put(
         `http://localhost:3001/channels/${channel.id}/messages`,
         {
           content: content,
           creation: message.creation,
         },
         {
         headers: {
           'Authorization': `Bearer ${oauth.access_token}`
         },
       })
       messages.splice(messages.findIndex(e => e.creation === edited.creation),1,edited)
       setOpen(false)
     }
   }catch(err){
     console.log(err)
   }
 }

useEffect(() => {
const authorsLoaded = () => {
 for(const message of messages){
   if(!authors[message.author])
    return false
  }
  return true
  }
  refresh(authorsLoaded())
}, [refresh,authors,messages])

  return (
    <div css={styles.root} ref={rootEl}>
      <h1>Messages for {channel.name}</h1>
      <ul>
        { messages.map( (message, i) => {
            const {value} = unified()
            .use(markdown)
            .use(remark2rehype)
            .use(html)
            .processSync(message.content);
            return (
              <li key={i} css={styles.message}>
                <Box sx={{
                  padding: '.2rem .5rem',
                  ':hover': {
                    backgroundColor:'background.middle',
                  },
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection:'row',
                  overflow:'auto',
                  overflowWrap:'break-word',
                  flexWrap:'wrap',
                  }}>
                    <span>
                    {
                      authors[message.author] ?
                      authors[message.author].avatar==='gravatar' ? <Gravatar size={50} style={{borderRadius: "100%"}} email={authors[message.author].email}/>
                      : <img src={authors[message.author].avatar} style={{borderRadius: "100%"}} alt="user_avatar" width='50' height='50' />
                      :''
                    }
                    </span>
                  <Box sx={{width:'calc(100% - 60px)', marginLeft:1}}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection:'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        overflowWrap:'break-word',
                        flexWrap:'wrap',
                          }}
                    >
                      <Box sx={{
                              display: 'flex',
                              flexDirection:'row',
                              justifyContent: 'flex-start',
                              alignItems: 'baseline',
                              overflowWrap:'break-word',
                              flexWrap:'wrap',
                            }}>
                        <Typography sx={{
                               color: 'primary.main',
                               fontSize: 20,
                               fontWeight: 'bold',
                               maxWidth:{ xs: "240px", sm: "600px" },
                             }}
                        >
                          {authors[message.author]?.username}
                        </Typography>
                        <span css={styles.timeStamp}>{ DateTime.fromMillis(Number(message.creation)/1000).toFormat("MMMM dd, yyyy 'at' t")}</span>
                      </Box>
                      <Box>
                        {user.id === message.author ?
                        <div>
                          {message.edited ?
                          <span css={styles.edited}>(Edited)</span>
                          : ''
                          }
                          <IconButton aria-label="modify" sx={{color:'background.default'}} onClick={() => {handleOpen(message)}}>
                            <CreateIcon fontSize="small" />
                          </IconButton>
                          <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Edit your message</DialogTitle>
                            <DialogContent>
                              <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                value={content}
                                onChange={handleChange}
                                label="your message"
                                variant="standard"
                              />
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleClose}>Cancel</Button>
                              <Button variant="contained" onClick={(e) => {e.stopPropagation(); editMessage(message)}}>Edit</Button>
                            </DialogActions>
                          </Dialog>
                          <IconButton aria-label="delete" sx={{color:'background.default'}} onClick={(e) => {e.stopPropagation(); deleteMessage(message)}}>
                            <DeleteIcon fontSize="small"/>
                          </IconButton>
                        </div>
                        :
                        message.edited ?
                        <span css={styles.edited}>(Edited)</span>
                        : ''
                        }
                      </Box>
                    </Box>
                    <div dangerouslySetInnerHTML={{__html: value}}>
                    </div>
                  </Box>
                </Box>
              </li>
            )
        })}
      </ul>
      <div ref={scrollEl} />
    </div>
  )
})
