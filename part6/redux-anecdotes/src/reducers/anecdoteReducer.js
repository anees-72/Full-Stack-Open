import { createSlice} from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'




const anecdoteSlice = createSlice({
  name:'anecdotes',
  initialState:[],
  reducers:{
    vote(state,action){
        const id = action.payload
        const anecdote = state.find( a => a.id === id)
        if (anecdote){
          anecdote.votes++
        }      
    },
    newAnecdote(state,action){
      state.push(action.payload)
    },
    setAnecdotes(state,action){
      return action.payload
    }
  }
})

export const {vote,newAnecdote,setAnecdotes} = anecdoteSlice.actions
export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}
export const makeAnecdote = (content) => {
  return async (dispatch) => {
    const created = await anecdoteService.createAnecdote(content)
    dispatch(newAnecdote(created))
  }
}
export const makeVote = (id) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.vote(id)
    dispatch(vote(updatedAnecdote.id))
  }
}

export default anecdoteSlice.reducer