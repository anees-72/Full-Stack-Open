import axios from 'axios'

const baseUrl = 'https://orange-engine-4jg45v6xqw4924r7-3001.app.github.dev/anecdotes'

export const getAll = () => 
    axios.get(baseUrl).then(res => res.data)

export const createNew = (anecdote) =>
    axios.post(baseUrl,anecdote).then(res=> res.data)

export const updateAnecdote = (updatedAnecdote) =>
    axios.put(`${baseUrl}/${updatedAnecdote.id}`,updatedAnecdote).then(res => res.data)