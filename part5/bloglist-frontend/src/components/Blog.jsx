import { useState } from 'react'
import PropTypes from 'prop-types'
const Blog = ({ blog,handleLike,handleDelete }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const currentUser = JSON.parse(window.localStorage.getItem('LoggedInUser'))
  const handleLikeSubmit = (blog) => {
    handleLike(blog)
  }
  if (detailsVisible) {
    return (
      <div className="blog">
        <h4>{blog.title}  <button onClick={() => setDetailsVisible(false)}>hide</button></h4>
        <h4>{blog.url}</h4>
        <h4>Likes {blog.likes} <button data-testid="like-button" onClick={() => handleLikeSubmit(blog)}>like</button></h4>
        <h4>{blog.author}</h4>
        {currentUser.username === blog.user.username && (
          <button onClick={() => handleDelete(blog)}>remove</button>
        )}
      </div>
    )
  }
  return (
    <div className="blog">
      <h4>{blog.title}  {blog.author} <button onClick = {() => setDetailsVisible(true)}>show</button></h4>
    </div>
  )
}

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
          data-testid="title"
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        Author: <input
          type="text"
          data-testid="author"
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        URL: <input
          type="text"
          value={newUrl}
          data-testid="url"
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  )
}

BlogForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}
export default { Blog, BlogForm }