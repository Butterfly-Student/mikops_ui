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

const accountFormSchema = z.object({
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

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const { auth } = useAuthStore()

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
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
          fullname: profile.fullname,
          phone: profile.phone || '',
        })

        // Update auth store if needed
        if (!auth.user || auth.user.id !== profile.id) {
          auth.setUser(profile)
        }
      } catch (error) {
        if (error instanceof ApiClientError) {
          toast.error(`Failed to load account: ${error.message}`)
        } else {
          toast.error('Failed to load account')
        }
      } finally {
        setIsFetching(false)
      }
    }

    fetchProfile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(data: AccountFormValues) {
    setIsLoading(true)

    try {
      const updatedUser = await userApi.updateAccount({
        fullname: data.fullname,
        phone: data.phone || null,
      })

      // Update auth store with new user data
      auth.setUser(updatedUser)

      toast.success('Account updated successfully!')
    } catch (error) {
      if (error instanceof ApiClientError) {
        toast.error(`Failed to update account: ${error.message}`)
      } else {
        toast.error('Failed to update account')
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
          name='fullname'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter your full name' {...field} />
              </FormControl>
              <FormDescription>
                This is your full name as it will appear in the system and
                communications.
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
                Your contact phone number for important account notifications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isLoading}>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Update account
        </Button>
      </form>
    </Form>
  )
}
