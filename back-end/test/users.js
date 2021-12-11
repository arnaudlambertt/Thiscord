
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
      email: process.env['TEST_PAYLOAD_EMAIL']
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
      email: process.env['TEST_PAYLOAD_EMAIL']
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
      email: process.env['TEST_PAYLOAD_EMAIL']
    })
    // Sign in again after creating an account
    const {body: user1} = await supertest(app)
    .get('/signin')
    .expect(200) //GET
    user1.should.match(user)
  })
})
