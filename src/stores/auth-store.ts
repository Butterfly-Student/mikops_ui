import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import type { User } from '@/types/api'

const ACCESS_TOKEN = 'mikrobill_access_token'
const REFRESH_TOKEN = 'mikrobill_refresh_token'

interface AuthState {
  auth: {
    user: User | null
    setUser: (user: User | null) => void
    accessToken: string
    setAccessToken: (accessToken: string, expiresIn?: number) => void
    resetAccessToken: () => void
    refreshToken: string
    setRefreshToken: (refreshToken: string, expiresIn?: number) => void
    resetRefreshToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieAccessToken = getCookie(ACCESS_TOKEN)
  const cookieRefreshToken = getCookie(REFRESH_TOKEN)

  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: cookieAccessToken || '',
      setAccessToken: (accessToken, expiresIn) =>
        set((state) => {
          // Set cookie with expiration time if provided (convert seconds to seconds)
          // Default to 15 minutes (900 seconds) if not provided
          const maxAge = expiresIn || 900
          setCookie(ACCESS_TOKEN, accessToken, maxAge)
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      refreshToken: cookieRefreshToken || '',
      setRefreshToken: (refreshToken, expiresIn) =>
        set((state) => {
          // Set cookie with expiration time if provided (convert seconds to seconds)
          // Default to 30 days (2592000 seconds) if not provided
          const maxAge = expiresIn || 2592000
          setCookie(REFRESH_TOKEN, refreshToken, maxAge)
          return { ...state, auth: { ...state.auth, refreshToken } }
        }),
      resetRefreshToken: () =>
        set((state) => {
          removeCookie(REFRESH_TOKEN)
          return { ...state, auth: { ...state.auth, refreshToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(REFRESH_TOKEN)
          return {
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
              refreshToken: '',
            },
          }
        }),
    },
  }
})
