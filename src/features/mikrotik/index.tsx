import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { mikrotikApi } from '@/lib/mikrotik-api'
import { RoutersDialogs } from './components/routers-dialogs'
import { RoutersProvider } from './components/routers-provider'
import { RoutersTable } from './components/routers-table'
import { RoutersPrimaryButtons } from './components/routers-primary-button'
// import { useRouterManagement } from '@/hooks/use-router'


export function Mikrotiks() {
  // const {routers} = useRouterManagement()

  // Fetch MikroTik devices from API
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['mikrotiks'],
    queryFn: () => mikrotikApi.getDevices(),
    staleTime: 30 * 1000, // Data fresh for 30 seconds
    refetchOnWindowFocus: true,
  })

  // Show error toast if fetch fails
  if (isError) {
    toast.error(`Failed to load routers: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  // Handle both array response or object response (MikrotikListResponse)
  const routers = data && 'mikrotiks' in data ? data.mikrotiks : (Array.isArray(data) ? data : [])
  console.log(routers)
  return (
    <RoutersProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Router Management</h2>
            <p className='text-muted-foreground'>
              {data && 'total' in data ? `${data.total} routers found.` : 'Manage your network routers and monitor their status.'}
            </p>
          </div>
          <RoutersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <RoutersTable data={routers} />
          )}
        </div>
      </Main>

      <RoutersDialogs />
    </RoutersProvider>
  )
}