import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { pppApi } from '@/lib/ppp-api'
import { PppDialogs } from './components/ppp-dialogs'
import { PppPrimaryButtons } from './components/ppp-primary-buttons'
import { PppProvider } from './components/ppp-provider'
import { PppTable } from './components/ppp-table'

export function PppSecrets() {
  // Fetch PPP secrets from API
  const { data: secrets, isLoading, isError, error } = useQuery({
    queryKey: ['pppSecrets'],
    queryFn: () => pppApi.getPPPSecrets(),
    staleTime: 5 * 60 * 1000, // Data fresh for 5 minutes
    refetchOnWindowFocus: true,
  })

  // Fetch PPP profiles for dropdown/select
  const { data: profiles } = useQuery({
    queryKey: ['pppProfiles'],
    queryFn: () => pppApi.getPPPProfiles(),
    staleTime: 10 * 60 * 1000, // Profiles change less frequently
  })

  // Show error toast if fetch fails
  if (isError) {
    toast.error(`Failed to load PPP secrets: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return (
    <PppProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>PPP Secrets</h2>
            <p className='text-muted-foreground'>
              {secrets && `${secrets.length} PPP secrets configured`}
            </p>
          </div>
          <PppPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <PppTable data={secrets || []} />
          )}
        </div>
      </Main>

      <PppDialogs />
    </PppProvider>
  )
}