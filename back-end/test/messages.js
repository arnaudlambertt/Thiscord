
const supertest = require('supertest')
const microtime = require('microtime')
const server = require('../lib/app')
const db = require('../lib/db')

describe('messages', () => {

  beforeEach( async () => {
    await db.admin.clear()
  })

  it('list empty', async () => {
    const {body: user} = await supertest(server)
    .get('/signin')
    // Create a channel
    const {body: channel} = await supertest(server)
    .post('/channels')
    .send({name: 'channel 1', members: [user.id]})
    // Get messages
    const {body: messages} = await supertest(server)
    .get(`/channels/${channel.id}/messages`)
    .expect(200)
    messages.should.eql([])
  })

  it('list one message', async () => {
    const {body: user} = await supertest(server)
    .get('/signin')
    // Create a channel
    const {body: channel} = await supertest(server)
    .post('/channels')
    .send({name: 'channel 1', members: [user.id]})
    // and a message inside it
    await supertest(server)
    .post(`/channels/${channel.id}/messages`)
    .send({author: 'whoami', content: 'Hello ECE'})
    // Get messages
    const {body: messages} = await supertest(server)
    .get(`/channels/${channel.id}/messages`)
    .expect(200)
    messages.should.match([{
      author: user.id,
      creation: (it) => it.should.be.approximately(microtime.now(), 1000000),
      content: 'Hello ECE',
      edited: false
    }])
  })

  it('add one element', async () => {
    const {body: user} = await supertest(server)
    .get('/signin')
    // Create a channel
    const {body: channel} = await supertest(server)
    .post('/channels')
    .send({name: 'channel 1', members: [user.id]})
    // Create a message inside it
    const {body: message} = await supertest(server)
    .post(`/channels/${channel.id}/messages`)
    .send({content: 'Hello ECE'})
    .expect(201)
    message.should.match({
      author: user.id,
      creation: (it) => it.should.be.approximately(microtime.now(), 1000000),
      content: 'Hello ECE',
      edited: false
    })
    // Check it was correctly inserted
    const {body: messages} = await supertest(server)
    .get(`/channels/${channel.id}/messages`)
    messages.length.should.eql(1)
  })

  it('access invalid channel', async () => {
    // Get messages
    const {body: messages} = await supertest(server)
    .get(`/channels/1234/messages`)
    .expect(403)
  })

  it('update message', async () => {
    const {body: user} = await supertest(server)
    .get('/signin')
    // Create a channel
    const {body: channel} = await supertest(server)
    .post('/channels')
    .send({name: 'channel 1', members: [user.id]})
    // Create a message inside it
    const {body: message} = await supertest(server)
    .post(`/channels/${channel.id}/messages`)
    .send({content: 'Hello ECE'})
    // Update a message
    await supertest(server)
    .put(`/channels/${channel.id}/messages`)
    .send({creation: message.creation, content:'Edited content'})
    .expect(200)
    // Check it was correctly updated
    const {body: messages} = await supertest(server)
    .get(`/channels/${channel.id}/messages`)
    messages.should.match([{
      author: user.id,
      creation: message.creation.toString(),
      content:'Edited content',
      edited: true
    }])
  })

  it('delete message', async () => {
    const {body: user} = await supertest(server)
    .get('/signin')
    // Create a channel
    const {body: channel} = await supertest(server)
    .post('/channels')
    .send({name: 'channel 1', members: [user.id]})
    // Create a message inside it
    const {body: message} = await supertest(server)
    .post(`/channels/${channel.id}/messages`)
    .send({content: 'Hello ECE'})
    // Delete a message
    await supertest(server)
    .delete(`/channels/${channel.id}/messages`)
    .send(message)
    .expect(204)
    // Check it was correctly deleted
    const {body: messages} = await supertest(server)
    .get(`/channels/${channel.id}/messages`)
    messages.length.should.eql(0)
  })
})
