
/** @jsxImportSource @emotion/react */
import {useContext} from 'react'
// Layout
import { useTheme } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Drawer,Box } from '@mui/material';
// Local
import Context from './Context'
import Header from './Header'
import Channels from './Channels'
import Channel from './Channel'
import Welcome from './Welcome'
import Footer from './Footer'
import Oups from './Oups'
import {
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'

const useStyles = (theme) => ({
  main: {
    background: theme.palette.background.default,
    overflow: 'hidden',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
  root: {
  display:'flex',
  flexDirection:'column',
  }
})



export default function Main(props) {
const { window } = props;
  const {
    // currentChannel, not yet used
    drawerVisible,setDrawerVisible
  } = useContext(Context)


  const handleDrawerToggle = () => {
    setDrawerVisible(!drawerVisible);
  };
  const container =
  window !== undefined ? () => window().document.body : undefined;
  const theme = useTheme()
  const styles = useStyles(theme)
  const alwaysOpen = useMediaQuery(theme.breakpoints.up('sm'))
  return (
    <main css={styles.main}>
    <Box
      component="nav"
      sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant="temporary"
        open={drawerVisible}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
          }
        }}
      >
        <Channels/>
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
          }
        }}
        open
      >
        <Channels/>
      </Drawer>
    </Box>
      <div style={{width:"100%",display: 'flex', flexDirection: 'column'}}>
      <Header />
      <Routes>
        <Route path="channels/">
          <Route index element={<Navigate to="/oups" />} />
          <Route path=":id" element={<Channel />} />
          <Route path="*" element={<Navigate to="/oups" />} />
        </Route>
        <Route path="/" element={<Welcome />} />
        <Route path="*" element={<Oups />} />
      </Routes>
      <Footer />
      </div>
    </main>
  );
}
