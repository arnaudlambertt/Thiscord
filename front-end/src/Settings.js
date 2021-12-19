
/** @jsxImportSource @emotion/react */
// Layout
import {useContext, useState, useCallback} from 'react';
import axios from 'axios';
import { useTheme,styled } from '@mui/styles';
import { Grid,Box} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
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
import Gravatar from 'react-gravatar';
import PortraitIcon from '@mui/icons-material/Portrait';
import { DropzoneAreaBase } from 'material-ui-dropzone';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#aab4be' : '#8796A5',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#aab4be':'#8796A5',
    borderRadius: 20 / 2,
  },
}));

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
const {
    oauth,setOauth,
    mode,setMode,
    user,setUser
  } = useContext(Context)
const [chosenPicture, setChosenPicture] = useState(null);
const [openSettings, setOpenSettings] = useState(false);
const [username, setUsername] = useState(false);
const [usedUsername, setUsedUsername] = useState(false);
const [atUsername, setAtUsername] = useState(user ? user.username.includes('@') : false);
const [openImageSettings, setOpenImageSettings] = useState(false);
const [openImageUpload, setOpenImageUpload] = useState(false);
const [openImageSelection, setOpenImageSelection] = useState(false);
const [importedImage, setImportedImage] = useState(null);

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
  setChosenPicture(newChosenPicture);
};
const toggleTheme = () => {
  setMode(u => u = (u === 'dark' ? 'light' : 'dark'))
}

const handleOpenImageUpload = () => {
  setImportedImage(null);
  setOpenImageUpload(true);
};
const handleCloseImageUpload = () => {
  setOpenImageUpload(false);
};
const handleOpenImageSelection = () => {
  setChosenPicture(null)
  setOpenImageSelection(true);
};
const handleCloseImageSelection = () => {
  setOpenImageSelection(false);
};
const handleOpenImageSettings = () => {
  setOpenImageSettings(true);
};
const handleCloseImageSettings = () => {
  setOpenImageSettings(false);
};

