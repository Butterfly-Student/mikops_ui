import { useState } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { authApi } from '@/lib/auth-api'
import { ApiClientError } from '@/lib/api-client'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { auth } = useAuthStore()

  const handleSignOut = async () => {
    setIsLoading(true)

    try {
      // Call logout API if we have a refresh token
      if (auth.refreshToken) {
        await authApi.logout(auth.refreshToken)
      }
    } catch (error) {
      // Log error but still proceed with local logout
      console.error('Logout API error:', error)
      if (error instanceof ApiClientError) {
        toast.error(`Logout failed: ${error.message}`)
      }
    } finally {
      // Always clear local state regardless of API call result
      auth.reset()
      setIsLoading(false)
      onOpenChange(false)

      // Preserve current location for redirect after sign-in
      const currentPath = location.href
      navigate({
        to: '/sign-in',
        search: { redirect: currentPath },
        replace: true,
      })
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Sign out'
      desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
      confirmText={isLoading ? 'Signing out...' : 'Sign out'}
      destructive
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
    />
  )
}
