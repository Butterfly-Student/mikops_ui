
import { RouterLogs } from '@/features/router_logs';
import { createFileRoute } from '@tanstack/react-router';


export const Route = createFileRoute('/_authenticated/router/logs')({
  component: RouterLogs,
})
