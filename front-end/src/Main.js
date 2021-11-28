
/** @jsxImportSource @emotion/react */
import {useState,useContext, useEffect} from 'react'
import { Routes, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import {Context} from './Context'
import { useTheme } from '@mui/styles';
import {Button} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";

// Local
import Channels from './Channels'
import Channel from './Channel'
import Welcome from './Welcome'

const useStyles = (theme) => ({
  main: {
    background: theme.palette.background.default,
    overflow: 'hidden',
    flex: '1 1  auto',
    position: 'relative',
  },
})

export default function Main() {

  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
     setMobileOpen(!mobileOpen);
  };
  const [,, removeCookie] = useCookies([]);
  const styles = useStyles(useTheme());

  const drawer = (
   <Channels />
  );

  const {user, logout, channels, fetchChannels} = useContext(Context)

  const onClick = (e) => {
    e.stopPropagation()
    removeCookie('token')
    logout()
    window.location = '/'
  }

  const Loading = () => {
    useEffect( () => {
       const fetch = async () => {
        await fetchChannels();
      }
      fetch()
    }, [])
    return(<div>loading channel</div>);
  }

  return (
    <main css={styles.main}>
    <Box sx={{ display: "flex" , height : '100%',}}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
            <h1>{user.email}</h1>
            <Button variant="contained" sx={{position: 'absolute', right:20, backgroundColor: 'background.default'}} onClick={onClick}>LOGOUT</Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{     position: 'absolute',
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          height : '100%',
          display: 'flex',
          flexDirection : 'column',
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        <Routes>
          <Route index element={<Welcome />} />
          <Route path="channel/">
            <Route path=":channelid" element={channels ? <Channel channels={channels} /> : <Loading/>} />
          </Route>
        </Routes>
      </Box>
    </Box>

    </main>
  );
}
