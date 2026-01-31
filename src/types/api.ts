/**
 * Standard API response structure from backend
 */
export interface ApiResponse<T = unknown> {
    success: boolean
    data: T | null
    metadata: {
        total: number
        limit: number
        offset: number
    }
    error: string | null
}

/**
 * User status enum
 */
export type UserStatus = 'active' | 'inactive' | 'suspended'

/**
 * User role enum
 */
export type UserRole = 'super_admin' | 'admin' | 'viewer'

/**
 * Complete User model matching backend struct
 */
export interface User {
    id: string
    tenant_id?: string | null
    username: string
    email: string
    fullname: string
    phone?: string | null
    avatar?: string | null
    role_id?: string | null
    user_role: UserRole
    status: UserStatus
    is_superadmin: boolean
    last_login_at?: string | null
    last_ip?: string | null
    failed_login_attempts: number
    locked_until?: string | null
    password_changed_at?: string | null
    force_password_change: boolean
    two_factor_enabled: boolean
    created_by?: string | null
    updated_by?: string | null
    created_at: string
    updated_at: string
}

/**
 * Login request payload
 */
export interface LoginRequest {
    email?: string
    username?: string
    password: string
}

/**
 * Login response data
 */
export interface LoginResponse {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number // seconds until access token expires
    refresh_expires_in: number // seconds until refresh token expires
    absolute_expires_in: number // seconds until absolute expiration
    user: User
}

/**
 * Refresh token request payload
 */
export interface RefreshTokenRequest {
    refresh_token: string
}

/**
 * Refresh token response data
 */
export interface RefreshTokenResponse {
    access_token: string
    token_type: string
    expires_in: number
    rotation: boolean
    refresh_token?: string // Only if rotated
    refresh_expires_in?: number
}

/**
 * Logout request payload
 */
export interface LogoutRequest {
    refresh_token: string
}

/**
 * Logout response data
 */
export interface LogoutResponse {
    message: string
}

/**
 * Update profile request payload
 */
export interface UpdateProfileRequest {
    username?: string
    email?: string
    fullname?: string
    phone?: string | null
    avatar?: string | null
}

/**
 * Update account request payload (for settings)
 */
export interface UpdateAccountRequest {
    fullname?: string
    phone?: string | null
    avatar?: string | null
}

/**
 * Change password request payload
 */
export interface ChangePasswordRequest {
    current_password: string
    new_password: string
}

/**
 * API Error response structure
 */
export interface ApiError {
    success: false
    data: null
    metadata: {
        total: 0
        limit: 0
        offset: 0
    }
    error: string
}

/**
 * ============================================
 * CUSTOMER MANAGEMENT TYPES
 * ============================================
 */

export type CustomerStatus = 'active' | 'inactive' | 'suspended' | 'pending'
export type ServiceType = 'pppoe' | 'hotspot' | 'static_ip'
export type ServiceStatus = 'active' | 'suspended' | 'terminated'

/**
 * Customer model
 */
export interface Customer {
    id: string
    tenant_id: string
    mikrotik_id: string
    username: string
    name: string
    phone: string
    email?: string | null
    address?: string | null
    mikrotik_object_id?: string | null
    service_type: ServiceType
    assigned_ip?: string | null
    mac_address?: string | null
    interface?: string | null
    last_online?: string | null
    last_ip?: string | null
    status: CustomerStatus
    auto_suspension: boolean
    billing_day: number
    join_date: string
    customer_notes?: string | null
    created_at: string
    updated_at: string
}

/**
 * Customer Service subscription
 */
export interface CustomerService {
    id: string
    tenant_id: string
    customer_id: string
    profile_id: string
    price: number
    tax_rate: number
    start_date: string
    end_date?: string | null
    status: ServiceStatus
    created_at: string
    updated_at: string
    profile?: MikrotikProfile
}

/**
 * Mikrotik Profile (simplified for customers)
 */
export interface MikrotikProfile {
    id: string
    name: string
    rate_limit?: string
}

/**
 * Create Customer Request
 */
