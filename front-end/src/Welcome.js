
/** @jsxImportSource @emotion/react */
// Layout
import {useContext, useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import { useTheme } from '@mui/styles';
import Settings from './Settings'
import { Grid} from '@mui/material';
import { ReactComponent as ChannelIcon } from './icons/channel.svg';
import Context from './Context'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
const useStyles = (theme) => ({
  root: {
    height: '100%',
    flex: '1 1 auto',
    display: 'flex',
  },
  card: {
    textAlign: 'center',
    alignItems:"center",
  },
  icon: {
    width: '50%',
    fill:theme.palette.secondary.main,
  }
})

export default function Welcome() {
  const [usedUsername, setUsedUsername] = useState(false);
  const [username, setUsername] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [channelName, setChannelName] = useState('');
  const navigate = useNavigate()
  const {
    oauth,
    channels, setChannels,
    setCurrentChannel,
    user,setUser
  } = useContext(Context)
  const [openUsernameDialog, setOpenUsernameDialog] = useState(user ? user.username.includes('@') : false);
  const [atUsername, setAtUsername] = useState(user ? user.username.includes('@') : false);

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  useEffect( () => {
    setOpenUsernameDialog(user ? user.username.includes('@'): false)
  }, [user])

  useEffect( () => {
    setCurrentChannel(null)
  }, [setCurrentChannel])

  const editUsername = async (e) => {
   setUsername(e.target.value)
   try{
     const {data} = await axios.get(`http://localhost:3001/users?search=${e.target.value}`, {
       headers: {
         'Authorization': `Bearer ${oauth.access_token}`
       }
     })
     setUsedUsername(data.filter(u => u.username === e.target.value).length && e.target.value !== user.username)
     setAtUsername(e.target.value.includes('@'))

   }catch(err){
     console.error(err)
   }
  }
  const applyUsername = useCallback( async () => {
    try{
      if(!usedUsername && !atUsername && username.length>0)
      {
        const {data: returnedUser} = await axios.put(
        `http://localhost:3001/users/${user.id}`,
        {
          id: user.id,
          username: username,
          email: user.email,
          channels: user.channels,
          theme:user.theme,
          avatar:user.avatar
        },
        {
          headers: {
            'Authorization': `Bearer ${oauth.access_token}`
          }
        })
        setOpenUsernameDialog(false)
        setUser(returnedUser)
      }
      }catch(err){
        console.error(err)
      }
    }
    ,[username, user, oauth,setUser,usedUsername,atUsername])
  const createChannel = useCallback( async () => {
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
        setChannels([...channels, channel])
        navigate(`/channels/${channel.id}`)
        setChannelName('')
      }catch(err){
        console.error(err)
      }
    },[channelName,navigate, user, oauth, setChannels,channels])

  const styles = useStyles(useTheme())
  return (
    <div css={styles.root}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={5}
      >
        <Grid item xs>
          <div css={styles.card}>
            <Button variant="outlined" sx={{color:'primary.main' }} color="secondary" onClick={handleOpenCreate}>
              <Grid
                container
                direction="column"
              >
                <Grid item xs>
                  <ChannelIcon css={styles.icon} />
                </Grid>
                <Grid item xs>
                  <p>Create a Channel</p>
                </Grid>
              </Grid>
            </Button>

            <Dialog open={openCreate} onClose={handleCloseCreate}>
              <DialogTitle>Create a Channel</DialogTitle>
              <DialogContent>
                  <TextField value={channelName} placeholder="channel name" onChange={(e) => { setChannelName(e.target.value) }}/>
              </DialogContent>
              <DialogActions>
                  <Button onClick={handleCloseCreate}>Cancel</Button>
                  <Button variant="contained" onClick={createChannel}>Create</Button>
              </DialogActions>
            </Dialog>
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.card}>
            <Settings small={false}/>
          </div>
        </Grid>
      </Grid>
      <Dialog
        fullScreen
        open={openUsernameDialog}
      >
        <DialogContent sx={{backgroundColor:'background.paper'}}>
          <Box sx={{position:'absolute',top:100,left:'50%',transform:'translateX(-50%)'}}>
            <Typography><b>Welcome to Thiscord ! </b> <br/>please choose a username</Typography>
            <TextField
              value={username}
              label="username" sx={{width:'300px',marginTop:1}}
              onChange={editUsername}
            />
            <Typography color="error">{usedUsername ? "This username is already taken"
                : atUsername ? "Your username cannot contain '@'"
                : !username.length ? "Your username cannot be empty" : ""}
            </Typography>
            <Button variant='contained' color='primary' onClick={applyUsername}>
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
