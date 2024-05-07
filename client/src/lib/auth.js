import jwtDecode from 'jwt-decode'

const ACCESS_TOKEN_KEY = 'accessToken'
const API_URL = 'https://graphql-chat-server-aa595544a3a1.herokuapp.com/'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getUser() {
  const token = getAccessToken()
  if (!token) {
    return null
  }
  return getUserFromToken(token)
}

export async function login(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
  if (response.ok) {
    const { token } = await response.json()
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
    return username
  }
  return null
}

export function logout() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

function getUserFromToken(token) {
  const jwtPayload = jwtDecode(token)
  return jwtPayload.sub
}
