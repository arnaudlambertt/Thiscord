
const db = require('./db')
const express = require('express')
const cors = require('cors')
const http = require('http')
const {authenticator,loadUser} = require('./authenticator')

const app = express()
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server, {
  cors: {
  origin: "http://localhost:3000",
  methods: ["GET"],
  allowedHeaders: ["Authorization"],
  credentials: true
}
});

const authenticate = authenticator({
  test_payload_email: process.env['TEST_PAYLOAD_EMAIL'],
  jwks_uri: 'http://127.0.0.1:5556/dex/keys'
})

app.use(require('body-parser').json({limit:'4mb'}))
app.use(cors())

app.all('*', authenticate)

//socketio
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(authenticate))
io.use(wrap(loadUser))

io.use((socket, next) => {
  if (socket.request.user.id) {
    next();
  } else {
    next(new Error("unauthorized"))
  }
});

io.on("connection", async (socket) => {
  socket.join(socket.request.user.id);
  const user = await db.users.get(socket.request.user.id)
  socket.join(user.channels)
  socket.on("disconnect", () => {
  });
});

// Channels

app.get('/channels', loadUser, async (req, res) => {
  if(!req.user.id)
    return res.status(404).send('Unknown user')
  const channels = await db.channels.list(req.user)
  res.json(channels)
})

app.post('/channels', loadUser, async (req, res) => {
  try{
    const channel = await db.channels.create(req.body, req.user)
    res.status(201).json(channel)
  }catch(err){
    res.status(403).send(err.message)
  }
})

app.get('/channels/:id', loadUser, async (req, res) => {
  try{
    const channel = await db.channels.get(req.params.id, req.user)
    res.json(channel)
  }catch(err){
    res.status(403).send('You don\'t have access to this channel or it does not exist')
  }
})

app.put('/channels/:id', loadUser, async (req, res, next) => {
  try{
    if(req.body.members.length === 0)
    {
      req.method = 'DELETE'
      return next()
    }
    const original = await db.channels.get(req.params.id, req.user)
    const channel = await db.channels.update(req.body,original)
    res.json(channel)
    const removedMembers = original.members.filter(e => !channel.members.includes(e))
    if(removedMembers.length)
      io.to(removedMembers).emit('delete channel', channel)
    io.to(channel.members).emit('update channel', channel)
  }catch(err){
    res.status(403).send('You don\'t have access to this channel or it does not exist')
  }
})

app.delete('/channels/:id', loadUser, async (req, res) => {
  try{
    const original = await db.channels.get(req.params.id, req.user)
    await db.channels.delete(original)
    res.status(204).send()
    io.to(original.members).emit('delete channel', original)
  }catch(err){
    res.status(403).send('You don\'t have access to this channel or it does not exist')
  }
})

// Messages

app.get('/channels/:id/messages', loadUser, async (req, res) => {
  try{
    const channel = await db.channels.get(req.params.id, req.user)
  }catch(err){
    return res.status(403).send('You don\'t have access to this channel or it does not exist')
  }
  const messages = await db.messages.list(req.params.id)
  res.json(messages)
})

app.post('/channels/:id/messages', loadUser, async (req, res) => {
  var channel = null
  try{
    channel = await db.channels.get(req.params.id, req.user)
  }catch(err){
    return res.status(403).send('You don\'t have access to this channel or it does not exist')
  }
  try{
    const message = await db.messages.create(req.params.id, req.body, req.user)
    res.status(201).json(message)
    io.to(channel.id).emit('update message ' + channel.id, message)
  }catch(err){
    res.status(400).send('Bad message')
  }
})

app.put('/channels/:id/messages', loadUser, async (req, res) => {
  var channel = null
  try{
    channel = await db.channels.get(req.params.id, req.user)
  }catch(err){
    return res.status(403).send('You don\'t have access to this channel or it does not exist')
  }
  try{
    const message = await db.messages.update(req.params.id, req.body, req.user)
    res.json(message)
    io.to(channel.id).emit('update message ' + channel.id, message)
  }catch(err){
    res.status(400).send('Bad message')
  }
})

app.delete('/channels/:id/messages', loadUser, async (req, res) => {
  var channel = null
  try{
    channel = await db.channels.get(req.params.id, req.user)
  }catch(err){
    return res.status(403).send('You don\'t have access to this channel or it does not exist')
  }
  try{
    await db.messages.delete(req.params.id, req.body, req.user)
    res.status(204).send()
    io.to(channel.id).emit('delete message ' + channel.id, req.body)
  }catch(err){
    res.status(403).send('You cannot delete this message or it does not exist')
  }
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
    return res.status(404).send('The user does not exist')
  }
})

app.put('/users/:id', loadUser, async (req, res) => {
  try{
    if(req.user.id !== req.params.id)
      throw Error('authenticated user id different from params')
    const user = await db.users.get(req.params.id)
  }catch(err){
    return res.status(403).send('You cannot perform updates on this user or it does not exist')
  }
  try{
    const user = await db.users.update(req.params.id,req.body,false)
    res.json(user)
    io.to(user.channels).emit('update author', user)
    io.to(user.id).emit('update user', user)
  }catch(err){
    console.log(err)
    return res.status(400).send('The updated user is invalid')
  }
})

app.delete('/users/:id', loadUser, async (req, res) => {
  var user = null
  try{
    if(req.user.id !== req.params.id)
      throw Error('Authenticated user id different from params')
    user = await db.users.get(req.params.id)
  }catch(err){
    return res.status(403).send('You cannot delete this user or it does not exist')
  }
  await db.users.delete(req.params.id, req.user)
  res.status(204).send()
  io.to(user.channels).emit('delete author', user)
  io.to(user.id).emit('delete user', user)
})

module.exports = server
