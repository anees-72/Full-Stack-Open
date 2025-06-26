const LoginForm = ({ handleLogin, username, password, setUsername, setPassword }) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
                Username: <input type="text" name="username" data-testid ="username" value={username} onChange={({ target }) => setUsername(target.value)} /><br />
                Password: <input type="password" name="Password" data-testid="password" value={password} onChange={({ target }) => setPassword(target.value)} /><br />
        <button type="submit" data-testid="login-button">Login</button>
      </div>
    </form>
  )
}

export default LoginForm