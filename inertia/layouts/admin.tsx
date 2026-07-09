import { type ReactElement, useCallback, useEffect, useMemo } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast, Toaster } from 'sonner'
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
  SidebarSeparator,
  SidebarTrigger,
} from '~/components/ui/sidebar'
import {
  ArrowLeftRight,
  Building2,
  Calculator,
  Coins,
  FileText,
  Globe,
  LayoutDashboard,
  Percent,
  Route,
  Scale,
  Settings,
  Smartphone,
  Users,
  Wallet,
  Webhook,
} from 'lucide-react'
import { Data } from '@generated/data'
import { Label } from '~/components/ui/label'
import { client, urlFor } from '~/client'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { useApplicationStore } from '~/context/application_context'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Spinner } from '~/components/ui/spinner'

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
  const { setApplications, setApplication, applications, applicationId } = useApplicationStore()

  useEffect(() => {
    ;(async () => {
      const [data, error] = await client.api.admin.applications({}).safe()
      if (error) {
        toast.error(error.message)
        return
      }
      if (data.applications.length !== 0) {
        setApplications(data.applications as unknown as Data.Application[])
      }
    })()
  }, [])

  const application = useMemo(
    () => applications.find((a) => a.id === applicationId),
    [applications, applicationId]
  )

  const apps = useCallback(
    () =>
      applications.map((app) => ({
        value: app.id,
        label: app.name,
      })),
    [applications]
  )

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return url === href
    return url.startsWith(href)
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex h-16 items-center border-b px-4">
          <Select value={application?.id} onValueChange={setApplication} disabled={applications.length === 0}>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {apps().map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </SidebarHeader>

        <SidebarContent>
          {application ? (
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
          ) : (
            <div className="flex h-full items-center justify-center">
              <Spinner className="size-2/6" />
            </div>
          )}
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
          <div>
            <SidebarTrigger />
          </div>
          <div className="flex-1" />
          {user && (
            <>
              <Label>{user.name}</Label>
              <Link href={urlFor('admin.settings')}>
                <Settings />
              </Link>
            </>
          )}
        </header>

        <main className="p-6 h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={url}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {application ? (
                children
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Spinner className="size-2/6" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>

      <Toaster position="top-right" richColors />
    </SidebarProvider>
  )
}
