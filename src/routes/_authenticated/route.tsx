import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/auth-store'
import { authApi } from '@/lib/auth-api'
import { refreshAccessToken } from '@/lib/token-refresh'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const { auth } = useAuthStore.getState()

    // If no access token, try to refresh if we have refresh token
    if (!auth.accessToken) {
      if (auth.refreshToken) {
        try {
          // Attempt to refresh the token
          await refreshAccessToken()
          // After refresh, continue with the route
        } catch (error) {
          // Refresh failed, redirect to login
          console.error('Token refresh failed in beforeLoad:', error)
          throw redirect({
            to: '/sign-in',
            search: {
              redirect: location.href,
            },
          })
        }
      } else {
        // No refresh token, redirect to login
        throw redirect({
          to: '/sign-in',
          search: {
            redirect: location.href,
          },
        })
      }
    }

    // If we have a token but no user data, fetch the profile
    if (!auth.user) {
      try {
        const profile = await authApi.getProfile()
        auth.setUser(profile)
      } catch (error) {
        // If profile fetch fails (e.g., 401), the API client will auto-refresh
        // If that also fails, reset and redirect
        console.error('Failed to fetch profile:', error)
        auth.reset()
        throw redirect({
          to: '/sign-in',
          search: {
            redirect: location.href,
          },
        })
      }
    }
  },
  component: AuthenticatedLayout,
})
