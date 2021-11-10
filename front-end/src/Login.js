/** @jsxImportSource @emotion/react */
// Layout
import { useCookies } from 'react-cookie';
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
const scope = 'openid';

const base64URLEncode = (str) => {
  return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const sha256 = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest();
};

const generate_redirect_url = (code_verifier) => {

  var code_challenge = base64URLEncode(sha256(code_verifier));
  var url = authorization_endpoint + "?" + "client_id=" + client_id + "&" + "scope=" + (scope.concat('%20')) + "&" + "response_type=code&" + "redirect_uri=" + redirect_uri + "&" + "code_challenge=" + code_challenge + "&" + "code_challenge_method=S256";

  return url;
}

const grant = async (code_verifier, code) => {
  try {
        const data = await axios.post("http://127.0.0.1:5556/dex/token", qs.stringify({
          grant_type: 'authorization_code',
          client_id: "" + 'example-app',
          redirect_uri: "" + redirect_uri,
          client_secret: 'ZXhhbXBsZS1hcHAtc2VjcmV0',
          code_verifier: "" + code_verifier,
          code: "" + code
        }))

        return data;
  }
  catch (_error) {
      var err = _error;
    return err.data;
  }
}

export default function Login({
  onUser
}) {
  const styles = useStyles(useTheme())
  const [cookies, setCookie, removeCookie] = useCookies([]);

  function onClick(redirect_url) {
    window.location.replace(redirect_url)
  }
  const params = new URLSearchParams(window.location.search)
  const params_code = params.get('code')

  if(params_code)
  {
    const code_verifier_cookie = cookies.code_verifier;
    const token = grant(code_verifier_cookie,params_code);
    removeCookie('code_verifier');
    setCookie('token', token);
    //window.location.replace('http://localhost:3000')
  }
  else if(cookies.token)  //user already logged in
  {
    return(<div>{onUser({username: 'david'})}</div>)
  }
  else {   //new user
    const code_verifier = base64URLEncode(crypto.randomBytes(32));
    setCookie('code_verifier',code_verifier);
    const redirect_url = generate_redirect_url(code_verifier);
    return (
    <div css={styles.root}>
      <div>
        <fieldset>
          <Button variant="contained" type="submit" onClick={ (e) => {
            e.stopPropagation()
            onClick(redirect_url)
          }}>Login</Button>
        </fieldset>
      </div>
    </div>
    );
  }

}