export interface CreateCustomerRequest {
    username: string
    name: string
    phone: string
    email?: string | null
    address?: string | null
    password: string
    profile_id: string
    service_type: ServiceType
    billing_day?: number
    auto_suspension?: boolean
    start_date?: string
    customer_notes?: string | null
}

/**
 * Update Customer Request
 */
export interface UpdateCustomerRequest {
    name?: string
    phone?: string
    email?: string | null
    address?: string | null
    password?: string
    profile_id?: string
    billing_day?: number
    auto_suspension?: boolean
    customer_notes?: string | null
    status?: CustomerStatus
}

/**
 * Customer Response
 */
export interface CustomerResponse {
    id: string
    tenant_id: string
    mikrotik_id: string
    username: string
    name: string
    phone: string
    email?: string | null
    address?: string | null
    mikrotik_object_id?: string | null
    service_type: ServiceType
    assigned_ip?: string | null
    mac_address?: string | null
    interface?: string | null
    last_online?: string | null
    last_ip?: string | null
    status: CustomerStatus
    auto_suspension: boolean
    billing_day: number
    join_date: string
    customer_notes?: string | null
    created_at: string
    updated_at: string
    services?: CustomerService[]
    current_service?: CustomerService
}

/**
 * Customer List Response with statistics
 */
export interface CustomerListResponse {
    customers: CustomerResponse[]
    total: number
    active: number
    inactive: number
    suspended: number
    pending: number
}

/**
 * ============================================
 * PPP MANAGEMENT TYPES
 * ============================================
 */

/**
 * PPP Secret model
 */
export interface PPPSecret {
    id: string
    name: string
    password: string
    profile: string
    service: string
    remote_address?: string
    local_address?: string
    comment?: string
    disabled: boolean
}

/**
 * PPP Profile model
 */
export interface PPPProfile {
    id: string
    name: string
    local_address?: string
    remote_address?: string
    rate_limit?: string
    comment?: string
    only_one?: string
}

/**
 * Create PPP Secret Request
 */
export interface PPPSecretInput {
    name: string
    password: string
    profile: string
    service: string
    local_address?: string
    remote_address?: string
    comment?: string
}

/**
 * Update PPP Secret Request
 */
export interface PPPSecretUpdateInput {
    password?: string
    profile?: string
    service?: string
    local_address?: string
    remote_address?: string
    comment?: string
    disabled?: boolean
}

/**
 * Create PPP Profile Request
 */
export interface PPPProfileInput {
    name: string
    local_address?: string
    remote_address?: string
    rate_limit?: string
    only_one?: string
    comment?: string
}
/**
 * ============================================
 * MIKROTIK DEVICE MANAGEMENT TYPES
 * ============================================
 */

export type MikrotikStatus = 'online' | 'offline' | 'error'

/**
 * MikroTik device model
 */
export interface Mikrotik {
    id: string
    tenant_id: string
    name: string
    host: string
    port: number
    api_username: string
    keepalive: boolean
    timeout: number
    location?: string | null
    description?: string | null
    is_active: boolean
    status: MikrotikStatus
    last_sync?: string | null
    created_at: string
    updated_at: string
    total_profiles?: number
    total_customers?: number
}

/**
 * Create MikroTik Request
 */
export interface CreateMikrotikRequest {
    name: string
    host: string
    port?: number
    api_username: string
    api_password: string
    keepalive?: boolean
    timeout?: number
    location?: string
    description?: string
}

/**
 * Update MikroTik Request
 */
export interface UpdateMikrotikRequest {
    name?: string
    host?: string
    port?: number
    api_username?: string
    api_password?: string
    keepalive?: boolean
    timeout?: number
    location?: string
    description?: string
    is_active?: boolean
}

/**
 * MikroTik Response (Same as Mikrotik model but ensuring response format)
 */
export interface MikrotikResponse extends Mikrotik { }

/**
 * MikroTik List Response
 */
export interface MikrotikListResponse {
    mikrotiks: MikrotikResponse[]
    total: number
    online: number
    offline: number
    error: number
}
