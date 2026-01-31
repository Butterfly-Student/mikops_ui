import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  CircleDollarSign,
  Wifi,
  Network,
} from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
        title: 'System',
        items: [
          {
            title: 'Dashboard',
            url: '/',
            icon: LayoutDashboard,
          },
          // {
          //   title: 'Tasks',
          //   url: '/tasks',
          //   icon: ListTodo,
          // },
          // {
          //   title: 'Apps',
          //   url: '/apps',
          //   icon: Package,
          // },
          // {
          //   title: 'Chats',
          //   url: '/chats',
          //   badge: '3',
          //   icon: MessagesSquare,
          // },
          {
            title: 'Users',
            icon: Users,
            items: [
              {
                title: 'List',
                url: '/users',
              },
              {
                title: 'Roles',
                url: '/users/roles',
              },
              {
                title: 'Permissions',
                url: '/users/permissions',
              },
              {
                title: "Sessions",
                url: '/users/sessions',
              }
            ]
          },
          {
            title: 'Routers',
            url: '/mikrotik',
            icon: Monitor,
          },
          {
            title: 'System',
            icon: CircleDollarSign,
            items: [
              {
                title: 'Kas',
                url: '/system/kas',
              },
              {
                title: 'Pelanggan',
                url: '/system/pelanggan',
              },
              {
                title: 'Tagihan',
                url: '/system/tagihan',
              },
              // {
              //   title: 'Template Tagihan',
              //   url: '/system/template_tagihan',
              // },
              {
                title: "Laporan",
                url: '/system/laporan',
              },
              {
                title: 'Logs',
                url: '/system/logs',
              }
            ]
          },
          {
            title: 'Settings',
            icon: Settings,
            items: [
              {
                title: 'Profile',
                url: '/settings',
                icon: UserCog,
              },
              {
                title: 'Account',
                url: '/settings/account',
                icon: Wrench,
              },
              {
                title: 'Appearance',
                url: '/settings/appearance',
                icon: Palette,
              },
              // {
              //   title: 'Notifications',
              //   url: '/settings/notifications',
              //   icon: Bell,
              // },
              {
                title: 'Display',
                url: '/settings/display',
                icon: Monitor,
              },
            ],
          },
        ]
      },
      {
        title: 'Mikrotik',
        items: [
          {
            title: 'Hotspot',
            url: '/hotspot/users',
            icon: Wifi,
          },
          {
            title: 'PPP',
            icon: Network,
            items: [
              {
                title: 'Secrets',
                url: '/ppp/secrets',
              },
              {
                title: 'Active',
                url: '/ppp/actives',
              },
              {
                title: 'Inactive',
                url: '/ppp/inactives',
              },
            ],
          },
          {
            title: 'Router Logs',
            url: '/router/logs',
            icon: Monitor,
          }
          // {
          //   title: 'Secured by Clerk',
          //   icon: ClerkLogo,
          //   items: [
          //     {
          //       title: 'Sign In',
          //       url: '/clerk/sign-in',
          //     },
          //     {
          //       title: 'Sign Up',
          //       url: '/clerk/sign-up',
          //     },
          //     {
          //       title: 'User Management',
          //       url: '/clerk/user-management',
          //     },
          //   ],
          // },
        ],
      },
      // {
      //   title: 'Pages',
      //   items: [
      //     {
      //       title: 'Auth',
      //       icon: ShieldCheck,
      //       items: [
      //         {
      //           title: 'Sign In',
      //           url: '/sign-in',
      //         },
      //         {
      //           title: 'Sign In (2 Col)',
      //           url: '/sign-in-2',
      //         },
      //         {
      //           title: 'Sign Up',
      //           url: '/sign-up',
      //         },
      //         {
      //           title: 'Forgot Password',
      //           url: '/forgot-password',
      //         },
      //         {
      //           title: 'OTP',
      //           url: '/otp',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'Errors',
      //       icon: Bug,
      //       items: [
      //         {
      //           title: 'Unauthorized',
      //           url: '/errors/unauthorized',
      //           icon: Lock,
      //         },
      //         {
      //           title: 'Forbidden',
      //           url: '/errors/forbidden',
      //           icon: UserX,
      //         },
      //         {
      //           title: 'Not Found',
      //           url: '/errors/not-found',
      //           icon: FileX,
      //         },
      //         {
      //           title: 'Internal Server Error',
      //           url: '/errors/internal-server-error',
      //           icon: ServerOff,
      //         },
      //         {
      //           title: 'Maintenance Error',
      //           url: '/errors/maintenance-error',
      //           icon: Construction,
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        title: 'Other',
        items: [
          {
            title: 'Help Center',
            url: '/help-center',
            icon: HelpCircle,
          },
        ],
      },
    ],
}
