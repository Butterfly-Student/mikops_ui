import { apiClient } from './api-client'
import type {
    PPPSecret,
    PPPProfile,
    PPPSecretInput,
    PPPSecretUpdateInput,
    PPPProfileInput,
} from '@/types/api'

/**
 * PPP API service
 */
export const pppApi = {
    /**
     * Get all PPP secrets
     */
    async getPPPSecrets(): Promise<PPPSecret[]> {
        return apiClient.get<PPPSecret[]>('/internal/ppp/secret/list')
    },

    /**
     * Create new PPP secret
     */
    async createPPPSecret(data: PPPSecretInput): Promise<PPPSecret> {
        return apiClient.post<PPPSecret>('/internal/ppp/secret', data)
    },

    /**
     * Update existing PPP secret
     */
    async updatePPPSecret(id: string, data: PPPSecretUpdateInput): Promise<PPPSecret> {
        return apiClient.put<PPPSecret>(`/internal/ppp/secret/${id}`, data)
    },

    /**
     * Delete PPP secret
     */
    async deletePPPSecret(id: string): Promise<{ message: string }> {
        return apiClient.delete<{ message: string }>(`/internal/ppp/secret/${id}`)
    },

    /**
     * Get all PPP profiles
     */
    async getPPPProfiles(): Promise<PPPProfile[]> {
        return apiClient.get<PPPProfile[]>('/internal/ppp/profile/list')
    },

    /**
     * Create new PPP profile
     */
    async createPPPProfile(data: PPPProfileInput): Promise<PPPProfile> {
        return apiClient.post<PPPProfile>('/internal/ppp/profile', data)
    },

    /**
     * Update existing PPP profile
     */
    async updatePPPProfile(id: string, data: Partial<PPPProfileInput>): Promise<PPPProfile> {
        return apiClient.put<PPPProfile>(`/internal/ppp/profile/${id}`, data)
    },

    /**
     * Delete PPP profile
     */
    async deletePPPProfile(id: string): Promise<{ message: string }> {
        return apiClient.delete<{ message: string }>(`/internal/ppp/profile/${id}`)
    },
}
