
/** @jsxImportSource @emotion/react */
import {useContext,useState,useEffect} from 'react';
import axios from 'axios';
// Layout
import {Link} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// Local
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Context from './Context'
import { useTheme } from '@mui/styles';
import {useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const useStyles = (theme) => ({
  root: {
    '& a': {
      padding: '.2rem .5rem',
      whiteSpace: 'nowrap',
    }
  },
})

export default function Channels() {
  const {
    oauth,
    channels, setChannels,
    currentChannel,
    user
  } = useContext(Context)

  const [openCreate, setOpenCreate] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [openParameters, setOpenParameters] = useState(false);
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);

  const navigate = useNavigate();
  const styles = useStyles(useTheme())
  const handleClickOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleClickOpenParameters = () => {
    setOpenParameters(true);
  };

  const handleCloseParameters = () => {
    setOpenParameters(false);
  };

  const addChannel = (channel) => {
    setChannels([...channels, channel])
  }
  const addMember = (e,member) => {
    setMembers(member)
  }

  const fetchUsers = async (e,value) => {
    if(value.length > 0)
    {
      try{
        const {data} = await axios.get(`http://localhost:3001/users?search=${value}`, {
          headers: {
            'Authorization': `Bearer ${oauth.access_token}`
          }
        })
        setUsers(data)
      }catch(err){
        console.error(err)
      }
    }
    else
      setUsers([])
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
        handleCloseCreate()
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

  useEffect( () => {
    const fetchMembers = async () => {
      if(!members.length && currentChannel)
      {
        for(const memberId of currentChannel.members)
        {
          try{
            const {data: member} = await axios.get(`http://localhost:3001/users/${memberId}`, {
              headers: {
                'Authorization': `Bearer ${oauth.access_token}`
              }
            })
          setMembers([...members,member])
          }catch(err){
            console.error(err)
          }
        }
      }
    }
    fetchMembers()
  })

//add members
  return (
    <div css={styles.root}>
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
    <div>
      <Button variant="contained" sx={{top:5,left:5,backgroundColor: 'primary.main' }} onClick={handleClickOpenCreate}>
        Create a Channel
      </Button>
      <Dialog open={openCreate} onClose={handleCloseCreate}>
        <DialogTitle>Create a Channel</DialogTitle>
        <DialogContent>
            <TextField value={channelName} placeholder="channel name" onChange={(e) => { setChannelName(e.target.value) }}/>
          </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseCreate}>Cancel</Button>
            <Button variant="contained" sx={{backgroundColor: 'primary.main' }} onClick={createChannel}>Create</Button>
          </DialogActions>
      </Dialog>
    </div>
    {currentChannel ?
      <div>
        <Button variant="contained" sx={{top:10,left:5,backgroundColor: 'primary.main' }} onClick={handleClickOpenParameters}>
          Channel parameters
        </Button>
        <Dialog open={openParameters} onClose={handleCloseParameters}>
          <DialogTitle>Channel Parameters</DialogTitle>
          <DialogContent>
          <DialogContentText>
            Manage members
          </DialogContentText>
          <Autocomplete
               multiple
               id="tags-outlined"
               options={users}
               getOptionLabel={(option) => option.username}
               value={members}
               filterSelectedOptions
               onInputChange={fetchUsers}
               onChange={addMember}
               isOptionEqualToValue={(option,value) => option.id === value.id}
               renderInput={(params) => (
                 <TextField
                   {...params}
                   sx={{color:'#ffffff'}}
                   placeholder="type a username"
                 />
               )}
             />
            <DialogContentText>
              Change channel name
            </DialogContentText>
            <TextField defaultValue={currentChannel.name}/>
          </DialogContent>
          <DialogActions>
            <Button sx={{color: 'primary.main' }} onClick={handleCloseParameters}>Cancel</Button>
            <Button variant="contained" sx={{backgroundColor: 'primary.main' }} onClick={handleCloseParameters}>Apply changes</Button>
          </DialogActions>
        </Dialog>
      </div>
       : ""}
  </div>
  );
}
