
/** @jsxImportSource @emotion/react */

import {useContext,useState} from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import Context from '../Context'

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/styles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const useStyles = (theme) => ({
  button: {
    display: 'flex',
    height:87,
    flexDirection:'column'
  },
})

export default function SidebarButton(){
  const {
    oauth,
    channels, setChannels,
    currentChannel,
    user
  } = useContext(Context)

  const navigate = useNavigate();

  const [channelNameCreate, setchannelNameCreate] = useState('');
  const [channelName, setChannelName] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openParameters, setOpenParameters] = useState(false);
  const [userList, setUserList] = useState([]);
  const [members, setMembers] = useState([]);

  const styles = useStyles(useTheme(), user)

  const handleOpenCreate = () => {
    setOpenCreate(true)
  }

  const handleCloseCreate = () => {
    setOpenCreate(false)
  }

  const handleCloseParameters = () => {
    setOpenParameters(false)
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
        setUserList(data.concat(members))
      }catch(err){
        console.error(err)
      }
    }
    else
      setUserList([])
  }

  const updateCurrentChannel = async() => {
    try{
      const {data: updatedChannel} = await axios.put(
        `http://localhost:3001/channels/${currentChannel.id}`,
        {
          name: channelName,
          members: members.map(a => a.id)
        },
        {
          headers: {
            'Authorization': `Bearer ${oauth.access_token}`
          },
      })
      channels.splice(channels.findIndex(e => e.id === currentChannel.id),1,updatedChannel)
      setChannels([...channels])
      handleCloseParameters()
    }catch(err){
      console.error(err)
    }
  }

  const leaveChannel = async() => {
    try{
      members.splice(members.findIndex(e => e.id === user.id),1)
      setMembers([...members])
      await axios.put(
        `http://localhost:3001/channels/${currentChannel.id}`,
        {
          members: members.map(a => a.id)
        },
        {
          headers: {
            'Authorization': `Bearer ${oauth.access_token}`
          },
      })
      handleCloseParameters()
      navigate(`/`)
      removeChannel()
    }catch(err){
      console.error(err)
    }
  }

  const handleOpenParameters = async() => {
    setChannelName(currentChannel.name)
    {
      const initMembers = []
      for(const memberId of currentChannel.members)
      {
        try{
          const {data: member} = await axios.get(`http://localhost:3001/users/${memberId}`, {
            headers: {
              'Authorization': `Bearer ${oauth.access_token}`
            }
          })
          initMembers.push(member)
        }catch(err){
          console.error(err)
        }
      }
      setMembers(initMembers)
    }
    setOpenParameters(true)
  }

  const createChannel =  async () => {
    try{
      const {data: channel} = await axios.post(
        `http://localhost:3001/channels`,
        {
          name: channelNameCreate,
          members: [user.id],
        },
        {
          headers: {
            'Authorization': `Bearer ${oauth.access_token}`
          }
        })
        handleCloseCreate()
        addChannel(channel)
        navigate(`/channels/${channel.id}`)
        setchannelNameCreate('')
    }catch(err){
      console.error(err)
    }
  }

  const addChannel = (channel) => {
    setChannels([...channels, channel])
  }
  const removeChannel = () => {
    channels.splice(members.findIndex(e => e.id === currentChannel.id),1)
    setChannels([...channels])
  }
  const addMember = (e,member) => {
    setMembers(member)
  }

return(
  <div css={styles.button}>
  <div>
    <Button variant="contained" sx={{top:5,left:5,right:5,backgroundColor: 'primary.main',  width:'calc(100% - 10px)'}} onClick={handleOpenCreate}>
      Create a Channel
    </Button>
    <Dialog open={openCreate} onClose={handleCloseCreate}>
      <DialogTitle>Create a Channel</DialogTitle>
      <DialogContent>
          <TextField value={channelNameCreate} placeholder="channel name" onChange={(e) => { setchannelNameCreate(e.target.value) }}/>
      </DialogContent>
      <DialogActions>
          <Button onClick={handleCloseCreate}>Cancel</Button>
          <Button variant="contained" sx={{backgroundColor: 'primary.main' }} onClick={createChannel}>Create</Button>
        </DialogActions>
    </Dialog>
  </div>
  {currentChannel ?
    <div>
    <Button variant="contained" sx={{top:10,left:5,right:5,backgroundColor: 'primary.main',width:'calc(100% - 10px)'}} onClick={handleOpenParameters}>
      Channel parameters
    </Button>
    <Dialog open={openParameters} onClose={handleCloseParameters} >
      <DialogTitle>Channel Parameters</DialogTitle>
      <DialogContent sx={{display:'flex',flexDirection:'column'}}>
      <DialogContentText>
        Manage members
      </DialogContentText>
      <Autocomplete
             multiple
             id="tags-outlined"
             options={userList}
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
          <TextField value={channelName} onChange={(e) => {setChannelName(e.target.value)}}/>
          <div>
      <Button variant="contained" color='error' sx={{top:10,width:'30%'}}  onClick={leaveChannel}>
        Leave Channel
      </Button>
      <Button variant="contained" color='error' sx={{left: 10,top:10,width:'30%'}}>
        Delete Channel
      </Button>
      </div>
      </DialogContent>
      <DialogActions>
          <Button sx={{color: 'primary.main' }} onClick={handleCloseParameters}>Cancel</Button>
          <Button variant="contained" sx={{backgroundColor: 'primary.main' }} onClick={updateCurrentChannel}>Apply changes</Button>
      </DialogActions>
    </Dialog>
    </div>
     : ""}
</div>
)
}
