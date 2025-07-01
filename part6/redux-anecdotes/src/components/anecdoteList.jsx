import {makeVote} from '../reducers/anecdoteReducer'
import {setNotification} from '../reducers/notificationReducer'
import {useSelector,useDispatch} from 'react-redux'



const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    const filter = state.filter.toLowerCase()
    console.log('anecdotes',state)
    return filter === 'all' ? state.anecdotes :state.anecdotes.filter(a => 
      a.content.toLowerCase().includes(filter)
    )
  })
  const dispatch = useDispatch()

  const handleVote = (id,content) => {
    dispatch(makeVote(id))
    dispatch(setNotification(`you voted '${content}'`,5))

  }
  const sortedAnecdotes = [...anecdotes].sort((a,b)=> b.votes - a.votes)
  console.log('sortedAnecdotes',sortedAnecdotes)
  return (
    <div>
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote.id,anecdote.content)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )}

export default AnecdoteList
      