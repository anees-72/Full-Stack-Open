const { test, expect, beforeEach, describe } = require('@playwright/test')

async function login (page,username,password,status = 200){
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await Promise.all([
    page.waitForResponse(res => res.url().includes('/api/login') && res.status() === status),
    page.getByRole('button',{name: /login/i}).click()
  ])
}
async function createBlog(page,{title,author,url}){
      await page.getByRole('button', {name:/create Note/i}).click()
      await page.getByTestId('title').fill(title)
      await page.getByTestId('author').fill(author)
      await page.getByTestId('url').fill(url)
      await Promise.all([
        page.waitForResponse(res => res.url().includes('/api/blogs') && res.status() === 201),
        page.getByRole('button', { name: /create/i }).click()
      ])
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.get('https://orange-engine-4jg45v6xqw4924r7-3003.app.github.dev/api/reset')
    await request.post('https://orange-engine-4jg45v6xqw4924r7-3003.app.github.dev/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('https://orange-engine-4jg45v6xqw4924r7-5173.app.github.dev')
    await page.getByRole('button', {name: 'Continue', exact:true}).click()
    
    
  })

  test('Login form is shown', async ({ page }) => {
    const usernameInput = page.getByTestId('username')
    const passwordInput = page.getByTestId('password')
    const loginButton = page.getByTestId('login-button')
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(loginButton).toBeVisible()
  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({page}) => {
        await login(page,'mluukkai','salainen',200)
        await expect(page.getByText('Matti Luukkainen Logged In')).toBeVisible()
        await page.getByRole('button',{name:'logout'}).click()
    })
    test('fails with wrong credentials', async({page})=> {
        await login(page,'mluukkai','wrong',401)
        await expect(page.getByText(/Wrong credentials/i)).toBeVisible()
    })
  })
  describe('Blogs',() => {
    test('a new blog can be created', async ({page}) => {
      await login(page,'mluukkai','salainen')
      await createBlog(page,{title:'new Blog',author:'Anees Ali',url:'https://example1.com'})
      await expect(page.getByText('A new blog new Blog by Anees Ali added')).toBeVisible()
      await page.getByRole('button',{name: /logout/i}).click()
    })
    test('a blog can be liked', async ({page}) => {
      await login(page,'mluukkai','salainen')
      await createBlog(page,{title:'second Blog',author:'Anees Ali',url:'https://example2.com'})
      await expect(page.getByText('A new blog second Blog by Anees Ali added')).toBeVisible()
      const showButton=await page.getByRole('button', {name:/show/i}).first()
      if (await showButton.isVisible()) {
        await showButton.click()
      }
      await Promise.all([
        page.waitForResponse(res => res.url().includes('/api/blogs') && res.status() === 200),
        page.getByTestId('like-button').click()
      ])
      await expect(page.getByText(/Likes 1/i)).toBeVisible()
    })
    test('a blog can be deleted', async({ page }) => {
  await login(page, 'mluukkai', 'salainen')
  await createBlog(page, {
    title: 'third Blog',
    author: 'Anees Ali',
    url: 'https://example4.com'
  })

  await expect(page.getByText('A new blog third Blog by Anees Ali added')).toBeVisible()

  await page.reload()

  const showButton = page.getByRole('button', { name: /show/i }).first()
  await showButton.waitFor()
  await showButton.click()

  page.once('dialog', async dialog => {
    expect(dialog.type()).toBe('confirm')
    await dialog.accept()
  })

  await page.getByRole('button', { name: /remove/i }).click()

  await expect(page.getByText(/third Blog Anees Ali/i)).not.toBeAttached()
    })
  test('only the person who created the blog can see the remove button', async ({ page, request }) => {
  await request.post('https://orange-engine-4jg45v6xqw4924r7-3003.app.github.dev/api/users', {
    data: {
      name: 'Anees Ali',
      username: 'aneesali',
      password: 'aneesali1'
    }
  })

  await login(page, 'aneesali', 'aneesali1')
  await createBlog(page, {
    title: 'fifth Blog',
    author: 'Anees Ali',
    url: 'https://example6.com'
  })
  await expect(page.getByText(/A new blog fifth Blog by Anees Ali added/i)).toBeVisible()
  await page.getByRole('button', { name: /logout/i }).click()
  await login(page, 'mluukkai', 'salainen')
  await page.reload()
  const showButton = page.getByRole('button', { name: /show/i }).first()
  await showButton.waitFor()
  await showButton.click()
  await expect(page.getByRole('button', { name: /remove/i })).toHaveCount(0)
   })
  test('blogs are sorted according to the likes in descending order',async({page})=>{
    await login(page,'mluukkai','salainen',200)
    await createBlog(page,{title:'first Blog',author:'Anees Ali',url:'https://example.com'})
    await expect(page.getByText(/A new Blog first Blog by Anees Ali added/i)).toBeVisible()
    await createBlog(page,{title:'second Blog',author:'Anees Ali',url:'https://example1.com'})
    await page.getByRole('button',{name:/show/i}).last().click()
    await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/blogs') && res.status() === 200),
      page.getByRole('button',{name:/like/i}).click()
    ])
    await page.reload()
    const showButton = page.getByRole('button',{name:/show/i}).first()
    showButton.waitFor()
    showButton.click()
    await expect(page.getByText(/Likes 1/i)).toBeVisible()
  })
  })
})