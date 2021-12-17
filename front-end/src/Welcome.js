
/** @jsxImportSource @emotion/react */
// Layout
import {useContext, useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import { useTheme } from '@mui/styles';
import { Grid,Box } from '@mui/material';
import { ReactComponent as ChannelIcon } from './icons/channel.svg';
import { ReactComponent as FriendsIcon } from './icons/friends.svg';
import { ReactComponent as SettingsIcon } from './icons/settings.svg';
import Context from './Context'
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
const useStyles = (theme) => ({
  root: {
    height: '100%',
    flex: '1 1 auto',
    display: 'flex',
    // background: 'rgba(0,0,0,.2)',
  },
  card: {
    textAlign: 'center',
    alignItems:"center",
  },
  icon: {
    width: '50%',
    fill: '#fff',
  }
})

export default function Welcome() {
  const [openSettings, setOpenSettings] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate()
  const {
    oauth,setOauth,
    channels, setChannels,
    setCurrentChannel,
    setDarkTheme,darkTheme,
    user,setUser
  } = useContext(Context)



  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
  };
  const themeSwitch = () => {
    setDarkTheme(!darkTheme);
  };
  const handleOpenSettings = () => {
    setUsername(user.username)
    setOpenSettings(true);
  };
  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  useEffect( () => {
    setCurrentChannel(null)
  }, [setCurrentChannel])

  const applySettings = useCallback( async () => {
    try{
        const {data: returnedUser} = await axios.put(
        `http://localhost:3001/users/${user.id}`,
        {
          id: user.id,
          username: username,
          email: user.email,
          channels: user.channels
        },
        {
          headers: {
            'Authorization': `Bearer ${oauth.access_token}`
          }
        })
        setOpenSettings(false)
        setUser(returnedUser)
      }catch(err){
        console.error(err)
      }
    },[username, user, oauth,setUser])

    const deleteUser = async () => {
      try{
        await axios.delete(
          `http://localhost:3001/users/${user.id}`,
          {
          headers: {
            'Authorization': `Bearer ${oauth.access_token}`
          }
        })
        setOauth(null)
      }catch(err){
        console.log(err)
      }
    }

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
          <Button variant="outlined" sx={{color:'primary.main' }} color="secondary" >
            <Grid
              container
              direction="column"
            >
              <Grid item xs>
                <FriendsIcon css={styles.icon} />
              </Grid>
              <Grid item xs>
                <p>Invite Friends</p>
              </Grid>
            </Grid>
          </Button>
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.card}>
          <Button variant="outlined" sx={{color:'primary.main' }} color="secondary" onClick={handleOpenSettings} >
            <Grid
              container
              direction="column"
            >
              <Grid item xs>
                <SettingsIcon css={styles.icon} />
              </Grid>
              <Grid item xs>
                <p>Settings</p>
              </Grid>
            </Grid>
          </Button>
          <Dialog open={openSettings} onClose={handleCloseSettings}>
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>
              {user ?
              <div>
                <h3>Your profile</h3>
                <p>email: {user.email}</p>
                <TextField value={username} placeholder="username" label="username" sx={{width:'100%'}}onChange={(e) => { setUsername(e.target.value) }}/>
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                  <p>light theme</p>
                  <Switch sx={{top:7}}
                    checked={darkTheme}
                    onChange={themeSwitch}
                  />
                </Box>
                <Button variant="contained" color='error' sx={{left: 10,top:10,width:'30%'}} onClick={deleteUser}>
                  Delete user
                </Button>
              </div>
                :''
              }

            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseSettings}>Cancel</Button>
                <Button variant="contained" onClick={applySettings}>Apply Changes</Button>
            </DialogActions>
          </Dialog>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
