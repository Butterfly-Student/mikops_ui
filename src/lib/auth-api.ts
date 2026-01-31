import { apiClient } from './api-client'
import type {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    LogoutRequest,
    LogoutResponse,
    User,
} from '@/types/api'

/**
 * Authentication API service
 */
export const authApi = {
    /**
     * Login with username/email and password
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>('/auth/login', credentials, {
            skipAuth: true, // Login doesn't require auth token
        })
    },

    /**
     * Refresh access token using refresh token
     */
    async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
        const payload: RefreshTokenRequest = { refresh_token: refreshToken }
        return apiClient.post<RefreshTokenResponse>('/auth/refresh', payload, {
            skipAuth: true, // Refresh doesn't require existing access token
        })
    },

    /**
     * Logout and invalidate refresh token
     */
    async logout(refreshToken: string): Promise<LogoutResponse> {
        const payload: LogoutRequest = { refresh_token: refreshToken }
        return apiClient.post<LogoutResponse>('/auth/logout', payload)
    },

    /**
     * Get current authenticated user profile
     */
    async getProfile(): Promise<User> {
        return apiClient.get<User>('/auth/profile')
    },
}
