import {useState} from 'react'
const BlogForm = ({ handleSubmit }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const handleBlogSubmit = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    handleSubmit(blogObject)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }
  return (
    <form onSubmit={handleBlogSubmit}>
      <div>
        Title: <input
          type="text"
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
          placeholder="Title"
        />
      </div>
      <div>
        Author: <input
          type="text"
          value={newAuthor}
          placeholder="Author"
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        URL: <input
          type="text"
          value={newUrl}
          placeholder= "URL"
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  )
}
export default BlogForm