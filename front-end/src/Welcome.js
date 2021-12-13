
/** @jsxImportSource @emotion/react */
// Layout
import {useContext,useState,useCallback} from 'react';
import axios from 'axios';
import { useTheme } from '@mui/styles';
import { Grid, Typography } from '@mui/material';
import { ReactComponent as ChannelIcon } from './icons/channel.svg';
import { ReactComponent as FriendsIcon } from './icons/friends.svg';
import { ReactComponent as SettingsIcon } from './icons/settings.svg';
import Context from './Context'
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
    display:'flex',
    flexDirection:"column",
    alignItems:"center",
  },
  icon: {
    width: '30%',
    fill: '#fff',
  }
})

export default function Welcome() {
  const [open, setOpen] = useState(false);
  const [channelName, setChannelName] = useState('');
  const {
    oauth,
    channels, setChannels,
    user
  } = useContext(Context)
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const createChannel = useCallback( async () => {
    try{
      await axios.post(
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
        setChannelName('')
      }catch(err){
        console.error(err)
      }
    },[channelName, user.id, oauth.access_token])
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
            <ChannelIcon css={styles.icon} />
            <Button variant="contained" sx={{backgroundColor: 'primary.main'}}onClick={handleClickOpen}>
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
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.card}>
            <FriendsIcon css={styles.icon} />
            <Typography color="textPrimary">
              Invite friends
            </Typography>
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.card}>
            <SettingsIcon css={styles.icon} />
            <Typography color="textPrimary">
              Settings
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
