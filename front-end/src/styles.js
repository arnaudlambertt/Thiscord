export const styles = {
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#565E71',
    padding: '15px',
  },
  header: {
    textAlign: 'center',
    backgroundColor: 'rgba(88, 101, 242)',
    flexShrink: 0,
  },
  headerLogIn: {
    backgroundColor: 'red',
  },
  headerLogOut: {
    backgroundColor: 'blue',
  },
  main: {
    backgroundColor: '#373B44',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  footer: {
    textAlign : 'center',
    height: '40px',
    backgroundColor: 'rgba(88,101,242)',
    flexShrink: 0,
  },
  channels: {
    textAlign: 'center',
    minWidth: '250px',
    backgroundColor: 'rgba(44,47,51)',
    '& ul': {
      margin: 0,
      padding: 0,
      textIndent: 0,
      listStyleType: 0,
      paddingLeft: 10,
      paddingRight: 10
    },
    '& li' : {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textAlign: 'left',
      paddingBottom: 5,
      paddingLeft: 3,
      paddingRight: 3,
      paddingTop: 5,
      textOverflow: 'ellipsis',
      fontSize: 20,
      ':hover': {
        backgroundColor: 'rgba(255,255,255,.2)',
      }
    }
  },
  channel: {
    height: '100%',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    paddingLeft : 10,
    paddingRight : 10,
    '& h1': {
      height: '18px',
      whiteSpace: 'nowrap',
    },
  },
  messages: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column-reverse',
    '& ul': {
      margin: 0,
      padding: 0,
      textIndent: 0,
      listStyleType: 0,
    },
  },
  message: {
    wordBreak: 'break-all',
    margin: '.2rem',
    padding: '.2rem',
    ':hover': {
      backgroundColor: 'rgba(0,0,0,.2)',
    },
  },
  author: {
    color: 'rgb(72, 217, 134)',
    fontSize: 20,
    fontWeight: 'bold'
  },
  timeStamp: {
    color: 'rgba(255,255,255,.3)',
    paddingLeft: 5,
    fontSize: 14
  },
  form: {
    borderTop: '2px solid #373B44',
    padding: '.5rem',
    display: 'flex',
  },
  content: {
    flex: '1 1 auto',
    marginRight: '.5rem',
    backgroundColor: '#373B44',
    color: '#ffffff',
    borderColor: 'white',
    borderRadius: '8px',
    height: 20
  },
  send: {
    backgroundColor: '#D6DDEC',
    padding: '.2rem .5rem',
    border: 'none',
    ':hover': {
      backgroundColor: '#2A4B99',
      cursor: 'pointer',
      color: '#fff',
    },
  }
}
