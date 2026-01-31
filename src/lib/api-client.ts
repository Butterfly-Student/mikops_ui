import { getCookie } from './cookies'
import type { ApiResponse, ApiError } from '@/types/api'

const ACCESS_TOKEN = 'mikrobill_access_token'

/**
 * API Client error class for better error handling
 */
export class ApiClientError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public response?: ApiError
    ) {
        super(message)
        this.name = 'ApiClientError'
    }
}

/**
 * API client configuration
 */
interface ApiClientConfig {
    baseURL?: string
    headers?: Record<string, string>
}

/**
 * Request options
 */
interface RequestOptions extends RequestInit {
    headers?: Record<string, string>
    skipAuth?: boolean
    tenantId?: string
}

/**
 * Centralized API client for making requests to the backend
 */
class ApiClient {
    private baseURL: string

    constructor(config: ApiClientConfig = {}) {
        this.baseURL = config.baseURL || import.meta.env.VITE_BASE_API_URL || 'http://localhost:8000/v1'
    }

    /**
     * Get default headers for requests
     */
    private getHeaders(options?: RequestOptions): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options?.headers,
        }

        // Add authorization header if not skipped
        if (!options?.skipAuth) {
            const accessToken = getCookie(ACCESS_TOKEN)
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`
            }
        }

        // Add tenant ID header if provided (for super admins)
        if (options?.tenantId) {
            headers['X-Tenant-ID'] = options.tenantId
        }

        return headers
    }

    /**
     * Make a request to the API with automatic token refresh on 401
     */
    private async request<T>(
        endpoint: string,
        options: RequestOptions = {},
        retryCount = 0
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`
        const headers = this.getHeaders(options)

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            })

            const data: ApiResponse<T> | ApiError = await response.json()

            // Check if response is 401 Unauthorized and we haven't already retried
            if (response.status === 401 && retryCount === 0 && !options.skipAuth) {
                // Dynamically import to avoid circular dependency
                const { refreshAccessToken } = await import('./token-refresh')

                try {
                    // Attempt to refresh the token
                    await refreshAccessToken()

                    // Retry the original request with the new token
                    return this.request<T>(endpoint, options, retryCount + 1)
                } catch (refreshError) {
                    // Refresh failed, throw the original 401 error
                    throw new ApiClientError(
                        data.error || 'Session expired. Please sign in again.',
                        response.status,
                        data as ApiError
                    )
                }
            }

            // Check if response is successful
            if (!response.ok || !data.success) {
                throw new ApiClientError(
                    data.error || 'An error occurred',
                    response.status,
                    data as ApiError
                )
            }

            // Return the data from successful response
            return (data as ApiResponse<T>).data as T
        } catch (error) {
            // Re-throw ApiClientError as-is
            if (error instanceof ApiClientError) {
                throw error
            }

            // Handle network errors or other fetch errors
            if (error instanceof Error) {
                throw new ApiClientError(
                    error.message || 'Network error occurred',
                    undefined,
                    undefined
                )
            }

            throw new ApiClientError('Unknown error occurred')
        }
    }

    /**
     * Make a GET request
     */
    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'GET',
        })
    }

    /**
     * Make a POST request
     */
    async post<T>(
        endpoint: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        })
    }

    /**
     * Make a PUT request
     */
    async put<T>(
        endpoint: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        })
    }

    /**
     * Make a PATCH request
     */
    async patch<T>(
        endpoint: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        })
    }

    /**
     * Make a DELETE request
     */
    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'DELETE',
        })
    }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient()

/**
 * Create a new API client instance with custom configuration
 */
export function createApiClient(config: ApiClientConfig): ApiClient {
    return new ApiClient(config)
}
