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
  FileText,
  Globe,
  LayoutDashboard,
  Percent,
  Route,
  Settings,
  Smartphone,
  Users,
  Webhook,
  ChevronDown,
  LogOut,
} from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

type SideBarSectionsType = {
  section: string
  items: { label: string; icon: any; route: Parameters<typeof urlFor>[0] }[]
}[]

const sidebarSections: SideBarSectionsType = [
  {
    section: 'Overview',
    items: [{ label: 'Dashboard', icon: LayoutDashboard, route: 'admin.dashboard' as const }],
  },
  {
    section: 'Management',
    items: [
      { label: 'Users', icon: Users, route: 'admin.users' as const },
      { label: 'Providers', icon: Building2, route: 'admin.providers' as const },
      { label: 'Transactions', icon: ArrowLeftRight, route: 'admin.transactions' as const },
    ],
  },
  {
    section: 'Configuration',
    items: [
      { label: 'Mobile Operators', icon: Smartphone, route: 'admin.mobile-operators' as const },
      { label: 'Countries', icon: Globe, route: 'admin.countries' as const },
      { label: 'Routing', icon: Route, route: 'admin.routing' as const },
      { label: 'Commissions', icon: Percent, route: 'admin.commissions' as const },
    ],
  },
  {
    section: 'System',
    items: [
      { label: 'Webhooks', icon: Webhook, route: 'admin.webhooks' as const },
      { label: 'API Logs', icon: FileText, route: 'admin.logs' as const },
      { label: 'Settings', icon: Settings, route: 'admin.app.settings' as const },
    ],
  },
]

interface AdminLayoutProps {
  children: ReactElement<{ flash?: { error?: string; success?: string }; user?: { name: string; email: string } }>
}

function UserMenu({ user }: { user?: { name: string; email: string } }) {
  if (!user) return null

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 -mr-2 hover:bg-muted/60 transition-colors outline-none">
        <Avatar className="size-8 ring-2 ring-sidebar-ring/20">
          <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
            {initials || 'AD'}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="size-3.5 text-muted-foreground hidden sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={urlFor('admin.settings')} className="cursor-pointer">
            <Settings className="size-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={urlFor('session.destroy')} method="post" as="button" className="cursor-pointer w-full justify-start">
            <LogOut className="size-4" />
            <span>Sign out</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { url } = usePage()
  const user = children.props.user
  const { setApplications, setApplication, applications, applicationId } = useApplicationStore()

  // ── Flash messages ────────────────────────────────────────────────────
  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (children.props.flash?.error) {
      toast.error(children.props.flash.error)
    }
    if (children.props.flash?.success) {
      toast.success(children.props.flash.success)
    }
  })

  useEffect(() => {
    ;(async () => {
      const [data, error] = await client.api.admin.applications({}).safe()
      if (error) {
        toast.error(error.message)
        return
      }
      if (data.applications.length !== 0) {
        setApplications(data.applications as unknown as Array<{ id: string; name: string }>)
      }
    })()
  }, [])

  const application = useMemo(
    () => applications.find((a: { id: string; name: string }) => a.id === applicationId),
    [applications, applicationId]
  )

  const apps = useCallback(
    () =>
      applications.map((app: { id: string; name: string }) => ({
        value: app.id,
        label: app.name,
      })),
    [applications]
  )

  type RouteName = Parameters<typeof urlFor>[0]

  const isActive = (route: RouteName) => {
    return url.startsWith(urlFor(route, { id: applicationId! }))
  }

  const sidebarHref = (route: RouteName) => {
    if (route === 'admin.dashboard') {
      return urlFor(route)
    }
    return urlFor(route, { id: applicationId! })
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-sidebar-border/30">
        {/* ── Sidebar Header: App selector ── */}
        <SidebarHeader className="flex h-14 items-center border-b border-sidebar-border/30 px-3">
          <Select
            value={application?.id}
            onValueChange={setApplication}
            disabled={applications.length === 0}
          >
            <SelectTrigger className="w-full bg-sidebar-accent/50 border-sidebar-border/50 text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
              <SelectValue placeholder="Select app" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {apps().map((item: { value: string; label: string }) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </SidebarHeader>

        {/* ── Sidebar Nav ── */}
        <SidebarContent>
          {application ? (
            <ScrollArea className="flex-1 px-1.5">
              {sidebarSections.map((section) => (
                <SidebarGroup key={section.section} className="px-1">
                  <SidebarGroupLabel className="text-sidebar-foreground/50 text-[11px] tracking-wider uppercase font-semibold">
                    {section.section}
                  </SidebarGroupLabel>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.route}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.route)}
                          tooltip={item.label}
                          className="transition-all duration-200"
                        >
                          <Link href={sidebarHref(item.route)}>
                            <item.icon className="size-[18px]" />
                            <span className="text-[13px]">{item.label}</span>
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
              <Spinner className="size-8" />
            </div>
          )}
        </SidebarContent>

        {/* ── Sidebar Footer: User ── */}
        <SidebarSeparator className="bg-sidebar-border/30" />
        <SidebarFooter className="p-3">
          {user && (
            <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
              <Avatar className="size-8 shrink-0 ring-2 ring-sidebar-ring/20">
                <AvatarFallback className="text-[11px] bg-sidebar-primary/15 text-sidebar-primary font-semibold">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'AD'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="text-[13px] font-medium truncate text-sidebar-foreground">{user.name}</p>
                <p className="text-[11px] text-sidebar-foreground/50 truncate">{user.email}</p>
              </div>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>

      {/* ── Main Content Area ── */}
      <SidebarInset>
        {/* ── Top Header Bar ── */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 backdrop-blur-sm px-3 sm:px-6">
          <SidebarTrigger className="shrink-0" />

          {/* App breadcrumb on desktop */}
          <div className="hidden sm:flex items-center gap-2 min-w-0">
            <div className="h-4 w-px bg-border" />
            {application && (
              <span className="text-sm font-medium text-muted-foreground truncate">
                {application.name}
              </span>
            )}
          </div>

          <div className="flex-1" />

          {/* User dropdown (desktop) / simple avatar (mobile handled by sidebar) */}
          <div className="hidden sm:block">
            <UserMenu user={user} />
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={url}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {application ? (
                children
              ) : (
                <div className="flex h-[60vh] items-center justify-center">
                  <Spinner className="size-10" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>

      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          className: 'text-sm',
        }}
      />
    </SidebarProvider>
  )
}
