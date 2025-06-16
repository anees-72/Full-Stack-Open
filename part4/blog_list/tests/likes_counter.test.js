const {test,describe} = require('node:test')
const assert = require('node:assert')
const list_helper = require('../utils/list_helper')

describe('total likes', () => {
    const emptyBlogs = []
    test('when list is empty, total likes is 0', () => {
        assert.strictEqual(list_helper.likes_counter(emptyBlogs),0)
    })
    const oneBlog = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  }]
  test('when list has one blog equals the likes of that blog', () => {
    assert.strictEqual(list_helper.likes_counter(oneBlog),7)
  })
  const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]
    test('of a bloggr list is calculated correctly', () => {
        assert.strictEqual(list_helper.likes_counter(blogs),36)
    })
    test('blogger with most blogs is returned correctly', () => {
        const mostBlogs = list_helper.mostBlogs(blogs)
        assert.strictEqual(mostBlogs.author, 'Robert C. Martin')
        assert.strictEqual(mostBlogs.blogs, 3)
    })
    test('blogger with most likes is returned correctly', () => {
      const mostLikedAuthor = list_helper.mostLikedAuthor(blogs)
      assert.strictEqual(mostLikedAuthor.author, 'Edsger W. Dijkstra')
      assert.strictEqual(mostLikedAuthor.likes, 17)
    })
})
