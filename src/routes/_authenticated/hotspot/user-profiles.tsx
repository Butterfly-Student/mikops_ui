import { createFileRoute } from '@tanstack/react-router'
import HotspotUserProfiles from '@/features/hotspot/user-profiles'

export const Route = createFileRoute('/_authenticated/hotspot/user-profiles')({
  component: HotspotUserProfiles,
})