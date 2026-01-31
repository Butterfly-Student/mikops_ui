import { apiClient } from './api-client'
import type {
    MikrotikResponse,
    MikrotikListResponse,
    CreateMikrotikRequest,
    UpdateMikrotikRequest,
} from '@/types/api'

/**
 * MikroTik API service
 */
export const mikrotikApi = {
    /**
     * List all MikroTik devices
     * Note: Using POST as per requirement
     */
    async getDevices(): Promise<MikrotikListResponse> {
        // Based on provided Go model, response seems to be MikrotikListResponse
        // If API returns array directly, we might need to adjust or wrap it
        return apiClient.post<MikrotikListResponse>('/internal/mikrotik/list', {})
    },

    /**
     * Get single MikroTik device by ID
     */
    async getDevice(id: string): Promise<MikrotikResponse> {
        return apiClient.get<MikrotikResponse>(`/internal/mikrotik/${id}`)
    },

    /**
     * Create new MikroTik device
     */
    async createDevice(data: CreateMikrotikRequest): Promise<MikrotikResponse> {
        return apiClient.post<MikrotikResponse>('/internal/mikrotik', data)
    },

    /**
     * Update existing MikroTik device
     * Note: Endpoint implied from standard CRUD, though strictly only create/list/get/activate were requested.
     * Including for completeness if needed.
     */
    async updateDevice(id: string, data: UpdateMikrotikRequest): Promise<MikrotikResponse> {
        return apiClient.put<MikrotikResponse>(`/internal/mikrotik/${id}`, data)
    },

    /**
     * Set device as active
     */
    async activateDevice(id: string): Promise<MikrotikResponse> {
        return apiClient.patch<MikrotikResponse>(`/internal/mikrotik/${id}/activate`, {})
    },

    /**
     * Delete MikroTik device
     */
    async deleteDevice(id: string): Promise<{ message: string }> {
        return apiClient.delete<{ message: string }>(`/internal/mikrotik/${id}`)
    },
}