const applyImageSelection = async () => {
  try{
    if(chosenPicture)
    {
      const {data: returnedUser} = await axios.put(
      `http://localhost:3001/users/${user.id}`,
      {
        id: user.id,
        username: user.username,
        email: user.email,
        channels: user.channels,
        theme:user.theme,
        avatar:chosenPicture
      },
      {
        headers: {
          'Authorization': `Bearer ${oauth.access_token}`
        }
      })
      setOpenImageSelection(false)
      setOpenImageSettings(false)
      setUser(returnedUser)
    }
    }catch(err){
      console.error(err)
    }
}
const applyImageGravatar = async () => {
  try{
      const {data: returnedUser} = await axios.put(
      `http://localhost:3001/users/${user.id}`,
      {
        id: user.id,
        username: user.username,
        email: user.email,
        channels: user.channels,
        theme:user.theme,
        avatar:'gravatar'
      },
      {
        headers: {
          'Authorization': `Bearer ${oauth.access_token}`
        }
      })
      setOpenImageSettings(false)
      setUser(returnedUser)
    }catch(err){
      console.error(err)
    }
}
const applyImageUpload = async () => {
  try{
    if(importedImage)
    {
      const {data: returnedUser} = await axios.put(
      `http://localhost:3001/users/${user.id}`,
      {
        id: user.id,
        username: user.username,
        email: user.email,
        channels: user.channels,
        theme:user.theme,
        avatar:importedImage
      },
      {
        headers: {
          'Authorization': `Bearer ${oauth.access_token}`
        }
      })
      setOpenImageUpload(false)
      setOpenImageSettings(false)
      setUser(returnedUser)
    }
    }catch(err){
      console.error(err)
    }
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
        avatar:user.avatar
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

const uploadImage = async (loadedFiles) => {
  setImportedImage(loadedFiles[0].data)
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
           flexDirection:'column', width: { xs: "240px", sm: "400px" }}}>
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
            <MaterialUISwitch sx={{ m: 1 }} checked={mode==='dark'} onChange={toggleTheme}/>
          </Box>
        Avatar:
        <Button onClick={handleOpenImageSettings}>
        {user.avatar==='gravatar' ? <Gravatar size={100} email={user.email}/> : <img src={user.avatar} alt="your avatar" width='100' height='100'/>}
        </Button>
        <Dialog open={openImageSettings} onClose={handleCloseImageSettings}>
          <Button onClick={applyImageGravatar}>use my gravatar</Button>
          <Button onClick={handleOpenImageSelection} > choose from a selection</Button>
          <Button onClick={handleOpenImageUpload} > upload your own image</Button>
        </Dialog>
          <Dialog open={openImageUpload} onClose={handleCloseImageUpload}>
            <DialogTitle>Image settings</DialogTitle>
            <DialogContent>
              <Box sx={{position: 'relative', width: { xs: "240px", sm: "400px" }}}>
                <DropzoneAreaBase
                  Icon={PortraitIcon}
                  acceptedFiles={['image/*']}
                  dropzoneText={"Drag and drop an image here or click"}
                  onAdd={uploadImage}
                  filesLimit={1}
                  showAlerts={false}
                />
                {importedImage ?
                  <Box sx={{position: "absolute", top: "62%", left: "50%"}}>
                    <img src={importedImage} alt="importedImage" width='175' height='175'
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translateX(-50%) translateY(-50%)"
                      }}/>
                    <Box sx={{width:175,height:175,border:2,borderColor:'#FFF',borderRadius:'50%', position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translateX(-50%) translateY(-50%)"}}>
                      </Box>
                    </Box>: ''}
              </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseImageUpload}>Cancel</Button>
                <Button onClick={applyImageUpload} variant="contained">Save image settings</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openImageSelection} onClose={handleCloseImageSelection}>
            <DialogTitle>Choose from selection</DialogTitle>
            <ToggleButtonGroup sx={{padding:2}} value={chosenPicture} onChange={handleChangePicture} exclusive={true} size="large">
            <ToggleButton sx={{position:'relative',width:100,height:100}} value='http://localhost:3000/arnaud.jpeg' key="arnaud">
              <img src='http://localhost:3000/arnaud.jpeg' style={{borderRadius: "100%"}} width="100" height="100" alt='arnaud'/>
              {chosenPicture==='http://localhost:3000/arnaud.jpeg'?
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
                 : ''}
            </ToggleButton>
              <ToggleButton sx={{position:'relative',width:100,height:100}} value='http://localhost:3000/clement.jpg' key="clement">
                <img src='http://localhost:3000/clement.jpg' style={{borderRadius: "100%"}} width="100" height="100" alt='clement'/>
                {chosenPicture==='http://localhost:3000/clement.jpg'?
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
                   : ''}
              </ToggleButton>
              <ToggleButton sx={{position:'relative',width:100,height:100}} value='http://localhost:3000/david.png' key="david">
                <img src='http://localhost:3000/david.png' style={{borderRadius: "100%"}} width="100" height="100" alt='david'/>
                {chosenPicture==='http://localhost:3000/david.png'?
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
                   : ''}
              </ToggleButton>
              <ToggleButton sx={{position:'relative',width:100,height:100}} value='http://localhost:3000/sergei.jpg' key='./sergei.jpg'>
                <img src='http://localhost:3000/sergei.jpg' style={{borderRadius: "100%"}} width="100" height="100" alt='sergei'/>
                {chosenPicture==='http://localhost:3000/sergei.jpg'?
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
                   : ''}
              </ToggleButton>
            </ToggleButtonGroup>
            <DialogActions>
                <Button onClick={handleCloseImageSelection}>Cancel</Button>
                <Button onClick={applyImageSelection} variant="contained">Save image settings</Button>
            </DialogActions>
          </Dialog>
        <Button variant="contained" color='error' onClick={deleteUser}>
          Delete user
        </Button>
      </Box>
        : '' }
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseSettings}>Cancel</Button>
        <Button variant="contained" onClick={applySettings}>Save settings</Button>
    </DialogActions>
  </Dialog>
  </div>
)
}
