import React, {useState} from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'

const Context = React.createContext()

export default Context

export const Provider = ({
  children
}) => {
  const [cookies, setCookie, removeCookie] = useCookies([])
  const [oauth, setOauth] = useState(cookies.oauth)
  const [user, setUser] = useState(cookies.user)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [channels, setChannels] = useState([])
  const [currentChannel, setCurrentChannel] = useState(null)
  const [authors, setAuthors] = useState({})
  const [mode, setMode] = useState(user ? user.theme : 'dark');
  const addAuthor = async (id) => {
    try{
      const {data: author} = await axios.get(`http://localhost:3001/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${oauth.access_token}`
        }
      })
      const pair = {}
      if(!authors[id])
      {
        pair[id] = author
        setAuthors(Object.assign(authors,pair))
      }
    }catch(err){
      console.error(err)
    }
  }

  const refreshOneChannel = async (desiredChannel) => {
    try{
      const {data: channel} = await axios.get(`http://localhost:3001/channels/${desiredChannel.id}`, {
        headers: {
          'Authorization': `Bearer ${oauth.access_token}`
        }
      })
      const index = channels.findIndex(e => e.id === desiredChannel.id)
      const actual = channels.find(e => e.id === desiredChannel.id)
      if(JSON.stringify(channel) !== JSON.stringify(actual))
      {
        if(actual)
          channels.splice(index,1,channel)
        else
          channels.push(channel)
        setCurrentChannel(channel)
      }
    }catch(err){
      console.error(err)
    }
  }

  return (
    <Context.Provider value={{
      oauth: oauth,
      setOauth: (oauth) => {
        if(oauth){
          setCookie('oauth', oauth, {path: '/'})
        }else{
          setUser(null)
          removeCookie('user', {path: '/'})
          setCurrentChannel(null)
          setChannels([])
          removeCookie('oauth', {path: '/'})
        }
        setOauth(oauth)
      },
      user: user,
      setUser: (user) => {
        if(user){
          const authorsCopy = Object.assign({},authors)[user.id] = user
          setAuthors(authorsCopy)
          setMode(user.theme)
          setCookie('user', user, {path: '/'})
        }else{
          removeCookie('user', {path: '/'})
        }
        setUser(user)
      },
      authors: authors,
      updateAuthors: (id) => {
        if(!authors[id]){
          addAuthor(id)
        }
      },
      channels: channels,
      drawerVisible: drawerVisible,
      setDrawerVisible: setDrawerVisible,
      mode:mode,
      setMode:setMode,
      setChannels: setChannels,
      currentChannel: currentChannel,
      setCurrentChannel: (channel) => {
        if(channel){
          refreshOneChannel(channel)
          channel = channels.find( e => e.id === channel.id)
        }
        setCurrentChannel(channel)
      },
    }}>{children}</Context.Provider>
  )
}
