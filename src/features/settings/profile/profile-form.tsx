import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { userApi } from '@/lib/user-api'
import { ApiClientError } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const profileFormSchema = z.object({
  username: z
    .string()
    .min(1, 'Please enter your username.')
    .min(2, 'Username must be at least 2 characters.')
    .max(50, 'Username must not be longer than 50 characters.'),
  email: z
    .string()
    .min(1, 'Please enter your email.')
    .email('Please enter a valid email address.'),
  fullname: z
    .string()
    .min(1, 'Please enter your full name.')
    .min(2, 'Full name must be at least 2 characters.')
    .max(255, 'Full name must not be longer than 255 characters.'),
  phone: z
    .string()
    .max(20, 'Phone must not be longer than 20 characters.')
    .optional()
    .nullable(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const { auth } = useAuthStore()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      email: '',
      fullname: '',
      phone: '',
    },
  })

  // Fetch user profile on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsFetching(true)
        const profile = await userApi.getProfile()

        // Update form with fetched data
        form.reset({
          username: profile.username,
          email: profile.email,
          fullname: profile.fullname,
          phone: profile.phone || '',
        })

        // Update auth store if needed
        if (!auth.user || auth.user.id !== profile.id) {
          auth.setUser(profile)
        }
      } catch (error) {
        if (error instanceof ApiClientError) {
          toast.error(`Failed to load profile: ${error.message}`)
        } else {
          toast.error('Failed to load profile')
        }
      } finally {
        setIsFetching(false)
      }
    }

    fetchProfile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    try {
      const updatedUser = await userApi.updateProfile({
        username: data.username,
        email: data.email,
        fullname: data.fullname,
        phone: data.phone || null,
      })

      // Update auth store with new user data
      auth.setUser(updatedUser)

      toast.success('Profile updated successfully!')
    } catch (error) {
      if (error instanceof ApiClientError) {
        toast.error(`Failed to update profile: ${error.message}`)
      } else {
        toast.error('Failed to update profile')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='Enter your username' {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='Enter your email'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your email address for account notifications and recovery.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='fullname'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter your full name' {...field} />
              </FormControl>
              <FormDescription>
                Your full name as it will appear in the system.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter your phone number'
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Your contact phone number for account-related communications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isLoading}>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Update profile
        </Button>
      </form>
    </Form>
  )
}
