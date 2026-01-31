'use client'

import { useState } from 'react'
import { AlertTriangle, Router } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Router as RouterType } from '../data/schema'
import { mikrotikApi } from '@/lib/mikrotik-api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type RouterDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: RouterType
}

export function RoutersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: RouterDeleteDialogProps) {
  const [value, setValue] = useState('')
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: mikrotikApi.deleteDevice,
    onSuccess: () => {
      toast.success(`Router ${currentRow.name} deleted successfully`)
      queryClient.invalidateQueries({ queryKey: ['mikrotiks'] })
      onOpenChange(false)
      setValue('')
    },
    onError: (error) => {
      toast.error(`Failed to delete router: ${error instanceof Error ? error.message : 'Unknown error'}`)
    },
  })

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return
    deleteMutation.mutate(currentRow.id)
  }

  const isOnline = currentRow.status === 'online'

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || isOnline || deleteMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Delete Router
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            This action will permanently remove the router at{' '}
            <span className='font-mono font-bold'>
              {currentRow.host}:{currentRow.port}
            </span>{' '}
            from the system. This cannot be undone.
          </p>

          {/* Router Info Card */}
          <div className='rounded-lg border p-3 space-y-2 bg-muted/30'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Router size={16} className='text-muted-foreground' />
                <span className='font-medium'>{currentRow.name}</span>
              </div>
              <Badge variant={currentRow.status === 'online' ? 'default' : 'secondary'}>
                {currentRow.status}
              </Badge>
            </div>
            <div className='text-sm text-muted-foreground space-y-1'>
              <div>📍 {currentRow.location || 'No location specified'}</div>
              <div className='font-mono'>{currentRow.host}:{currentRow.port}</div>
            </div>
          </div>

          {/* Warning for online router */}
          {isOnline && (
            <Alert variant='destructive'>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>Cannot Delete Online Router</AlertTitle>
              <AlertDescription>
                This router is currently online and cannot be deleted. Please disconnect or wait for the router to go offline before attempting deletion.
              </AlertDescription>
            </Alert>
          )}

          {/* Confirmation Input */}
          {!isOnline && (
            <Label className='my-2'>
              Router Name:
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder='Enter router name to confirm deletion.'
                className='mt-1'
                autoComplete="off"
              />
            </Label>
          )}

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              {isOnline
                ? 'Router must be offline before it can be safely removed from the system.'
                : 'Please be careful, this operation cannot be rolled back. All router configuration and monitoring data will be lost.'
              }
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={deleteMutation.isPending ? 'Deleting...' : (isOnline ? 'Cannot Delete' : 'Delete Router')}
      destructive
    />
  )
}