/** @jsxImportSource @emotion/react */
// Layout
import { useTheme } from '@mui/styles';
import { Button,TextField } from '@mui/material'

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

export default function Login({
  onUser
}) {
  const styles = useStyles(useTheme())
  return (
    <div css={styles.root}>
      <div>
        <fieldset>
          <TextField id="username" name="username" label="Username" variant="filled" />
        </fieldset>
        <fieldset>
          <TextField id="password" name="password" type="password" label="Password" variant="filled" />
        </fieldset>
        <fieldset>
          <Button variant="contained" type="submit" onClick={ (e) => {
            e.stopPropagation()
            onUser({username: 'david'})
          }}>Login</Button>
        </fieldset>
      </div>
    </div>
  );
}
