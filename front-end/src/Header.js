
/** @jsxImportSource @emotion/react */
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
// Layout
import { useTheme } from '@mui/styles';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Button,Box} from "@mui/material";
import Context from './Context';

const useStyles = (theme, user) => ({
  header: {
    backgroundColor: theme.palette.primary.main,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: user ? 20 : 0
    },
  },
  menu: {
    [theme.breakpoints.up('sm')]: {
      display: 'none !important',

    },
  }
})

export default function Header() {
  const {
    user, setOauth,
    drawerVisible, setDrawerVisible
  } = useContext(Context)
  const navigate = useNavigate()
  const styles = useStyles(useTheme(), user)

  const drawerToggle = (e) => {
    setDrawerVisible(!drawerVisible)
  }
  const onClickLogout = (e) => {
    e.stopPropagation()
    setOauth(null)
    navigate('/')
  }

  return (
    <header css={styles.header}>
    <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={drawerToggle}
            css={styles.menu}
            >
              <MenuIcon />
          </IconButton>
          {user ?
            <p>{user.username}</p> : ''
          }
          <Button variant="contained" sx={{right:5,backgroundColor: 'background.default',height:"90%" }} onClick={onClickLogout}>LOGOUT</Button>
          </Box>
    </header>
  );
}
