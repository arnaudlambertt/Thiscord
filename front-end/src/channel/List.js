
/** @jsxImportSource @emotion/react */
import {forwardRef, useContext, useImperativeHandle, useLayoutEffect, useRef,useState} from 'react'
import Context from '../Context'
// Layout
import { useTheme } from '@mui/styles';
import { IconButton,Box, Button } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
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
    overflow: 'auto',
    '& ul': {
      'margin': 0,
      'padding': 0,
      'textIndent': 0,
      'listStyleType': 0,
    },
  },
  message: {
    padding: '.2rem .5rem',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,.2)',
    },
  },
  fabWrapper: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50px',
  },
  timeStamp: {
   color: 'rgba(255,255,255,.3)',
   paddingLeft: 5,
   fontSize: 14
 },
 author: {
   color: '#d842eb',
   fontSize: 20,
   fontWeight: 'bold'
 },
  fab: {
    position: 'fixed !important',
    top: 0,
    width: '50px',
  },
})

export default forwardRef(({
  channel,
  messages,
  onScrollDown,
}, ref) => {
  const styles = useStyles(useTheme())
  const [open, setOpen] = useState(false);
    const {user} = useContext(Context)
  // Expose the `scroll` action
  useImperativeHandle(ref, () => ({
    scroll: scroll
  }));
  const {authors} = useContext(Context)

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

  const handleOpen = () => {
   setOpen(true)
 }

 const handleClose = () => {
   setOpen(false)
 }

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
                { user.username==message.author ?
                <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                  <div>
                    <span css={styles.author}>{message.author}</span>
                    <span css={styles.timeStamp}>{ DateTime.fromMillis(Number(message.creation)/1000).toFormat("MMMM dd, yyyy 'at' t")}</span>
                  </div>
                  <div>
                    <IconButton aria-label="modify" sx={{color:'#ffffff'}} onClick={handleOpen}>
                      <CreateIcon />
                    </IconButton>
                    <Dialog open={open} onClose={handleClose}>
                      <DialogTitle>Edit your message</DialogTitle>
                      <DialogContent>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="message"
                          variant="standard"
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleClose}>Subscribe</Button>
                      </DialogActions>
                    </Dialog>
                    <IconButton aria-label="delete" sx={{color:'#ffffff'}}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                  </Box>
                  :
                  <Box >
                    <div>
                      <span css={styles.author}>{authors[message.author]?.username}</span>
                      <span css={styles.timeStamp}>{ DateTime.fromMillis(Number(message.creation)/1000).toFormat("MMMM dd, yyyy 'at' t")}</span>
                    </div>
                    </Box>
                }
                <div dangerouslySetInnerHTML={{__html: value}}>
                </div>
              </li>
            )
        })}
      </ul>
      <div ref={scrollEl} />
    </div>
  )
})
