import { useState } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddUserHotspotDialog } from './add-user-action-dialog';


export function HotspotUsersPrimaryButtons() {
  const [isOpen, setIsOpen] = useState(false)
  const [openGenrate, setOpenGenrate] = useState(false)
  const routerId = 0

  // const { data: profiles } = useQuery({
  //   queryKey: hotspotProfilesKeys.byRouter(routerId),
  //   queryFn: () => getHotspotProfiles({ data: { routerId } }),
  //   staleTime: 5 * 60 * 1000, // 5 minutes
  //   refetchInterval: false,
  //   enabled: !!routerId,
  // })


  return (
    <>
      <div className='flex gap-2'>
        <Button
          variant='outline'
          className='space-x-1'
          onClick={() => setOpenGenrate(true)}
        >
          <span>Generate</span> <Users size={18} />
        </Button>
        <Button className='space-x-1' onClick={() => setIsOpen(true)}>
          <span>Add User</span> <UserPlus size={18} />
        </Button>
      </div>
      <AddUserHotspotDialog onOpenChange={setIsOpen} open={isOpen} />
      {/* <GenerateUsersActionDialog
        onOpenChange={setOpenGenrate}
        open={openGenrate}
      /> */}
    </>
  )
}