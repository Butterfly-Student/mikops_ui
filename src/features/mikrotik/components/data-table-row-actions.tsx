import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Trash2, Settings, Wifi, TestTube, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Router } from '../data/schema'
import { useRouters } from './routers-provider'
import { mikrotikApi } from '@/lib/mikrotik-api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type DataTableRowActionsProps = {
  row: Row<Router>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useRouters()
  const router = row.original
  const queryClient = useQueryClient()

  const activateMutation = useMutation({
    mutationFn: mikrotikApi.activateDevice,
    onSuccess: () => {
      toast.success(`Router ${router.name} activated successfully`)
      queryClient.invalidateQueries({ queryKey: ['mikrotiks'] })
    },
    onError: (error) => {
      toast.error(`Failed to activate router: ${error instanceof Error ? error.message : 'Unknown error'}`)
    },
  })

  // Optionally Deactivate using updateDevice if needed. User only asked for Activate endpoint.
  // We will only show Activate if !is_active

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[180px]'>
          {!router.is_active && (
            <DropdownMenuItem
              onClick={() => {
                activateMutation.mutate(router.id)
              }}
            >
              Set Active
              <DropdownMenuShortcut>
                <CheckCircle size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(router)
              setOpen('connect')
            }}
          >
            Connect to Router
            <DropdownMenuShortcut>
              <Wifi size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(router)
              setOpen('test-connection')
            }}
          >
            Test Connection
            <DropdownMenuShortcut>
              <TestTube size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(router)
              setOpen('edit')
            }}
          >
            Edit Router
            <DropdownMenuShortcut>
              <Settings size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(router)
              setOpen('delete')
            }}
            className='text-red-500!'
          >
            Delete Router
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}