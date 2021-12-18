
/** @jsxImportSource @emotion/react */
// Layout
import {useContext, useState, useCallback} from 'react';
import axios from 'axios';
import { useTheme } from '@mui/styles';
import { Grid,Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Gravatar from 'react-gravatar';
import CropSquareOutlinedIcon from '@mui/icons-material/CropSquareOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { ReactComponent as BigSettingsIcon } from './icons/settings.svg';
import Context from './Context'
import Switch from '@mui/material/Switch';
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from '@mui/material/Typography';
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
    fill:theme.palette.secondary.main,
  }
})

export default function Settings({small}) {
const [chosenPicture, setChosenPicture] = useState('arnaud');
const [openSettings, setOpenSettings] = useState(false);
const [username, setUsername] = useState(false);
const {
  oauth,setOauth,
  mode,setMode,
  user,setUser
} = useContext(Context)
const [usedUsername, setUsedUsername] = useState(false);
const [atUsername, setAtUsername] = useState(user ? user.username.includes('@') : false);
const handleOpenSettings = () => {
  setUsername(user.username)
  setAtUsername(user ? user.username.includes('@') : false)
  setOpenSettings(true);
};
const handleCloseSettings = () => {
  setOpenSettings(false)
  setUsedUsername(false)
  setAtUsername(user ? user.username.includes('@') : false)
};
const handleChangePicture = (event, newChosenPicture) => {
  console.log(newChosenPicture)
  setChosenPicture(newChosenPicture);
};
const toggleTheme = () => {
  setMode(u => u = (u === 'dark' ? 'light' : 'dark'))
}

const applySettings = useCallback( async () => {
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
        theme:mode,
      },
      {
        headers: {
          'Authorization': `Bearer ${oauth.access_token}`
        }
      })
      setOpenSettings(false)
      setUser(returnedUser)
    }
    }catch(err){
      console.error(err)
    }
  }
  ,[username, user, oauth,setUser,mode,usedUsername,atUsername])

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
const editUsername = async (e) =>
{
 setUsername(e.target.value)
 try{
   const {data} = await axios.get(`http://localhost:3001/users?search=${e.target.value}`, {
     headers: {
       'Authorization': `Bearer ${oauth.access_token}`
     }
   })

   if (data.filter(u => u.username === e.target.value).length > 0)
    {
      if(e.target.value!==user.username)
        setUsedUsername(true)
      else
        setUsedUsername(false)

    }
  else {
    setUsedUsername(false)
  }
    if (e.target.value.includes('@'))
    {
      await setAtUsername(true)
    }
    else
    {
      await setAtUsername(false)
    }

 }catch(err){
   console.error(err)
 }
}
const styles = useStyles(useTheme())
return (
  <div>
  {small ?
    <Button variant="text" onClick={handleOpenSettings} >
      <SettingsIcon variant="text" color='terciary' onClick={handleOpenSettings}/>
    </Button>
    :           <Button variant="outlined" sx={{color:'primary.main' }} color='secondary' onClick={handleOpenSettings} >
            <Grid
              container
              direction="column"
            >
              <Grid item xs>
                <BigSettingsIcon css={styles.icon} />
              </Grid>
              <Grid item xs>
                <p>Settings</p>
              </Grid>
            </Grid>
          </Button>
  }
  <Dialog open={openSettings} onClose={handleCloseSettings}>
    <DialogTitle>Settings</DialogTitle>
    <DialogContent>
      {user ?
      <Box sx={{ display:'flex',
         flexDirection:'column'}}>
         <br></br>
        <TextField
          InputProps= {{readOnly: true }}
          value={user.email}
          label="email"
          sx={{width:'100%'}}
        />
        <br></br>
        <TextField
          value={username}
          placeholder="username"
          label="username" sx={{width:'100%'}}
          onChange={editUsername}
        />
      <Typography color="error">{usedUsername ? "This username is already taken"
          : atUsername ? "Your username cannot contain '@'"
          : !username.length ? "Your username cannot be empty" : ""}</Typography>
        <Box sx={{display:'flex',flexDirection:'row', justifyContent: 'space-between'}}>
          <p>Theme:</p>
          <Box sx={{display: 'flex', flexDirection: 'row'}}>
            <p>Dark</p>
            <Switch sx={{top:7}}
              checked={mode==='light'}
              onChange={toggleTheme}
            />
            <p>Light</p>
          </Box>
        </Box>
      <ToggleButtonGroup sx={{top:10}} value={chosenPicture} onChange={handleChangePicture} exclusive={true} size="large">
      <ToggleButton sx={{position:'relative',width:100,height:100}} value="gravatar" key="gravatar">
       <Gravatar style={{borderRadius:100,width:100,height:100}} email={user.email} size={300}/>
        {chosenPicture==='gravatar'? (
            <div
              style={{
                position: "absolute",
                color: "#00BB00",
                top: "50%",
                left: "50%",
                transform: "translateX(-50%) translateY(-50%)"
              }}
            >
              {" "}
              <Box sx={{width:95,height:95,border:5,borderColor:'#FFF',borderRadius:'50%'}} />{" "}
            </div>
          ) : (
            ""
          )}
      </ToggleButton>
      <ToggleButton sx={{position:'relative',width:100,height:100}} value="arnaud" key="arnaud">
        <img src='./arnaud.jpeg' style={{borderRadius: "100%"}} width="100" height="100" />
        {chosenPicture==='arnaud'? (
            <div
              style={{
                position: "absolute",
                color: "#00BB00",
                top: "50%",
                left: "50%",
                transform: "translateX(-50%) translateY(-50%)"
              }}
            >
              {" "}
              <Box sx={{width:95,height:95,border:5,borderColor:'#FFF',borderRadius:'50%'}} />{" "}
            </div>
          ) : (
            ""
          )}
      </ToggleButton>
        <ToggleButton sx={{position:'relative',width:100,height:100}} value="clement" key="clement">
          <img src='./clement.jpg' style={{borderRadius: "100%"}} width="100" height="100" />
          {chosenPicture==='clement'? (
              <div
                style={{
                  position: "absolute",
                  color: "#00BB00",
                  top: "50%",
                  left: "50%",
                  transform: "translateX(-50%) translateY(-50%)"
                }}
              >
                {" "}
                <Box sx={{width:95,height:95,border:5,borderColor:'#FFF',borderRadius:'50%'}} />{" "}
              </div>
            ) : (
              ""
            )}
        </ToggleButton>
        <ToggleButton sx={{position:'relative',width:100,height:100}} value="david" key="david">
          <img src='./david.png' style={{borderRadius: "100%"}} width="100" height="100" />
          {chosenPicture==='david'? (
              <div
                style={{
                  position: "absolute",
                  color: "#00BB00",
                  top: "50%",
                  left: "50%",
                  transform: "translateX(-50%) translateY(-50%)"
                }}
              >
                {" "}
                <Box sx={{width:95,height:95,border:5,borderColor:'#FFF',borderRadius:'50%'}} />{" "}
              </div>
            ) : (
              ""
            )}
        </ToggleButton>
        <ToggleButton sx={{position:'relative',width:100,height:100}} value="sergei" key="sergei">
          <img src='./sergei.jpg' style={{borderRadius: "100%"}} width="100" height="100" />
          {chosenPicture==='sergei'? (
              <div
                style={{
                  position: "absolute",
                  color: "#FFFFFF",
                  top: "50%",
                  left: "50%",
                  transform: "translateX(-50%) translateY(-50%)"
                }}
              >
                {" "}
                <Box sx={{width:95,height:95,border:5,borderColor:'#FFF',borderRadius:'50%'}} />{" "}
              </div>
            ) : (
              ""
            )}
        </ToggleButton>
      </ToggleButtonGroup>
      <Button variant="contained" color='error' onClick={deleteUser}>
        Delete user
      </Button>
    </Box>
      :''
    }
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseSettings}>Cancel</Button>
        <Button variant="contained" onClick={applySettings}>Save settings</Button>
    </DialogActions>
  </Dialog>
  </div>
)
}
