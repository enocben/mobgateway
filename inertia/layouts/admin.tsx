import { type ReactElement } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Toaster } from 'sonner'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
} from '~/components/ui/sidebar'
import {
  LayoutDashboard,
  Wallet,
  Users,
  Globe,
  Smartphone,
  ArrowLeftRight,
  Webhook,
  Percent,
  Route,
  FileText,
  Settings,
  Building2,
  Coins,
  Calculator,
  Scale,
} from 'lucide-react'
import { Data } from '@generated/data'

const sidebarSections = [
  {
    section: 'Overview',
    items: [{ label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' }],
  },
  {
    section: 'Management',
    items: [
      { label: 'Applications', icon: Wallet, href: '/admin/applications' },
      { label: 'Users', icon: Users, href: '/admin/users' },
      { label: 'Providers', icon: Building2, href: '/admin/providers' },
      { label: 'Transactions', icon: ArrowLeftRight, href: '/admin/transactions' },
    ],
  },
  {
    section: 'Configuration',
    items: [
      { label: 'Mobile Operators', icon: Smartphone, href: '/admin/mobile-operators' },
      { label: 'Countries', icon: Globe, href: '/admin/countries' },
      { label: 'Currencies', icon: Coins, href: '/admin/currencies' },
      { label: 'Routing', icon: Route, href: '/admin/routing' },
      { label: 'Commissions', icon: Percent, href: '/admin/commissions' },
    ],
  },
  {
    section: 'System',
    items: [
      { label: 'Reconciliation', icon: Scale, href: '/admin/reconciliation' },
      { label: 'Webhooks', icon: Webhook, href: '/admin/webhooks' },
      { label: 'API Logs', icon: FileText, href: '/admin/logs' },
      { label: 'Accounts', icon: Calculator, href: '/admin/accounts' },
      { label: 'Settings', icon: Settings, href: '/admin/settings' },
    ],
  },
]

interface AdminLayoutProps {
  children: ReactElement<Data.SharedProps>
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { url } = usePage()
  const user = children.props.user

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return url === href
    return url.startsWith(href)
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex h-16 items-center border-b px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Wallet className="size-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
              MM Gateway
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <ScrollArea className="flex-1">
            {sidebarSections.map((section) => (
              <SidebarGroup key={section.section}>
                <SidebarGroupLabel>{section.section}</SidebarGroupLabel>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.href)}
                        tooltip={item.label}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-5" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            ))}
          </ScrollArea>
        </SidebarContent>

        <SidebarSeparator />
        <SidebarFooter>
          <div className="flex items-center gap-3 px-2">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">AD</AvatarFallback>
            </Avatar>
            {user && (
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="top-0 z-30 flex h-16 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <div className="flex-1" />
          <Link href="/">
            <Button variant="destructive" size="sm">
              Logout
            </Button>
          </Link>
        </header>

        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={url}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>

      <Toaster position="top-right" richColors />
    </SidebarProvider>
  )
}
