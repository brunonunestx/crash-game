import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { routesConfig } from '@/routes/routes.config'

type UserTokens = {
  access_token: string
  refresh_token: string
}

function getTokens(): UserTokens | null {
  const raw = localStorage.getItem('user_tokens')
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserTokens
  } catch {
    return null
  }
}

async function refreshTokens(): Promise<UserTokens> {
  const tokens = getTokens()
  if (!tokens?.refresh_token) throw new Error('No refresh token')

  const url = import.meta.env.VITE_KEYCLOAK_URL as string
  const realm = import.meta.env.VITE_KEYCLOAK_REALM as string
  const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string

  const response = await fetch(
    `${url}/realms/${realm}/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'refresh_token',
        refresh_token: tokens.refresh_token,
      }),
    },
  )

  if (!response.ok) throw new Error('Refresh failed')

  const data = await response.json()
  const newTokens: UserTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  }

  localStorage.setItem('user_tokens', JSON.stringify(newTokens))
  return newTokens
}

function redirectToLogin() {
  localStorage.removeItem('user_tokens')
  window.location.href = routesConfig.login.path
}

export class BaseRepository {
  http: AxiosInstance

  constructor(path: string) {
    this.http = this.buildInstance(path)
  }

  buildInstance(path: string): AxiosInstance {
    const gamesApiUrl = import.meta.env.VITE_API_URL as string
    const url = new URL('/games' + path, gamesApiUrl)
    const instance = axios.create({ baseURL: url.toString() })

    instance.interceptors.request.use((config) => {
      const tokens = getTokens()
      if (tokens?.access_token) {
        config.headers.Authorization = `Bearer ${tokens.access_token}`
      }
      return config
    })

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const newTokens = await refreshTokens()
            originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`
            return instance(originalRequest)
          } catch {
            redirectToLogin()
          }
        }

        return Promise.reject(error)
      },
    )

    return instance
  }
}
