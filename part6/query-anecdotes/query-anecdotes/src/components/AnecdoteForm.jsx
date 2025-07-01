import {useQueryClient,useMutation} from '@tanstack/react-query'
import {createNew} from '../services/requests'
import {useContext} from 'react'
import NotificationContext from '../contexts/notificationContext'


const AnecdoteForm = () => {
  const {setNotification} = useContext(NotificationContext)
  const queryClient = useQueryClient()
  const newMutation = useMutation({mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'],anecdotes.concat(newAnecdote))
    },
    onError: (error) => {
      setNotification(error.response.data.error, 5)
    }
  })
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newMutation.mutate({content,votes: 0})
    if(content.length >5){
    setNotification(`you created '${content}'`,5)}
    console.log('new anecdote',content)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
