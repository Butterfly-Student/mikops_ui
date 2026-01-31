import { apiClient } from './api-client'
import type { User, UpdateProfileRequest, UpdateAccountRequest } from '@/types/api'

/**
 * User API service
 */
export const userApi = {
    /**
     * Get current user profile
     */
    async getProfile(): Promise<User> {
        return apiClient.get<User>('/auth/profile')
    },

    /**
     * Update user profile
     * Note: Adjust endpoint based on your actual backend API
     */
    async updateProfile(data: UpdateProfileRequest): Promise<User> {
        // Assuming PATCH /auth/profile for updating profile
        // Adjust the endpoint if your API uses a different route
        return apiClient.patch<User>('/auth/profile', data)
    },

    /**
     * Update user account settings
     * Note: Adjust endpoint based on your actual backend API
     */
    async updateAccount(data: UpdateAccountRequest): Promise<User> {
        // Assuming PATCH /auth/profile for updating account
        // Adjust the endpoint if your API uses a different route
        return apiClient.patch<User>('/auth/profile', data)
    },

    /**
     * Upload user avatar
     * Note: This is a placeholder - adjust based on your actual backend implementation
     */
    async uploadAvatar(file: File): Promise<{ avatar: string }> {
        const formData = new FormData()
        formData.append('avatar', file)

        // Note: This might not use the standard API client if it needs multipart/form-data
        // Adjust based on your actual backend implementation
        const response = await fetch(
            `${import.meta.env.VITE_BASE_API_URL}/auth/avatar`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${apiClient}`,
                },
            }
        )

        if (!response.ok) {
            throw new Error('Failed to upload avatar')
        }

        const data = await response.json()
        return data.data
    },
}
