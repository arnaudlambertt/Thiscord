/** @jsxImportSource @emotion/react */
import {forwardRef, useImperativeHandle,useContext, useLayoutEffect, useRef} from 'react'
import Context from '../Context'
import Button from '@mui/material/Button';
import { useTheme } from '@mui/styles';
import {useNavigate} from 'react-router-dom';

const useStyles = (theme) => ({
  root: {
    position: 'relative',
    height:'70%',
    flex: '1 1 auto',
    overflowY: 'auto',
    '& ul': {
      'margin': 0,
      'padding': 0,
      'textIndent': 0,
      'listStyleType': 0,
    },
  },
})

export default forwardRef(({
  refresh,
}, ref) => {
const styles = useStyles(useTheme())
  const {
    channels,
  } = useContext(Context)

  const navigate = useNavigate();
//handle the scroll
  useImperativeHandle(ref, () => ({
    scroll: scroll
  }));
  const rootEl = useRef(null)
  const scrollEl = useRef(null)
  const scroll = () => {
    scrollEl.current.scrollIntoView()
  }
  const throttleTimeout = useRef(null)

  useLayoutEffect( () => {
    const rootNode = rootEl.current // react-hooks/exhaustive-deps
    const handleScroll = () => {
      if (throttleTimeout.current === null) {
        throttleTimeout.current = setTimeout(() => {
          throttleTimeout.current = null
        }, 200)
      }
    }
    handleScroll()
    rootNode.addEventListener('scroll', handleScroll)
    return () => rootNode.removeEventListener('scroll', handleScroll)
  })
  return(
    <div ref={rootEl} css={styles.root}>
    <ul>
        { channels.map( (channel, i) => (
          <li key={i}>
          <Button
          onClick={ (e) => {
            e.preventDefault()
            navigate(`/channels/${channel.id}`)
            }}
            sx={{
              width:'100%',
              overflow:'hidden',
              whiteSpace:'nowrap',
              height: 50,
              spacing:0,
              color:'text.primary',
              justifyContent:'left',
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'background.default',
                opacity: [0.9, 0.8, 0.7],
              },
            }}>
            <h3>{channel.name}</h3>
            </Button>
          </li>
        ))}
      </ul>
    <div ref={scrollEl}/>
    </div>
    )
})
