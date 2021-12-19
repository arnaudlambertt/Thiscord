
const supertest = require('supertest')
const app = require('../lib/app')
const db = require('../lib/db')

describe('users', () => {

  beforeEach( async () => {
    await db.admin.clear()
  })

  it('list empty', async () => {
    // Return an empty user list by default
    const {body: users} = await supertest(app)
    .get('/users')
    .expect(200)
    users.should.eql([])
  })

  it('list one element', async () => {
    // Create a user
    await supertest(app)
    .post('/users')
    .send({username: 'user_1'})
    // Ensure we list the users correctly
    const {body: users} = await supertest(app)
    .get('/users')
    .expect(200)
    users.should.match([{
      id: /^\w+-\w+-\w+-\w+-\w+$/,
      username: 'user_1',
      email: process.env['TEST_PAYLOAD_EMAIL'],
      channels: [],
      theme: 'dark',
      avatar: 'http://localhost:3000/david.png'
    }])
  })

  it('list one element searched by username', async () => {
    // Create a user
    await supertest(app)
    .post('/users')
    .send({username: 'user_1'})
    // Ensure we list the users correctly
    const {body: users} = await supertest(app)
    .get('/users?search=ser_1')
    .expect(200)
    users.should.match([{
      id: /^\w+-\w+-\w+-\w+-\w+$/,
      username: 'user_1',
      email: process.env['TEST_PAYLOAD_EMAIL'],
      channels: [],
      theme: 'dark',
      avatar: 'http://localhost:3000/david.png'
    }])
  })

  it('add one element', async () => {
    // Create a user
    const {body: user} = await supertest(app)
    .post('/users')
    .send({username: 'user_1'})
    .expect(201)
    // Check its return value
    // Check it was correctly inserted
    const {body: users} = await supertest(app)
    .get('/users')
    users.length.should.eql(1)
  })

  it('get user', async () => {
    // Create a user
    const {body: user1} = await supertest(app)
    .post('/users')
    .send({username: 'user_1'})
    // Check it was correctly inserted
    const {body: user} = await supertest(app)
    .get(`/users/${user1.id}`)
    .expect(200)
    user.should.match({
      id: /^\w+-\w+-\w+-\w+-\w+$/,
      username: 'user_1',
      email: process.env['TEST_PAYLOAD_EMAIL'],
      channels: [],
      theme: 'dark',
      avatar: 'http://localhost:3000/david.png'
    })
  })

  it('signin', async () => {
    // Try to sign in without creating an account
    const {body: user} = await supertest(app)
    .get('/signin')
    .expect(201) //POST
    user.should.match({
      id: /^\w+-\w+-\w+-\w+-\w+$/,
      username: process.env['TEST_PAYLOAD_EMAIL'],
      email: process.env['TEST_PAYLOAD_EMAIL'],
      theme: 'dark'
    })
    // Sign in again after creating an account
    const {body: user1} = await supertest(app)
    .get('/signin')
    .expect(200) //GET
    user1.should.match(user)
  })

  it('update user', async () => {
    // Create a user
    const {body: user1} = await supertest(app)
    .post('/users')
    .send({username: 'user_1'})
    //
    await supertest(app)
    .get(`/users/${user1.id}`)
    .expect(200)
    // Update the user
    await supertest(app)
    .put(`/users/${user1.id}`)
    .send({username: 'user_A',
     email: process.env['TEST_PAYLOAD_EMAIL'],
     theme: 'light',
     avatar: 'http://localhost:3000/arnaud.jpeg'
    })
    .expect(200)
    // Check if it was correctly updated
    const {body: user} = await supertest(app)
    .get(`/users/${user1.id}`)
    .expect(200)
    user.should.match({
      id: /^\w+-\w+-\w+-\w+-\w+$/,
      username: 'user_A',
      email: process.env['TEST_PAYLOAD_EMAIL'],
      channels: [],
      theme: 'light',
      avatar: 'http://localhost:3000/arnaud.jpeg'
    })
  })

  it('delete user', async () => {
    // Create a user
    const {body: user1} = await supertest(app)
    .post('/users')
    .send({username: 'user_1'})
    //
    await supertest(app)
    .get(`/users/${user1.id}`)
    .expect(200)
    // delete the user
    await supertest(app)
    .delete(`/users/${user1.id}`)
    .expect(204)
    // Check it was correctly deleted
    await supertest(app)
    .get(`/users/${user1.id}`)
    .expect(404)
  })
})
