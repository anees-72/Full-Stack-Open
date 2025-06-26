import axios from 'axios'
const baseUrl = 'https://orange-engine-4jg45v6xqw4924r7-3003.app.github.dev/api/login'

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }