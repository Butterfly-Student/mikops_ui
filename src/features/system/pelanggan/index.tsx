import { ConfigDrawer } from "@/components/config-drawer"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { Search } from "@/components/search"
import { ThemeSwitch } from "@/components/theme-switch"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { customerApi } from "@/lib/customer-api"
import { PelangganDialogs } from "./components/pelanggan-dialogs"
import { PelangganPrimaryButtons } from "./components/pelanggan-primary-buttons"
import { PelangganProvider } from "./components/pelanggan-provider"
import { PelangganTable } from "./components/pelanggan-table"

export function Pelanggan() {
  // Fetch customers from API
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerApi.getCustomers(),
    staleTime: 5 * 60 * 1000, // Data fresh for 5 minutes
    refetchOnWindowFocus: true,
  })

  // Show error toast if fetch fails
  if (isError) {
    toast.error(`Failed to load customers: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  const customers = data?.customers || []
  const stats = data ? {
    total: data.total,
    active: data.active,
    inactive: data.inactive,
    suspended: data.suspended,
    pending: data.pending
  } : undefined

  return (
    <PelangganProvider>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Pelanggan</h2>
            <p className="text-muted-foreground">
              {stats && `${stats.total} pelanggan (${stats.active} aktif, ${stats.inactive} tidak aktif)`}
            </p>
          </div>
          <PelangganPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <PelangganTable data={customers} />
          )}
        </div>
      </Main>

      <PelangganDialogs />
    </PelangganProvider>
  )
}
