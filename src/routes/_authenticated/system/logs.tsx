import SystemLogs from '@/features/system/logs';
import { createFileRoute } from '@tanstack/react-router';


export const Route = createFileRoute('/_authenticated/system/logs')({
  component: SystemLogs,
})
