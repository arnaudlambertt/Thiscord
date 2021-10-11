
const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')

// const store =  {
//   channels: {
//   },
//   users: {
//   },
//   messages: {
//   }
// }

const level = require('level')
const db = level(__dirname + '/../db')

module.exports = {
  channels: {
    create: async (channel) => {
      if(!channel.name) throw Error('Invalid channel')
      id = uuid()
      // store.channels[id] = channel
      await db.put(`channel:${id}`, JSON.stringify(channel))
      return merge(channel, {id: id})
    },
    list: () => {
      // return Object.keys(store.channels).map( (id) => {
      //   const channel = clone(store.channels[id])
      //   channel.id = id
      //   return channel
      // })
      return new Promise( (resolve, reject) => {
        const channels = []
        db.createReadStream({
          gt: "channel:",
          lte: "channel" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          channel = JSON.parse(value)
          channel.id = key.split(':')[1]
          if(key.split(':')[2] === undefined){
            channels.push(channel)
          }
        }).on( 'error', (err) => {
          reject(err)
        }).on( 'end', () => {
          resolve(channels)
        })
      })
    },
    // update: (id, channel) => {
    //   const original = store.channels[id]
    //   if(!original) throw Error('Unregistered channel id')
    //   store.channels[id] = merge(original, channel)
    // },
    // delete: (id, channel) => {
    //   const original = store.channels[id]
    //   if(!original) throw Error('Unregistered channel id')
    //   delete store.channels[id]
    // }
  },
  messages : {
    list: (channel_id) => {
      // return Object.keys(store.messages).map( (id) => {
      //   if(id.split(':')[0] === channel_id)
      //   {
      //     const message = clone(store.messages[id])
      //     return message
      //   }
      // })
      return new Promise( (resolve, reject) => {
        const messages = []
        db.createReadStream({
          gt: "channel:",
          lte: "channel" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          message = JSON.parse(value)
          message_channel_id = key.split(':')[1]
          if(key.split(':')[2] === 'message' && message_channel_id === channel_id){
            messages.push(message)
          }
        }).on( 'error', (err) => {
          reject(err)
        }).on( 'end', () => {
          resolve(messages)
        })
      })
    },
    create: async (channel_id, message) => {
      if(!channel_id) throw Error('Invalid channel id')
      if(!message.content) throw Error('Invalid message')
      id = uuid()
      creation = Date.now()
      //store.messages[id] = merge({creation: creation}, message)
      await db.put(`channel:${channel_id}:message:${id}`, JSON.stringify(merge({creation: creation}, message)))
      return merge({creation: creation}, message)
    },
  },
  users: {
    create: async (user) => {
      if(!user.username) throw Error('Invalid user')
      id = uuid()
      //store.users[id] = user
      await db.put(`user:${id}`, JSON.stringify(user))
      return merge(user, {id: id})
    },
    list: () => {
      // return Object.keys(store.users).map( (id) => {
      //   const user = clone(store.users[id])
      //   user.id = id
      //   return user
      // })
      return new Promise( (resolve, reject) => {
        const users = []
        db.createReadStream({
          gt: "user:",
          lte: "user" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          user = JSON.parse(value)
          user.id = key.split(':')[1]
          users.push(user)
        }).on( 'error', (err) => {
          reject(err)
        }).on( 'end', () => {
          resolve(users)
        })
      })
    },
    update: (id, user_updated) => {
      var user;
      return new Promise( (resolve, reject) => {
        let stream = db.createReadStream({
          gt: "user:",
          lte: "user" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          user_value = JSON.parse(value)
          user_id = key.split(':')[1]
          if(user_id === id){
            db.put(`user:${id}`, JSON.stringify(user_updated))
            user = merge(user_updated,{id: id})
            stream.destroy()
          }
        }).on( 'error', (err) => {
          reject(err)
        }).on( 'end', () => {
          resolve(user)
        }).on( 'close', () => {
          resolve(user)
        })
      })
    }
    // update: (id, user) => {
    //   const original = store.users[id]
    //   if(!original) throw Error('Unregistered user id')
    //   store.users[id] = merge(original, user)
    // },
    // delete: (id, user) => {
    //   const original = store.users[id]
    //   if(!original) throw Error('Unregistered user id')
    //   delete store.users[id]
    // }
  },
  admin: {
    clear: async () => {
      // store.channels = {}
      // store.users = {}
      // store.messages = {}
      await db.clear()
    }
  }
}
