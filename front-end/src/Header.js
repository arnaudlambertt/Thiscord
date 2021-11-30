
/** @jsxImportSource @emotion/react */
import { useContext } from 'react';
// Layout
import { useTheme } from '@mui/styles';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Button,Box} from "@mui/material";
import Context from './Context';

const useStyles = (theme) => ({
  header: {
    backgroundColor: theme.palette.primary.main,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 20
    },
  },
  menu: {
    [theme.breakpoints.up('sm')]: {
      display: 'none !important',

    },
  }
})

export default function Header() {
  const styles = useStyles(useTheme())
  const {
    oauth, setOauth,
    drawerVisible, setDrawerVisible
  } = useContext(Context)
  const drawerToggle = (e) => {
    setDrawerVisible(!drawerVisible)
  }
  const onClickLogout = (e) => {
    e.stopPropagation()
    setOauth(null)
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
          { oauth ?
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={drawerToggle}
            css={styles.menu}
            >
              <MenuIcon />
          </IconButton>
          : <span></span>
          }
          { oauth ?
            <p>{oauth.email}</p> :
            <p><b>Thiscord</b></p>
          }
          {oauth ?
          <Button variant="contained" sx={{right:5,backgroundColor: 'background.default',height:"90%" }} onClick={onClickLogout}>LOGOUT</Button>
          : <span></span>
          }
          </Box>


    </header>
  );
}
