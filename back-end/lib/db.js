
const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')
const microtime = require('microtime')
const level = require('level')
const db = level(__dirname + '/../db')

module.exports = {
  channels: {
    create: async (channel, user) => {
      if(!channel.name) throw Error('Invalid channel')
      if(!channel.members) throw Error('Missing members array')
      if(!user.id) throw Error('Unkwown user')
      const id = uuid()
      for(var i = 0; i < channel.members.length; i++)
      {
        try{
          const member = await module.exports.users.get(channel.members[i])
          member.channels.push(id)
          await module.exports.users.update(channel.members[i],member,true)
        }
        catch(e){
          channel.members.splice(i,1)
        }
      }
      channel.allMembers = channel.members
      await db.put(`channels:${id}`, JSON.stringify(channel))

      return merge(channel, {id: id})
    },
    get: async (id, user) => {
      if(!id) throw Error('Invalid id')
      if(!user.id) throw Error('Unkwown user')
      const data = await db.get(`channels:${id}`)
      const channel = JSON.parse(data)
      if(!channel.members.includes(user.id)) throw Error('Unauthorized access')
      return merge(channel, {id: id})
    },
    list: async (user) => {
      if(!user.id) throw Error('Unkwown user')
      const member = await module.exports.users.get(user.id)
      const filteredChannels = [];
      for(channelid of member.channels){
        try{
          const channel = await module.exports.channels.get(channelid,user)
          filteredChannels.push(channel)
        }catch(err){
          member.channels.splice(member.channels.indexOf(channelid),1)
          await module.exports.users.update(user.id,member,true)
        }
      }
      return filteredChannels;
    },
    update: async (channel, original) => {
      if(!channel.name) throw Error('Invalid channel')
      delete channel['id']
      delete channel['allMembers']
      //remove the channel from users who are not in it anymore
      const membersToRemove = original.members.filter(e => !channel.members.includes(e))
      for(const userid of membersToRemove)
      {
        try{
          const member = await module.exports.users.get(userid)
          member.channels.splice(member.channels.findIndex(e => e === original.id),1)
          await module.exports.users.update(userid,member,true)
        }
        catch(e){
        }
      }
      //add the channel to new members
      const membersToAdd = channel.members.filter(e => !original.members.includes(e))
      for(const userid of membersToAdd)
      {
        try{
          const member = await module.exports.users.get(userid)
          member.channels.push(original.id)
          await module.exports.users.update(userid,member,true)
        }
        catch(e){
          channel.members.splice(channel.members.findIndex(e => e === userid),1)
        }
      }
      channel.allMembers = original.allMembers.filter(e => !channel.members.includes(e)).concat(channel.members)
      await db.put(`channels:${original.id}`, JSON.stringify(channel))
      return merge(channel, {id: original.id})
    },
    delete: async (original) => {
      for(const userid of original.members)
      {
        try{
          const member = await module.exports.users.get(userid)
          member.channels.splice(member.channels.findIndex(e => e === original.id),1)
          await module.exports.users.update(userid,member,true)
        }
        catch(e){
          console.log(e)
        }
      }
      const messages = await module.exports.messages.list(original.id)
      for(const message of messages)
        await db.del(`messages:${original.id}:${message.creation}`)

      await db.del(`channels:${original.id}`)
    }
  },
  messages: {
    create: async (channelId, message, user) => {
      if(!message.content) throw Error('Invalid message')
      creation = microtime.now()
      await db.put(`messages:${channelId}:${creation}`, JSON.stringify({
        author: user.id,
        content: message.content,
        edited: false
      }))
      return merge(message, {author: user.id, creation: creation, edited: false})
    },
    list: async (channelId) => {
      return new Promise( (resolve, reject) => {
        const messages = []
        db.createReadStream({
          gt: `messages:${channelId}:`,
          lte: `messages:${channelId}` + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          message = JSON.parse(value)
          const [, channelId, creation] = key.split(':')
          message.creation = creation
          messages.push(message)
        }).on( 'error', (err) => {
          reject(err)
        }).on( 'end', () => {
          resolve(messages)
        })
      })
    },
    update: async (channelId, message, user) => {
      if(!message.content) throw Error('Invalid message')
      if(!message.creation) throw Error('Invalid message')
      const originalJson = await db.get(`messages:${channelId}:${message.creation}`)
      const original = JSON.parse(originalJson)
      if(original.author !== user.id) throw Error('Only the author can edit this message')
      delete message['edited']
      delete message['author']
      await db.put(`messages:${channelId}:${message.creation}`, JSON.stringify({
        author: user.id,
        content: message.content,
        edited: true
      }))
      return merge(message,{author: user.id, edited: true})
    },
    delete: async (channelId, message, user) => {
      if(!message.content) throw Error('Invalid message')
      if(!message.creation) throw Error('Invalid message')
      const originalJson = await db.get(`messages:${channelId}:${message.creation}`)
      const original = JSON.parse(originalJson)
      if(original.author !== user.id) throw Error('Only the author can delete this message')
      await db.del(`messages:${channelId}:${message.creation}`)
      return
    },
  },
  users: {
    create: async (user, email) => {
      if(!user.username) throw Error('Invalid user')
      if(!email) throw Error('Invalid email')
      const id = uuid()
      user.theme = 'dark'
      user.avatar = 'http://localhost:3000/david.png'
      user.email = email
      user.channels = []
      await db.put(`usersid:${email}`, JSON.stringify(id))
      await db.put(`users:${id}`, JSON.stringify(user))
      return merge(user, {id: id})
    },
    get: async (id) => {
      if(!id) throw Error('Invalid id')
      const data = await db.get(`users:${id}`)
      const user = JSON.parse(data)
      return merge(user, {id: id})
    },
    list: async (string = '') => {
      return new Promise( (resolve, reject) => {
        const users = []
        db.createReadStream({
          gt: "users:",
          lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          user = JSON.parse(value)
          user.id = key.split(':')[1]
          if(user.username.indexOf(string) !== -1)
            users.push(user)
        }).on( 'error', (err) => {
          reject(err)
        }).on( 'end', () => {
          resolve(users)
        })
      })
    },
    update: async (id, user, channelUpdate) => {
      if(!user.username) throw Error('Invalid username')
      if(!user.email) throw Error('Invalid email')
      if(!user.theme) throw Error('Invalid theme')
      if(!user.avatar) throw Error('Invalid avatar')
      const original = await module.exports.users.get(id)
      if(!original) throw Error('Unregistered user id')
      if(user.username !== original.username){
        if(user.username.includes('@'))
          throw Error('Invalid username')
        else{
          const users = await module.exports.users.list(user.username)
          if(users.filter(u => u.username === user.username).length)
            throw Error('Invalid username')
        }
      }
      if(user.avatar !== original.avatar){
        if(
          user.avatar !== 'gravatar' &&
          user.avatar !== 'http://localhost:3000/arnaud.jpeg' &&
          user.avatar !== 'http://localhost:3000/clement.jpg' &&
          user.avatar !== 'http://localhost:3000/david.png' &&
          user.avatar !== 'http://localhost:3000/sergei.jpg' &&
          user.avatar.indexOf('data:image/') !== 0
        )
          throw Error('Invalid avatar')
      }
      delete user['id']
      if(!channelUpdate)
        user.channels = original.channels
      await db.put(`users:${id}`, JSON.stringify(user))
      return merge(user, {id: id})
    },
    delete: async (id, user) => {
      try{
      const original = await module.exports.users.get(id)
      for(channelid of original.channels){
        const original = await module.exports.channels.get(channelid,user)
        const channel = {...original}
        channel.members.splice(channel.members.indexOf(id),1)
        channel.allMembers.splice(channel.allMembers.indexOf(id),1)
        await module.exports.channels.update(channel,original)
      }
      await db.del(`usersid:${original.email}`)
      await db.del(`users:${id}`)
    }catch(err){console.log(err)}
      return
    },
    getId: async (email) => {
      if(!email) throw Error('Invalid email')
      try {
        const data = await db.get(`usersid:${email}`)
        const id = JSON.parse(data)
        return id
      } catch (e) {
        return null
      }
    },
  },
  admin: {
    clear: async () => {
      await db.clear()
    }
  }
}
