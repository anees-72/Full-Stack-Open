import {useDispatch} from 'react-redux'
import {makeAnecdote} from '../reducers/anecdoteReducer'
import {setNotification} from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.content.value
        event.target.content.value = ''
        dispatch(makeAnecdote(content))
        dispatch(setNotification(`you created '${content}'`,5))
  }
  return (
    <div>
    <h2>create new</h2>
      <form onSubmit = {addAnecdote}>
        <div><input type="text" name="content" /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}
export default AnecdoteForm
