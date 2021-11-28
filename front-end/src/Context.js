import React, {useState} from 'react'
import axios from 'axios';
export const Context = React.createContext();

export const ContextProvider =  ({
  children
}) => {
  const [user, setUser] = useState(null);
  const [channels, setChannels] = useState(null);

  return (
    <Context.Provider value={{
      user: user,
      login: (user) => {
        if(user && !user.email){
          throw Error("Invalid user")
        }
        setUser(user)
      },
      logout: () => {
        setUser(null)
      },
      channels: channels,
      fetchChannels: async () =>
      {
        const {data: channelsPost} = await axios.get('http://localhost:3001/channels')
        const chans = {};
        channelsPost.forEach((a,b) => chans[a.id] = a)
        setChannels(chans);
      }
    }}>{children}</Context.Provider>
  )
}
