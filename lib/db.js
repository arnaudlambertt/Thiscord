
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
      await db.put(`channels:${id}`, JSON.stringify(channel))
      return merge(channel, {id: id})
    },
    list: async () => {
      // return Object.keys(store.channels).map( (id) => {
      //   const channel = clone(store.channels[id])
      //   channel.id = id
      //   return channel
      // })
      return new Promise( (resolve, reject) => {
        const channels = []
        db.createReadStream({
          gt: "channels:",
          lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          channel = JSON.parse(value)
          channel.id = key.split(':')[1]
          channels.push(channel)
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
    list: async (channel_id) => {
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
          gt: "messages:",
          lte: "messages" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          message = JSON.parse(value)
          message_channel_id = key.split(':')[1]
          if(message_channel_id === channel_id){
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
      await db.put(`messages:${channel_id}:${id}`, JSON.stringify(merge({creation: creation}, message)))
      return merge({creation: creation}, message)
    },
  },
  users: {
    create: async (user) => {
      if(!user.username) throw Error('Invalid user')
      id = uuid()
      //store.users[id] = user
      await db.put(`users:${id}`, JSON.stringify(user))
      return merge(user, {id: id})
    },
    list: async () => {
      // return Object.keys(store.users).map( (id) => {
      //   const user = clone(store.users[id])
      //   user.id = id
      //   return user
      // })
      return new Promise( (resolve, reject) => {
        const users = []
        db.createReadStream({
          gt: "users:",
          lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
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
