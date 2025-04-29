const express = require('express')
const { builtinModules } = require('module')
const app = express()
const morgan = require('morgan')
morgan.token('type',(req,res)=>{
   return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status  :response-time ms :type'))
const path=require('path')
app.use(express.static('dist'))
app.use(express.json())
let notes = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/',(request,response)=>{
   response.sendFile(path.resolve(__dirname,'..','dist','index.html'))
})
app.get('/api/persons',(request,response)=>{
    response.json(notes)
})

app.get('/info',(request,response)=>{
    response.send(`<p>Phonebook has info for ${notes.length} people</p>
      <p>${new Date()}</p>`)
})

app.get('/api/persons/:id',(request,response)=>{
   const id = request.params.id
   const person = notes.find(note => note.id === id)
   if (person){
    response.send(person)
   }
   else{
    response.status(404).end()
   }
})

app.delete('/api/persons/:id',(request,response)=>{
  const id = request.params.id
  notes = notes.filter(note=> note.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const data = request.body;
  const name = data.name;
  const number = data.number;

  if (!name || !number) {
    return response.status(400).json({ error: "Name or number is missing",solution:"enter the missing name or number both fields should be present and filled" });
  }

  if (notes.find(n => n.name === name)) {
    return response.status(409).json({ error: "Name already exists",solution:"Change the name" });
  }

  let id;
  do {
    id = Math.floor(Math.random() * 10000);
  } while (notes.find(n => n.id === String(id)));

  data.id = String(id);
  notes.push(data);
  response.status(201).json(data);
})

const PORT =3001
app.listen(PORT)
module.exports=app