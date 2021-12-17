
const db = require('./db')
const express = require('express')
const cors = require('cors')
const {authenticator,loadUser} = require('./authenticator')

const app = express()
const authenticate = authenticator({
  test_payload_email: process.env['TEST_PAYLOAD_EMAIL'],
  jwks_uri: 'http://127.0.0.1:5556/dex/keys'
})

app.use(require('body-parser').json())
app.use(cors())

app.all('*', authenticate)

// Channels

app.get('/channels', loadUser, async (req, res) => {
  const channels = await db.channels.list(req.user)
  res.json(channels)
})

app.post('/channels', loadUser, async (req, res) => {
  const channel = await db.channels.create(req.body, req.user)
  res.status(201).json(channel)
})

app.get('/channels/:id', loadUser, async (req, res) => {
  try{
    const channel = await db.channels.get(req.params.id, req.user)
    res.json(channel)
  }catch(err){
    return res.status(403).send('You don\'t have access to this channel')
  }
})

app.put('/channels/:id', loadUser, async (req, res) => {
  try{
    const channel = await db.channels.get(req.params.id, req.user)
  }catch(err){
    return res.status(400).send('You don\'t have access to this channel')
  }
  const channel = await db.channels.update(req.params.id,req.body,req.user)
  res.json(channel)
})

// Messages

app.get('/channels/:id/messages', loadUser, async (req, res) => {
  try{
    const channel = await db.channels.get(req.params.id, req.user)
  }catch(err){
    return res.status(403).send('You don\'t have access to this channel')
  }
  const messages = await db.messages.list(req.params.id)
  res.json(messages)
})

app.post('/channels/:id/messages', loadUser, async (req, res) => {
  try{
    const channel = await db.channels.get(req.params.id, req.user)
  }catch(err){
    return res.status(403).send('You don\'t have access to this channel')
  }
  const message = await db.messages.create(req.params.id, req.body, req.user)
  res.status(201).json(message)
})

app.put('/channels/:id/messages', loadUser, async (req, res) => {
  try{
    const channel = await db.channels.get(req.params.id, req.user)
  }catch(err){
    return res.status(403).send('You don\'t have access to this channel')
  }
  const message = await db.messages.update(req.params.id, req.body, req.user)
  res.json(message)
})

app.delete('/channels/:id/messages', loadUser, async (req, res) => {
  try{
    const channel = await db.channels.get(req.params.id, req.user)
  }catch(err){
    return res.status(403).send('You don\'t have access to this channel')
  }
  await db.messages.delete(req.params.id, req.body, req.user)
  res.status(204).send()
})
// Users
app.get('/signin', loadUser, async (req, res, next) => {
  if(req.user.id === null)
  {
    req.body = {username: req.user.email}
    req.url = '/users'
    req.method = 'POST'
    return next()
  }
  req.url = `/users/${req.user.id}`
  next()
})

app.get('/users', async (req, res) => {
  const users = await db.users.list(req.query.search)
  res.json(users)
})

app.post('/users', async (req, res) => {
  const user = await db.users.create(req.body,req.user.email)
  res.status(201).json(user)
})

app.get('/users/:id', async (req, res) => {
  try{
    const user = await db.users.get(req.params.id)
    res.json(user)
  }catch(err){
    return res.status(404).send('the user does not exist')
  }
})

app.put('/users/:id', loadUser, async (req, res) => {
  try{
    if(req.user.id !== req.params.id)
      throw Error('authenticated user id different from params')
    const user = await db.users.get(req.params.id)
  }catch(err){
    return res.status(403).send('You cannot perform updates on this user')
  }

  const user = await db.users.update(req.params.id,req.body,false)
  res.json(user)
})

app.delete('/users/:id', loadUser, async (req, res) => {
  try{
    if(req.user.id !== req.params.id)
      throw Error('authenticated user id different from params')
    const user = await db.users.get(req.params.id)
  }catch(err){
    return res.status(403).send('You cannot delete this user')
  }
  await db.users.delete(req.params.id, req.user)
  res.status(204).send()
})

module.exports = app
