import { createFileRoute } from '@tanstack/react-router'
import HotspotUsersInactive from '@/features/hotspot/inactive'

export const Route = createFileRoute(
  '/_authenticated/hotspot/users-inactive',
)({
  component: HotspotUsersInactive,
})
