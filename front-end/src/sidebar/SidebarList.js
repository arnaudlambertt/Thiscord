/** @jsxImportSource @emotion/react */
import {forwardRef, useImperativeHandle,useContext,useEffect, useLayoutEffect, useRef} from 'react'
import Context from '../Context'
import Button from '@mui/material/Button';
import { useTheme } from '@mui/styles';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

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
})

export default forwardRef(({
  refresh,
  onScrollDown,
}, ref) => {
const styles = useStyles(useTheme())
  const {
    oauth,
    channels, setChannels,
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
          const {scrollTop, offsetHeight, scrollHeight} = rootNode // react-hooks/exhaustive-deps
          onScrollDown(scrollTop + offsetHeight < scrollHeight)
        }, 200)
      }
    }
    handleScroll()
    rootNode.addEventListener('scroll', handleScroll)
    return () => rootNode.removeEventListener('scroll', handleScroll)
  })
  return(
    <div ref={rootEl}>
    <ul>
        <li>
        <Button
        onClick={ (e) => {
          e.preventDefault()
          navigate(`/`)
          }}
          sx={{
            width: '100%',
            height: 50,
            spacing:0,
            justifyContent:'left',
            color:'#ffffff',
            backgroundColor: 'background.paper',
            '&:hover': {
              backgroundColor: 'background.default',
              opacity: [0.9, 0.8, 0.7],
            },
          }}>
          <h3> Welcome </h3>
          </Button>
        </li>
        { channels.map( (channel, i) => (
          <li key={i}>
          <Button
          onClick={ (e) => {
            e.preventDefault()
            navigate(`/channels/${channel.id}`)
            }}
            sx={{
              width: '100%',
              height: 50,
              spacing:0,
              color:'#ffffff',
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
