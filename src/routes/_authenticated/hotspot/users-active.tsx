import { createFileRoute } from '@tanstack/react-router'
import HotspotUsersActive from '@/features/hotspot/active'

export const Route = createFileRoute('/_authenticated/hotspot/users-active')({
  component: HotspotUsersActive,
})
