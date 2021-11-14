import React, {useState} from 'react'

export const Context = React.createContext();

export const ContextProvider =  ({
  children
}) => {
  const [user, setUser] = useState(null)
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
      }
    }}>{children}</Context.Provider>
  )
}
