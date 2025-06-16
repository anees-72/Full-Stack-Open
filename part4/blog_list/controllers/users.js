const userRouter = require('express').Router()
const { request } = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {title:1, url:1,author:1,likes:1})
    return response.json(users)
})

userRouter.post('/', async (request, response) => {
    const body = request.body
    if (body.password.length <3){
        return response.status(400).json({error:'password must be at least 3 character long'})
    }
    if (body.username.length <3){
        return response.status(400).json({error:'username must be at least 3 character long'})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })
    const savedUser = await user.save()
    return response.status(201).json(savedUser)
})


module.exports = userRouter