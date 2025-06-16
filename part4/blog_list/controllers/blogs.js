const blogsRouter = require('express').Router()
const { request } = require('../app')
const Blog = require('../models/blogs')
const User = require('../models/user')
const {userExtractor, tokenExtractor} = require('../utils/middleware')
const jwt = require('jsonwebtoken')





blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username:1, name:1})
    return response.json(blogs)
})

blogsRouter.post('/',tokenExtractor,userExtractor, async (request, response) => {
    let blog = request.body
    if (blog.likes === undefined) {
        blog.likes =0
    }
    if (blog.title === undefined || blog.url === undefined) {
        return response.status(400).json({ error: 'title or url missing'})
    }
    const user = request.user
    if (!user) {
        return response.status(401).json({ error: 'user not found or id not valid'})
    }
    blog.user = user._id
    blog = new Blog(blog)
    await blog.save()
    const usertosave = await User.findById(user._id)
    if (!usertosave) {
        return response.status(404).json({error: 'User not found'})
    }
    usertosave.blogs = user.blogs.concat(blog._id)
    await user.save()
    return response.status(201).json(blog)  
})

blogsRouter.delete('/:id',tokenExtractor,userExtractor, async (request, response) => {
    const user = request.user
    if (!user) {
        return response.status(401).json({ error: 'user not found or id not valid'})
    }
    
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }
    if (blog.user.toString() !== user._id.toString()) {
        return response.status(401).json({ error: 'user not authorized to delete this blog' })
    }
    
    const id = request.params.id
    await Blog.findByIdAndDelete(id)
    return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const blog = await Blog.findById(id)
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }
    const blogData = request.body
    if (blogData.title === undefined || blogData.url === undefined) {
        return response.status(400).json({ error: 'title or url missing' })
    }
    const updatedBlog = await Blog.findByIdAndUpdate(id, blogData, {new: true})
    return response.status(200).json(updatedBlog)
})

module.exports = blogsRouter