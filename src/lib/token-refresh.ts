import { useAuthStore } from '@/stores/auth-store'
import { authApi } from './auth-api'

/**
 * Flag to prevent multiple simultaneous refresh attempts
 */
let isRefreshing = false

/**
 * Queue of pending requests waiting for token refresh
 */
let refreshSubscribers: Array<(token: string) => void> = []

/**
 * Subscribe to token refresh completion
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
    refreshSubscribers.push(callback)
}

/**
 * Notify all subscribers that token has been refreshed
 */
function onTokenRefreshed(token: string) {
    refreshSubscribers.forEach((callback) => callback(token))
    refreshSubscribers = []
}

/**
 * Attempt to refresh the access token using the refresh token
 * Returns the new access token or throws error
 */
export async function refreshAccessToken(): Promise<string> {
    const { auth } = useAuthStore.getState()

    // If already refreshing, wait for the current refresh to complete
    if (isRefreshing) {
        return new Promise<string>((resolve) => {
            subscribeTokenRefresh((token: string) => {
                resolve(token)
            })
        })
    }

    // Check if we have a refresh token
    if (!auth.refreshToken) {
        throw new Error('No refresh token available')
    }

    try {
        isRefreshing = true

        // Call refresh token API
        const response = await authApi.refreshToken(auth.refreshToken)

        // Update access token in store
        auth.setAccessToken(response.access_token, response.expires_in)

        // If token was rotated, update refresh token as well
        if (response.rotation && response.refresh_token) {
            auth.setRefreshToken(response.refresh_token, response.refresh_expires_in)
        }

        // Notify all waiting requests
        onTokenRefreshed(response.access_token)

        return response.access_token
    } catch (error) {
        // Refresh failed - clear auth state and redirect to login
        auth.reset()

        // If we're in a browser context, redirect to login
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname + window.location.search
            window.location.href = `/sign-in?redirect=${encodeURIComponent(currentPath)}`
        }

        throw error
    } finally {
        isRefreshing = false
    }
}

/**
 * Check if an error is a 401 Unauthorized error
 */
export function isUnauthorizedError(error: unknown): boolean {
    return (
        error instanceof Error &&
        'statusCode' in error &&
        (error as { statusCode?: number }).statusCode === 401
    )
}
