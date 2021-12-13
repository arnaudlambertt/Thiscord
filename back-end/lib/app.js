
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

app.post('/channels', async (req, res) => {
  const channel = await db.channels.create(req.body)
  res.status(201).json(channel)
})

app.get('/channels/:id', async (req, res) => {
  const channel = await db.channels.get(req.params.id)
  res.json(channel)
})

app.put('/channels/:id', async (req, res) => {
  const channel = await db.channels.update(req.body)
  res.json(channel)
})

// Messages

app.get('/channels/:id/messages', async (req, res) => {
  try{
    const channel = await db.channels.get(req.params.id)
  }catch(err){
    return res.status(404).send('Channel does not exist.')
  }
  const messages = await db.messages.list(req.params.id)
  res.json(messages)
})

app.post('/channels/:id/messages', async (req, res) => {
  const message = await db.messages.create(req.params.id, req.body)
  res.status(201).json(message)
})

// Users
app.get('/signin', loadUser, async (req, res) => {
  if(req.user.id === null)
  {
    req.body = {username: req.user.email}
    req.url = '/users'
    req.method = 'POST'
    return app._router.handle(req, res)
  }
  req.url = `/users/${req.user.id}`
  return app._router.handle(req, res)
})

app.get('/users', async (req, res) => {
  const users = await db.users.list()
  res.json(users)
})

app.post('/users', async (req, res) => {
  const user = await db.users.create(req.body,req.user.email)
  res.status(201).json(user)
})

app.get('/users/:id', async (req, res) => {
  const user = await db.users.get(req.params.id)
  res.json(user)
})

app.put('/users/:id', async (req, res) => {
  const user = await db.users.update(req.body)
  res.json(user)
})

module.exports = app
