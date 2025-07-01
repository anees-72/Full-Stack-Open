import axios from 'axios'
const baseUrl = 'https://orange-engine-4jg45v6xqw4924r7-3001.app.github.dev/anecdotes'

const getAll = async() => {
    const response = await axios.get(baseUrl)
    return response.data
}

const createAnecdote = async(content) => {
    const object = {content, votes:0}
    const response = await axios.post(baseUrl,object)
    return response.data
}

const vote = async(id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    const updatedAnecdote = {...response.data, votes: response.data.votes + 1}
    const updatedResponse = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
    return updatedResponse.data
}
export default {getAll,createAnecdote,vote}