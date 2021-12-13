
/** @jsxImportSource @emotion/react */
import {useContext,useState,useCallback, useEffect} from 'react';
import axios from 'axios';
// Layout
import {Link} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// Local
import Context from './Context'
import {useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
const styles = {
  root: {
    '& a': {
      padding: '.2rem .5rem',
      whiteSpace: 'nowrap',
    }
  },
}

export default function Channels() {
  const [open, setOpen] = useState(false);
  const [channelName, setChannelName] = useState('');

  const {
    oauth,
    channels, setChannels,
    user
  } = useContext(Context)

  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addChannel = (channel) => {
    setChannels([...channels, channel])
  }

  const createChannel =  async () => {
    try{
      const {data: channel} = await axios.post(
        `http://localhost:3001/channels`,
        {
          name: channelName,
        members: [user.id],
        },
        {
          headers: {
            'Authorization': `Bearer ${oauth.access_token}`
          }
        })
        handleClose()
        addChannel(channel)
        setChannelName('')
      }catch(err){
        console.error(err)
      }
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
      }catch(err){
        console.error(err)
      }
    }
    fetch()
  }, [oauth, setChannels])
  return (
    <ul css={styles.root}>
      <li css={styles.channel}>
        <Link to="/" component={RouterLink}>Welcome</Link>
      </li>
      { channels.map( (channel, i) => (
        <li key={i} css={styles.channel}>
          <Link
            href={`/channels/${channel.id}`}
            onClick={ (e) => {
              e.preventDefault()
              navigate(`/channels/${channel.id}`)
            }}
          >
            {channel.name}
          </Link>
        </li>
      ))}
      <li css={styles.channel}>
      <Button variant="contained" sx={{top:5,left:5,backgroundColor: 'primary.main' }} onClick={handleClickOpen}>
        Create a Channel
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a Channel</DialogTitle>
        <DialogContent>
            <TextField value={channelName} placeholder="channel name" onChange={(e) => { setChannelName(e.target.value) }}/>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={createChannel}>Create</Button>
        </DialogActions>
      </Dialog>
      </li>
    </ul>
  );
}
