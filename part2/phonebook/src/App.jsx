import { useState,useEffect } from 'react'
import peopleData from './services/people'

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message, setMessage] = useState(null)
  const [className, setClassName] = useState(null)
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  const personstoshow = filter? filteredPersons : persons
  useEffect(() => {
    peopleData
      .getAll()
      .then(initialData => {
        setPersons(initialData)
      })
  },[])
  const handleSubmit = (event) => {
    event.preventDefault()
    const name = newName
    if (persons.some(person => person.name === newName)) {
      const person=persons.find(person => person.name === newName)
      if (person.number !== newNumber){
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
          const updatedPerson = {...person,number:newNumber}
          peopleData
            .update(person.id,updatedPerson)
            .then(returnedPerson => {
              setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
              setMessage(`Updated ${returnedPerson.name}'s number`)
              setClassName('success')
              setTimeout(() => {
                setMessage(null)
                setClassName(null)
              },5000)
              })
            
            setNewName('')
            setNewNumber('')
            return
        }
      }
      else{alert(`${newName} is already added to phonebook with the same number`)
      setNewName('')
      setNewNumber('')
      return}
      
    }
    else{ 
      const newPerson = {
        name:name,
        number:newNumber
      }
      peopleData
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setMessage(`Added ${returnedPerson.name} in phonebook`)
          setClassName('success')
          setTimeout(() => {
            setMessage(null)
            setClassName(null)
          },5000)
        })
      setNewName('')
      setNewNumber('')}
  
  }
  
  const handleName = (event) => {
    const name = event.target.value
    setNewName(name)
  }
  const handleNumber = (event) => {
    const number =event.target.value
    setNewNumber(number)
  }
  const handlefilter = (event) => {
    const filter = event.target.value
    setFilter(filter)

  }
  const handleDelete = (id) => {
    if (window.confirm(`Delete ${persons.find(person => person.id === id).name}?`)){
      peopleData
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage(`Deleted ${persons.find(person => person.id === id).name} from phonebook`)
          setClassName('danger')
          setTimeout(() => {
            setMessage(null)
            setClassName(null)
          },5000)
        })
        .catch(error => {
          alert(`Information of ${persons.find(person => person.id === id).name} has already been removed from server`)
          setPersons(persons.filter(person => person.id !== id))
          setMessage(`Information of ${persons.find(person => person.id === id).name} has already been removed from server`)
          setClassName('danger')
          setTimeout(() => {
            setMessage(null)
            setClassName(null)
          },5000)
        })
    }
  }

  
  return (
    
    <div className="container">
    <div className="row">
      
      <h1 className="text-center" style={{color:'lightblue'}}>Phonebook</h1>
      <Notification message={message} className={className} />
    <div className="col-md-6 mr-2">
    <div className="card" style={{ margin:'auto',marginTop:'20vh', padding:'auto'}}>
      
      
      <Filter handlefilter={handlefilter} />
      <h3 className="text-center">Add a new</h3>
      <Form handleSubmit={handleSubmit} handleName={handleName} handleNumber={handleNumber} newName={newName} newNumber={newNumber} />
      </div>
      </div>
      <div className="col-md-6"> 
        <div className="card" style={{marginTop:'20vh'}}><h2 className="text-center mt-2" style={{color:'blue'}}>Numbers</h2>
      <Persons personstoshow={personstoshow}  handleDelete={handleDelete}  /></div>     
        
      </div>
      
    </div>
    </div>
    
  )
}

const Filter = ({handlefilter}) => {
  return (
    <div className="form-group text-center mt-2">
      filter shown with: <input className="form-control" onChange={handlefilter} />
      </div>
  )
}

const Form = ({handleSubmit, handleName, handleNumber, newName, newNumber}) => {
  return(
    <form onSubmit={handleSubmit}>
        <div className="form-group">
          name: <input className="form-control" onChange={handleName} value={newName} /><br />
          number: <input className="form-control" onChange={handleNumber} value={newNumber} />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary mt-2 mb-2">add</button>
        </div>
      </form>
  )
}

const Persons = ({personstoshow,handleDelete}) => {
  const [isActive, setIsActive] = useState(null)
  const handleMouseEnter = (id) => {
    setIsActive(id)
  }
  const handleMouseLeave = () => {
    setIsActive(null)
  }
  return(
    <div className="scroll-container">
  <ul className="list-group">
        {personstoshow.map(person => {
          return(
            <li key={person.id} className={`list-group-item ${isActive===person.id? 'active' : ''}`} onMouseEnter={()=>handleMouseEnter(person.id)} onMouseLeave={handleMouseLeave}>
              {person.name}  {person.number} <button className={`btn ${isActive===person.id? 'btn-info': 'btn-primary'} ml-2`} onClick={()=>handleDelete(person.id)}>delete</button>
            </li>
          )
        })}
      </ul></div>)
}

const Notification = ({message, className}) => {
  if (message === null){
    return null
  }
  else{
    return(
      <div className={`alert alert-${className}`} role="alert" style={{width:'50vw',margin:'auto'}}>
        {message}
      </div>
    )
  }
}
export default App