const jwt = require('jsonwebtoken')
const User = require('../models/user')
require('dotenv').config()

const tokenExtractor = (request, response, next) => {
   
    const authorization = request.get('Authorization')
    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    request.token = authorization.split(' ')[1]
    next()
}

const userExtractor = async (request, response, next) => {
    try {
        
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!decodedToken) {
            return response.status(401).json({ error: 'token invalid' })
        }
        const user = await User.findById(decodedToken.id)
        if (!user) {
            return response.status(401).json({ error: 'user not found or id not valid' })
        }
        request.user = user
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = { tokenExtractor, userExtractor }
