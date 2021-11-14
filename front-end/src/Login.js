/** @jsxImportSource @emotion/react */
// Layout
import { useCookies } from 'react-cookie';
import { useEffect,useContext } from 'react';
import {Context} from './Context'
import { useTheme } from '@mui/styles';
import { Button } from '@mui/material';
import crypto from 'crypto';
import axios from 'axios';
import qs from 'qs';

const useStyles = (theme) => ({
  root: {
    flex: '1 1 auto',
    background: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '& > div': {
      margin: `${theme.spacing(1)}`,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    '& fieldset': {
      border: 'none',
      textAlign: 'center',
      '& Button': {
        width: '100%',
      },
    },
  },
})

const authorization_endpoint = 'http://127.0.0.1:5556/dex/auth';
const client_id = 'example-app';
const redirect_uri = 'http://127.0.0.1:3000';
const scope = 'openid%20email%20offline_access';

const base64URLEncode = function(str) {
  return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const sha256 = function(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
};

const generate_redirect_url = (code_verifier) => {

  var code_challenge = base64URLEncode(sha256(code_verifier));
  var url = authorization_endpoint + "?client_id=" + client_id + "&scope=" + scope + "&response_type=code&redirect_uri=" + redirect_uri + "&code_challenge=" + code_challenge + "&code_challenge_method=S256";

  return url;
}

const Grant = ({code_verifier, code, setCookie, removeCookie}) => {
  useEffect( () => {
    const fetch = async () => {
  try {
        const {data: token} = await axios.post('http://127.0.0.1:5556/dex/token', qs.stringify({
          grant_type: 'authorization_code',
          client_id: client_id,
          redirect_uri: redirect_uri,
          code_verifier: code_verifier,
          code: code
        }));
        setCookie('token',token)
        removeCookie('code_verifier')
        window.location.replace(redirect_uri)
  }
  catch (error) {
      console.log(error)
  }
}
fetch()
})
  return(<div></div>)
}

export default function Login({
    onUser
  }) {
    const {login} = useContext(Context)
    const styles = useStyles(useTheme())
    const [cookies, setCookie, removeCookie] = useCookies([]);

    function onClick(redirect_url) {
      window.location.replace(redirect_url)
    }
  const params = new URLSearchParams(window.location.search)
  const params_code = params.get('code')

  if(params_code)
  {
    const code_verifier = cookies.code_verifier;
    return (<Grant code_verifier={code_verifier} code={params_code} setCookie={setCookie} removeCookie={removeCookie} />)
  }
  else if(cookies.token)  //user already logged in
  {
    const {id_token} = cookies.token
    const id_payload = id_token.split('.')[1]
    const {email} = JSON.parse(atob(id_payload))
    login({email: email})
    return(<div></div>)
  }
  else {   //new user
    const code_verifier = base64URLEncode(crypto.randomBytes(32));
    const redirect_url = generate_redirect_url(code_verifier);
    return (
    <div css={styles.root}>
      <div>
        <fieldset>
          <Button variant="contained" type="submit" onClick={ (e) => {
            e.stopPropagation()
            setCookie('code_verifier',code_verifier);
            onClick(redirect_url)
          }}>Login</Button>
        </fieldset>
      </div>
    </div>
    );
  }

}
