const express = require('express')
const app = express()
const Person = require('./models/notes')
require('dotenv').config()
const morgan = require('morgan')
morgan.token('type',(req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status  :response-time ms :type'))
const path=require('path')
app.use(express.static('public'))
app.use(express.json())


app.get('/',(request,response) => {
  response.sendFile(path.resolve(__dirname,'public','index.html'))
})
app.get('/api/persons',(request,response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info',(request,response) => {
  Person.find({}).then(notes => {
    response.send(`<p>Phonebook has info for ${notes.length} people</p>
        <p>${new Date()}</p>`)})
})

app.get('/api/persons/:id',(request,response) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person){
      return response.json(person)
    }
    else {
      return response.status(404).json({
        error: 'Person not found'
      })
    }
  })
})

app.delete('/api/persons/:id',(request,response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(deletedPerson => {
      if (deletedPerson) {
        return response.status(204).end()
      }
      else {
        return response.status(404).json({
          error: 'Person not found',
          solution: 'Please provide a valid ID'
        })
      }
    })
    .catch(error => {
      return response.status(500).json({
        error: `Internal server error: ${error.message}`,
        solution: 'Please try again later'
      })

    })
})
app.put('/api/persons/:id', (request,response) => {
  const id = request.params.id
  const { name, number } = request.body
  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number missing',
      solution: 'Please provide both name and number'
    })
  }
  Person.findByIdAndUpdate(id, { name, number }, { new: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        return response.json(updatedPerson)
      } else {
        return response.status(404).json({
          error: 'Person not found',
          solution: 'Please provide a valid ID'
        })
      }
    })
    .catch(error => {
      console.error('Error updating person:', error.message)
      return response.status(500).json({
        error: 'Internal server error',
        solution: 'Please try again later'
      })
    })
})
app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number missing',
      solution: 'Please provide both name and number'
    })
  }

  Person.findOne({ name }).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({
        error: 'name must be unique',
        solution: 'Please provide a unique name'
      })
    }

    const person = new Person({ name, number })
    return person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  }).catch(error => {
    next(error)
  })
})

const ErrorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(ErrorHandler)

const PORT =3001
app.listen(PORT)
