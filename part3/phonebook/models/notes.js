const mongoose = require('mongoose')
require('dotenv').config()


const url = process.env.MONGODB_URI

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLenght: 3,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v){
        return /\d{2,3}-\d{7,}/.test(v)
      }
    },

  }
})

const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = Person