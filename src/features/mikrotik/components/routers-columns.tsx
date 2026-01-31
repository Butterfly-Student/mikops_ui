import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { routerStatusStyles, statusIcons } from '../data/data'
import { type Router } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { formatDistanceToNow } from 'date-fns'

export const routersColumns: ColumnDef<Router>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('sticky md:table-cell start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Router Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3 font-medium'>{row.getValue('name')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'host', // Changed from hostname
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='IP Address' />
    ),
    cell: ({ row }) => (
      <div className='font-mono text-sm'>{row.getValue('host')}</div>
    ),
    meta: { className: 'w-32' },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { status } = row.original
      const badgeColor = routerStatusStyles.get(status) || 'text-gray-500 border-gray-200'
      const StatusIcon = statusIcons[status as keyof typeof statusIcons] || statusIcons.offline

      return (
        <div className='flex items-center space-x-2'>
          <StatusIcon size={16} className='text-muted-foreground' />
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {status}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'port',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Port' />
    ),
    cell: ({ row }) => (
      <div className='font-mono text-sm'>{row.getValue('port')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Location' />
    ),
    cell: ({ row }) => {
      const location = row.getValue('location') as string
      return location ? (
        <LongText className='max-w-32'>{location}</LongText>
      ) : (
        <span className='text-muted-foreground'>-</span>
      )
    },
    enableSorting: false,
  },
  // Version and Uptime removed as they are not in the API response yet
  {
    accessorKey: 'last_sync', // Changed from last_seen
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Last Sync' />
    ),
    cell: ({ row }) => {
      const lastSync = row.getValue('last_sync') as string
      return lastSync ? (
        <div className='text-sm text-muted-foreground'>
          {formatDistanceToNow(new Date(lastSync), { addSuffix: true })}
        </div>
      ) : (
        <span className='text-muted-foreground'>Never</span>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Active' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean
      return (
        <Badge variant={isActive ? 'default' : 'secondary'} className='text-xs'>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const isActive = row.getValue(id) as boolean
      return value.includes(isActive.toString())
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]