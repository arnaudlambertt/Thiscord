
/** @jsxImportSource @emotion/react */
import {useContext,useRef,useEffect} from 'react';
import axios from 'axios';
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
    flexDirection: 'column',
    position: 'relative',
    overflowX: 'auto',
  },
})

export default function Channels() {
  const {
    oauth,
    channels, setChannels,
    updateAuthors,
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
  }, [oauth, setChannels])

  useEffect( () => {
    const fetch = async () => {
      for(const channel of channels){
        for(const member of channel.allMembers){
          updateAuthors(member)
        }
      }
    }
    fetch()
  },[updateAuthors,channels])

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
