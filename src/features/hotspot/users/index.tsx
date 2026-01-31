"use client"

import { HotspotUsersTable } from "./components/hotspot-user-table"
import HotspotTopNav from "../components/hotspot-top-nav"
import { HotspotUserProvider } from "./components/hotspot-user-provider"
import { HotspotUsersPrimaryButtons } from "./components/hotspot-users-primary-buttons"
import { HotspotUsersDialogs } from "./components/hotspot-user-dialog"



export default function HotspotUser() {
  // const { activeRouter } = useRouterManagement()
  // const { users } = useHotspotUser()


  return (
    <HotspotUserProvider>
      <HotspotTopNav>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
          </div>
          <HotspotUsersPrimaryButtons />
        </div>
        <div className="h-full overflow-y-auto p-2 sm:p-4">
          <HotspotUsersTable
            data={[]}
          />
        </div>
      {/* <h2>Hotspot user Profiles</h2> */}
      </HotspotTopNav>

      <HotspotUsersDialogs/>
    </HotspotUserProvider>
  )
}