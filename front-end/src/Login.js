
/** @jsxImportSource @emotion/react */
import { useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import crypto from 'crypto'
import qs from 'qs'
import axios from 'axios'
// Layout
import { useTheme } from '@mui/styles';
import Blog from './landing/Blog'
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link,AppBar,Toolbar,Box,Button,Grid } from '@mui/material';
// Local
import Context from './Context'
import {
  useNavigate
} from "react-router-dom";

const base64URLEncode = (str) => {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

const sha256 = (buffer) => {
  return crypto
    .createHash('sha256')
    .update(buffer)
    .digest()
}

const useStyles = (theme) => ({
  root: {
    flex: '1 1 auto',
    width:'100%',
    background: theme.palette.background.default,
    display: 'flex',
    flexDirection:'column',
    gap:'20px',
    alignItems: 'center',
    overflow:'auto',
  },
})

const Redirect = ({
  config,
  codeVerifier,
}) => {
  const styles = useStyles(useTheme())
  const redirect = (e) => {
    e.stopPropagation()
    const code_challenge = base64URLEncode(sha256(codeVerifier))
    const url = [
      `${config.authorization_endpoint}?`,
      `client_id=${config.client_id}&`,
      `scope=${config.scope}&`,
      `response_type=code&`,
      `redirect_uri=${config.redirect_uri}&`,
      `code_challenge=${code_challenge}&`,
      `code_challenge_method=S256`,
    ].join('')
    window.location = url
  }
  return (
    <div css={styles.root}>
    <header style={{width:'100%'}}>
      <Box
        sx={{
        display: 'flex',
        width:'100%',
        height:50,
        backgroundColor:'primary.main',
        alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            width:'100%',
            height:50,
            alignItems: 'center',
          }}
        >
        <Box sx={{width:{ xs:0, sm:200 }}}>
          <p></p>
        </Box>
            <Box sx={{width:200,transform:'translateX(+50px)'}}>
              <p><b>Thiscord</b></p>
            </Box>
            <Button variant="contained" color='secondary' sx={{right:5,height:"80%",width:200}} onClick={redirect}> <GitHubIcon sx={{marginRight:3}}/>  Login with Github </Button>
        </Box>
      </Box>
    </header>
    <Blog/>
    </div>
  )
}

const Tokens = ({
  oauth
}) => {
  const {setOauth} = useContext(Context)
  const styles = useStyles(useTheme())
  const {id_token} = oauth
  const id_payload = id_token.split('.')[1]
  const {email} = JSON.parse(atob(id_payload))
  const logout = (e) => {
    e.stopPropagation()
    setOauth(null)
  }
  return (
    <div css={styles.root}>
      Welcome {email} <Link onClick={logout} color="secondary">logout</Link>
    </div>
  )
}

const LoadTokenUser = ({
  code,
  codeVerifier,
  config,
  removeCookie,
  setOauth,
  setUser
}) => {
  const styles = useStyles(useTheme())
  const navigate = useNavigate();
  useEffect( () => {
    const fetch = async () => {
      try {
        const {data: oauth} = await axios.post(
          config.token_endpoint
        , qs.stringify ({
          grant_type: 'authorization_code',
          client_id: `${config.client_id}`,
          code_verifier: `${codeVerifier.verifier}`,
          redirect_uri: `${config.redirect_uri}`,
          code: `${code}`,
        }))
        removeCookie('code_verifier', {path: '/'})
        const {data: user} = await axios.get('http://localhost:3001/signin',{
          headers: {
            'Authorization': `Bearer ${oauth.access_token}`
          }
        })
        setOauth(oauth)
        setUser(user)
        navigate(codeVerifier.source)
      }catch (err) {
        console.error(err)
      }
    }
    fetch()
  })
  return (
    <div css={styles.root}>Loading tokens</div>
  )
}

export default function Login({
  onUser
}) {
  const styles = useStyles(useTheme());
  // const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const {oauth, setOauth, setUser} = useContext(Context)
  const config = {
    authorization_endpoint: 'http://localhost:5556/dex/auth',
    token_endpoint: 'http://localhost:5556/dex/token',
    client_id: 'webtech-frontend',
    redirect_uri: 'http://localhost:3000',
    scope: 'openid%20email%20offline_access',
  }
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  // is there a code query parameters in the url
  if(!code){ // no: we are not being redirected from an oauth server
    if(!oauth){
      const codeVerifier = base64URLEncode(crypto.randomBytes(32))
      setCookie('code_verifier', { verifier: codeVerifier, source: window.location.pathname }, {path: '/'})
      return (
        <div css={styles.root}>
          <Redirect codeVerifier={codeVerifier} config={config} css={styles.root} />
        </div>
      )
    }else{ // yes: user is already logged in, great, is is working
      return (
        <Tokens oauth={oauth} css={styles.root} />
      )
    }
  }else{ // yes: we are coming from an oauth server
    return (
      <LoadTokenUser
        code={code}
        codeVerifier={cookies.code_verifier}
        config={config}
        setOauth={setOauth}
        setUser={setUser}
        removeCookie={removeCookie} />
    )
  }
}
