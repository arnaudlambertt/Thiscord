
const supertest = require('supertest')
const app = require('../lib/app')
const db = require('../lib/db')

describe('channels', () => {

  beforeEach( async () => {
    await db.admin.clear()
  })

  describe( 'list', () => {

    it('list empty', async () => {
      const {body: user} = await supertest(app)
      .get('/signin')
      // Return an empty channel list by default
      const {body: channels} = await supertest(app)
      .get('/channels')
      .expect(200)
      channels.should.eql([])
    })

    it('list one element', async () => {
      const {body: user} = await supertest(app)
      .get('/signin')
      // Create a channel
      await supertest(app)
      .post('/channels')
      .send({name: 'channel 1', members: [user.id]})
      // Ensure we list the channels correctly
      const {body: channels} = await supertest(app)
      .get('/channels')
      .expect(200)
      channels.should.match([{
        id: /^\w+-\w+-\w+-\w+-\w+$/,
        name: 'channel 1',
        members: [user.id],
        allMembers: [user.id]
      }])
    })

  })

  it('create one element', async () => {
    const {body: user} = await supertest(app)
    .get('/signin')
    // Create a channel
    const {body: channel} = await supertest(app)
    .post('/channels')
    .send({name: 'channel 1', members: [user.id, null]})
    .expect(201)
    // Check its return value
    channel.should.match({
      id: /^\w+-\w+-\w+-\w+-\w+$/,
      name: 'channel 1',
      members: [user.id],
      allMembers: [user.id]
    })
    // Check it was correctly inserted
    const {body: channels} = await supertest(app)
    .get('/channels')
    channels.length.should.eql(1)
  })

  it('get channel', async () => {
    const {body: user} = await supertest(app)
    .get('/signin')
    // Create a channel
    const {body: channel1} = await supertest(app)
    .post('/channels')
    .send({name: 'channel 1', members: [user.id]})
    // Check it was correctly inserted
    const {body: channel} = await supertest(app)
    .get(`/channels/${channel1.id}`)
    .expect(200)
    channel.should.eql(channel1)
  })

  it('update channel', async () => {
    const {body: user} = await supertest(app)
    .get('/signin')
    // Create a channel
    const {body: channel1} = await supertest(app)
    .post('/channels')
    .send({name: 'channel 1', members: [user.id]})
    // Update a channel
    await supertest(app)
    .put(`/channels/${channel1.id}`)
    .send({name: 'channel 2', members: [user.id, null]})
    .expect(200)
    // Check it was correctly updated
    const {body: channel} = await supertest(app)
    .get(`/channels/${channel1.id}`)
    channel.should.eql({
      id: channel1.id,
      name: 'channel 2',
      members: [user.id],
      allMembers: [user.id]
    })
  })

  it('delete channel', async () => {
    const {body: user} = await supertest(app)
    .get('/signin')
    // Create a channel
    const {body: channel} = await supertest(app)
    .post('/channels')
    .send({name: 'channel 1', members: [user.id]})
    // Create a message inside it
    const {body: message} = await supertest(app)
    .post(`/channels/${channel.id}/messages`)
    .send({content: 'Hello ECE'})
    // Delete a channel
    await supertest(app)
    .delete(`/channels/${channel.id}`)
    .expect(204)
    // Check it was correctly deleted
    await supertest(app)
    .get(`/channels/${channel.id}`)
    .expect(403)
  })

})
