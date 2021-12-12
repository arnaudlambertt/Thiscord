import React, {useState} from 'react'
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
          setCookie('user', user, {path: '/'})
        }else{
          removeCookie('user', {path: '/'})
        }
        setUser(user)
      },
      channels: channels,
      drawerVisible: drawerVisible,
      setDrawerVisible: setDrawerVisible,
      setChannels: setChannels,
      currentChannel: currentChannel,
      setCurrentChannel: (channelId) => {
        const channel = channels.find( channel => channel.id === channelId)
        setCurrentChannel(channel)
      },
    }}>{children}</Context.Provider>
  )
}
