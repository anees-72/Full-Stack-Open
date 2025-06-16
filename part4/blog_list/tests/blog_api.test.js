const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const User = require('../models/user')
const api = supertest(app)

let token = null

const blogs = [
  {
    "title": "AI Impact on Web Development",
    "author": "David",
    "url": "https://abc.dev.com",
    "likes": 500,
    "id": "68234433ce516c40543e479a"
  },
  {
    "title": "Career Web Development",
    "author": "Lucas",
    "url": "https://career.dev.com",
    "likes": 500,
    "id": "68234433ce516c40543e479b"
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpass'
  }

  await api.post('/api/users').send(newUser)

  const login = await api.post('/api/login').send({
    username: 'testuser',
    password: 'testpass'
  })

  token = login.body.token

  const user = await User.findOne({ username: 'testuser' })

  const blogObjects = blogs.map(b => new Blog({ ...b, user: user._id }))
  const promiseArray = blogObjects.map(b => b.save())
  await Promise.all(promiseArray)
})

describe('http requests to /api/blogs', () => {
  test('correct number of blogs are returned', async () => {
    const response = await api.get('/api/blogs').expect(200)
    assert.strictEqual(response.body.length, blogs.length)
  })
  test('name of unique identifies is id not _id', async () => {
    const response = await api.get('/api/blogs').expect(200)
    assert.ok(response.body[0].id)
    assert.ok(!response.body[0]._id)
  })
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Debate on AI',
      author: "Anees Ali",
      url: "aneesali.ai/web_dev",
      likes: 100
    }
    const response = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type',/application\/json/)

    assert.strictEqual(response.body.title, newBlog.title)
    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, blogs.length + 1)
  })
  test('if likes is missing, it will default to 0', async () => {
    const newBlog = {
      title: 'Debate on Web Development Career Prospects',
      author: 'Anees Ali',
      url : 'aneesali.web_dev'
    }
    const response = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      assert.strictEqual(response.body.likes,0)
  })
  test('if title or url is missing 400 bad request', async () => {
    const newBlog1 = {
      author:'Anees Ali',
      url:'aneesali.web_dev',
      likes:100
    }
    const response1 = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) 
      .send(newBlog1)
      .expect(400)

    const newBlog2 = {
      title:'Debate on AI and Web Development',
      author:'Anees Ali',
      likes:100
    }

    const response2 = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog2)
      .expect(400)
  })
})
describe('http requests to /api/users', () => {
  test('invalid user cannot  be created', () => {
    const newUser = {
      username:'ab',
      name:'anees',
      password:'aneesali1'
    }
    const response1 = await api.post('/api/users')
      .send(newUser)
      .expect(400)
    const newUser1 = {
      username: 'aneesali',
      name:'anees',
      password:'aa'
    }
    const resposne2 = await api.post('/api/users')
      .send(newUser1)
      .expect(400)
  })

})


after(async () => {
  await mongoose.connection.close()
})
