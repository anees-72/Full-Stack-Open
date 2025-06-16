const express = require('express')
const mongoose = require('mongoose')
const app = express()
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const errorHandler = require('./utils/error')
const middleware = require('./utils/middleware')



app.use(express.json())
app.use(errorHandler)
app.use('/api/login', require('./controllers/login'))
app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)

mongoose.connect(config.MONGODB_URI)

module.exports = app