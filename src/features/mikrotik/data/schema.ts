import { z } from 'zod'

// Router status enum schema
const routerStatusSchema = z.enum(['online', 'offline', 'error'])

// Main router schema based on real API model
export const routerSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  host: z.string().min(1), // Renamed from hostname
  port: z.number().int().default(8728),
  api_username: z.string().min(1), // Renamed from username, api_password hidden
  keepalive: z.boolean().default(true),
  timeout: z.number().int().default(300000),
  location: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(false),
  status: routerStatusSchema.default('offline'),
  last_sync: z.string().nullable().optional(), // Changed to string (date string)
  created_at: z.string(), // Changed to string
  updated_at: z.string(), // Changed to string
  total_profiles: z.number().int().optional(),
  total_customers: z.number().int().optional(),
})

export type Router = z.infer<typeof routerSchema>

// Form schema - hanya field yang dibutuhkan untuk form input
// Menggunakan z.number() langsung instead of z.coerce untuk menghindari 'unknown' type
export const formSchema = z.object({
  name: z.string().min(1, 'Router name is required.').max(100),
  hostname: z
    .string()
    .min(1, 'IP address is required.')
    .max(45),
  username: z.string().min(1, 'Username is required.').max(50),
  password: z.string().min(1, 'Password is required.').max(255),
  port: z.number().int().min(1).max(65535, 'Port must be between 1-65535'),
  timeout: z.number().int().positive('Timeout must be positive'),
  keepalive: z.boolean(),
  location: z.string().max(100).optional(),
  description: z.string().optional(),
  is_active: z.boolean(),
})

export type RouterForm = z.infer<typeof formSchema>

// Alternative: Jika Anda tetap ingin menggunakan coerce, gunakan preprocess
export const formSchemaWithCoerce = z.object({
  name: z.string().min(1, 'Router name is required.').max(100),
  hostname: z
    .string()
    .min(1, 'IP address is required.')
    .max(45),
  username: z.string().min(1, 'Username is required.').max(50),
  password: z.string().min(1, 'Password is required.').max(255),
  port: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1).max(65535, 'Port must be between 1-65535')
  ),
  timeout: z.preprocess(
    (val) => Number(val),
    z.number().int().positive('Timeout must be positive')
  ),
  keepalive: z.boolean(),
  location: z.string().max(100).optional(),
  description: z.string().optional(),
  is_active: z.boolean(),
})
