import { useState } from 'react'
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
        <h4>Likes {blog.likes} <button onClick={() => handleLikeSubmit(blog)}>like</button></h4>
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
export default Blog