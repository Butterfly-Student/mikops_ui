import { apiClient } from './api-client'
import type {
    CustomerResponse,
    CustomerListResponse,
    CreateCustomerRequest,
    UpdateCustomerRequest,
} from '@/types/api'

/**
 * Customer API service
 */
export const customerApi = {
    /**
     * Get all customers
     */
    async getCustomers(): Promise<CustomerListResponse> {
        return apiClient.get<CustomerListResponse>('/internal/customer/list')
    },

    /**
     * Get single customer by ID
     */
    async getCustomer(id: string): Promise<CustomerResponse> {
        return apiClient.get<CustomerResponse>(`/internal/customer/${id}`)
    },

    /**
     * Create new customer
     */
    async createCustomer(data: CreateCustomerRequest): Promise<CustomerResponse> {
        return apiClient.post<CustomerResponse>('/internal/customer', data)
    },

    /**
     * Update existing customer
     */
    async updateCustomer(id: string, data: UpdateCustomerRequest): Promise<CustomerResponse> {
        return apiClient.put<CustomerResponse>(`/internal/customer/${id}`, data)
    },

    /**
     * Delete customer
     */
    async deleteCustomer(id: string): Promise<{ message: string }> {
        return apiClient.delete<{ message: string }>(`/internal/customer/${id}`)
    },
}
