export const TOKEN_KEY = 'wb_access_token'
export const USER_KEY = 'wb_current_user'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/+$/, '')

function responseMessage(payload, status) {
  if (payload?.message) return payload.message
  const firstValidationError = Object.values(payload?.errors || {}).flat()[0]
  return firstValidationError || `Request failed (${status}). Please try again.`
}

export async function apiRequest(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  if (body !== undefined) requestHeaders['Content-Type'] = 'application/json'

  const token = auth ? localStorage.getItem(TOKEN_KEY) : null
  if (token) requestHeaders.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'omit',
    })
  } catch {
    throw new Error(`Cannot reach the API at ${API_BASE_URL}. Check that Laravel is running and VITE_API_BASE_URL is correct.`)
  }

  const payload = response.status === 204
    ? null
    : await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(responseMessage(payload, response.status))
  }

  return payload
}
