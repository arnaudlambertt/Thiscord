
/** @jsxImportSource @emotion/react */
import {useContext,useState,useRef,useEffect} from 'react';
import axios from 'axios';
// Layout
// Local
import Context from './Context'
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useTheme } from '@mui/styles';
import Button from '@mui/material/Button';
import SidebarList from './sidebar/SidebarList'
import SidebarButton from './sidebar/SidebarButton'
const useStyles = (theme) => ({
  root: {
    height: '100%',
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
    currentChannel, setCurrentChannel,
    user
  } = useContext(Context)

  const [refresh, setRefresh] = useState(false);
  const [scrollDown, setScrollDown] = useState(false)

  const listRef = useRef()
  const styles = useStyles(useTheme(), user)

    const onScrollDown = (scrollDown) => {
      setScrollDown(scrollDown)
    }

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
    }, [oauth, setChannels,refresh])


//add members
  return (
    <div css={styles.root}>
    <SidebarList
      onScrollDown={onScrollDown}
      refresh={refresh}
      ref={listRef}
    />
    <SidebarButton setRefresh={setRefresh}/>
  </div>
  );
}
