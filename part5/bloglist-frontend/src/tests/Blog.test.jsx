import {screen, render} from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './BlogForm'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'

test('render title and author', () => {
    const blog = {
        title: 'new blog',
        author: 'anees ali',
        url: 'https://aneesali-webdev/development'
    }
    render(<Blog blog ={blog} />)
    const element = screen.getByText('new blog anees ali')
    expect(element).toBeDefined()
    const element2 = screen.queryByText('https://aneesali-webdev/development')
    expect(element2).toBeNull()
    const element3 = screen.queryByText('likes  0')
    expect(element3).toBeNull()
})
test('render url and likes after clicking the button', async () => {
    const blog = {
        title: 'newBlog',
        author: 'Anees Ali',
        url: 'https://aneesali-webdev/development',
        likes: 0,
        user: {
            username: 'aneesali'
        }
    }
    window.localStorage.setItem('LoggedInUser', JSON.stringify({ username: 'aneesali' }))
    render(<Blog blog={blog} />)
    const button = screen.getByText('show')
    const user = userEvent.setup()
    await user.click(button)
    const element = screen.getByText('https://aneesali-webdev/development')
    expect(element).toBeDefined()
    const element2 = screen.queryByText((text)=> text.includes('Likes 0'))
    expect(element2).toBeInTheDocument()
    const button2 = screen.getByText('hide')
    await user.click(button2)
    const element3 = screen.queryByText('https://aneesali-webdev/development')
    expect(element3).toBeNull()
})
test('clicking the like button twice calls event handler twice', async () => {
    const blog = {
        title: 'newBlog',
        author:'Anees Ali',
        url: 'https://aneesali-webdev/development',
        likes: 0,
        user: {
            username: 'aneesali'
        }
    }
    const mockHandler = vi.fn()
    window.localStorage.setItem('LoggedInUser', JSON.stringify({ username: 'aneesali' }))   
    render(<Blog blog={blog} handleLike={mockHandler} />)
    const button = screen.getByText('show')
    const user = userEvent.setup()
    await user.click(button)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
    expect(mockHandler.mock.calls[0][0]).toEqual(blog)
})
test('form calls event handler with correct details', async () => {
     const handleSubmit = vi.fn()
     const user = userEvent.setup()
     render(<BlogForm handleSubmit={handleSubmit} />)
     const inputtitle = screen.getByPlaceholderText('Title')
     const inputAuthor = screen.getByPlaceholderText('Author')
     const inputUrl = screen.getByPlaceholderText('URL')
     await user.type(inputtitle,'new blog')
     await user.type(inputAuthor,'anees ali')
     await user.type(inputUrl,'https://aneesali-webdev/development')
     const button = screen.getByText('Create')
     await user.click(button)
     expect(handleSubmit.mock.calls).toHaveLength(1)
     expect(handleSubmit.mock.calls[0][0]).toEqual({
        title: 'new blog',
        author: 'anees ali',
        url: 'https://aneesali-webdev/development'
     })

})