import { useState, useEffect, useRef } from 'react'
import blogComponents from './components/Blog'
import LoginForm from './components/Login'
import Toggleable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'
import './styles.css'


const { Blog, BlogForm } = blogComponents
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const BlogFormRef = useRef()
  const Notification = ({ message }) => {
    if (message === null) { 
      return null
    }
    return (
      <div className="notification">
        {message}
      </div>
    )
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = { ...blog, likes: blog.likes + 1 }
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
      setMessage('Likes updated successfully')
      setTimeout(() => {
        setMessage(null)
      },5000)
    }catch (exception) {
      console.error('Error updating likes:', exception)
      setMessage('Error updating likes try again')
      setTimeout(()  => {
        setMessage(null)
      },5000)
    }
  }
  
  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setMessage(`Blog ${blog.title} by ${blog.author} removed successfully`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
      catch (exception) {
        console.error('Error deleting blog:', exception)
        setMessage('Error deleting blog')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    }
    else {
      setMessage('Blog deletion cancelled')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }}
  const handleSubmit = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      BlogFormRef.current.toggleVisibility()
      setMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setBlogs(blogs.concat(returnedBlog))
      
    }
    catch(exception) {
      console.error ('Error creating blog:', exception)
      setMessage('Error creating blog')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })  
  }, [])

  useEffect(() => {
    const LoggedInUserJSON = window.localStorage.getItem('LoggedInUser')
    if (LoggedInUserJSON) {
      const user = JSON.parse(LoggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const logout = () => {
    window.localStorage.removeItem('LoggedInUser')
    setUser(null)
    setMessage('Logged out successfully')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
    blogService.setToken(null)
    setUsername('')
    setPassword('')
  }
  
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'LoggedInUser', JSON.stringify(user)
      )
      setMessage(`Welcome ${user.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch(exception) {
      console.error('Login failed:', exception)
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div>
      <Notification message={message} />
      <h1>blogs</h1>
      {user ? <div><p>{user.name} Logged In <button onClick={logout}>Logout</button></p><br /> <Toggleable buttonLabel = "create Note" ref={BlogFormRef} ><BlogForm handleSubmit={handleSubmit} /> </Toggleable></div>:<div><h3>Log In to Application</h3> <LoginForm username={username} password={password} setUsername={setUsername} setPassword={setPassword} handleLogin={handleLogin} /> <br /> </div> }
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} />
      )}
    </div>
  )
}

export default App