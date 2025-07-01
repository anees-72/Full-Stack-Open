import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query'
import {getAll,updateAnecdote} from './services/requests'
import {useContext} from 'react'
import NotificationContext from './contexts/notificationContext'


const App = () => {
  const {setNotification} = useContext(NotificationContext)
  const queryClient = useQueryClient()
  const updateMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess:() => {
       queryClient.invalidateQueries({queryKey: ['anecdotes']})
    }})
  
  const handleVote = (anecdote) => {
    const updatedAnecdote = {...anecdote,votes: anecdote.votes +1}
    updateMutation.mutate(updatedAnecdote)
    setNotification(`you voted '${anecdote.content}'`,5)
  }
  
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    refetchOnWindowFocus: false,
    retry: 1
  })

  if (result.isLoading){
    return <div> Loading data ... </div>
  }
  
  if (result.isError){
    return <div><h1> Anecdote not available due to server error: <b>{result.error.message}</b></h1> </div>
  }
  const anecdotes = result.data
  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
