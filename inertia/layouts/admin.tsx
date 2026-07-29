import { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast, Toaster } from 'sonner'
import {
  ArrowLeftRight,
  BarChart3,
  Building2,
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Percent,
  Route,
  Settings,
  Smartphone,
  Users,
  Webhook,
} from 'lucide-react'
import { client, urlFor } from '~/client'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Spinner } from '~/components/ui/spinner'
import { useApplicationStore } from '~/context/application_context'
import { cn } from '~/lib/utils'

type NavItem = {
  label: string
  icon: React.ElementType
  route: Parameters<typeof urlFor>[0]
}

type NavSection = {
  label: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', icon: BarChart3, route: 'admin.dashboard' as const }],
  },
  {
    label: 'Management',
    items: [
      { label: 'Users', icon: Users, route: 'admin.users' as const },
      { label: 'Providers', icon: Building2, route: 'admin.providers' as const },
      { label: 'Transactions', icon: ArrowLeftRight, route: 'admin.transactions' as const },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { label: 'Mobile Operators', icon: Smartphone, route: 'admin.mobile-operators' as const },
      { label: 'Countries', icon: Globe, route: 'admin.countries' as const },
      { label: 'Routing', icon: Route, route: 'admin.routing' as const },
      { label: 'Commissions', icon: Percent, route: 'admin.commissions' as const },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Webhooks', icon: Webhook, route: 'admin.webhooks' as const },
      { label: 'API Logs', icon: FileText, route: 'admin.logs' as const },
      { label: 'Settings', icon: Settings, route: 'admin.app.settings' as const },
    ],
  },
]

interface AdminLayoutProps {
  children: ReactElement<{
    flash?: { error?: string; success?: string }
    user?: { name: string; email: string }
  }>
}

function UserMenu({ collapsed, user }: { collapsed: boolean; user?: { name: string; email: string } }) {
  if (!user) return null

  const initial = (user.name || '?').charAt(0).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={user.name}
        className={cn(
          'flex items-center gap-2.5 rounded-md hover:bg-accent transition-colors cursor-pointer outline-none',
          collapsed ? 'p-1' : 'flex-1 min-w-0 p-1 -m-1'
        )}
      >
        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-primary to-violet-500 text-white font-mono text-[11px] font-semibold shrink-0">
          {initial}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0 text-left leading-tight">
            <div className="text-[12px] font-medium truncate">{user.name}</div>
            <div className="font-mono text-[9.5px] text-muted-foreground/80 tracking-[0.06em] truncate">
              {user.email}
            </div>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-48">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={urlFor('session.destroy')}
            method="post"
            as="button"
            className="cursor-pointer w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { url } = usePage()
  const user = children.props.user
  const { setApplications, setApplication, applications, applicationId } =
    useApplicationStore()
  const [collapsed, setCollapsed] = useState(false)

  // ── Flash messages ──
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
        setApplications(
          data.applications as unknown as Array<{ id: string; name: string }>
        )
      }
    })()
  }, [])

  const application = useMemo(
    () =>
      applications.find(
        (a: { id: string; name: string }) => a.id === applicationId
      ),
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

  const hasApp = !!application

  return (
    <div className="flex h-screen overflow-hidden bg-background prism-grid-bg">
      {/* ── Floating glass sidebar ── */}
      <div className="p-4 pr-0 flex">
        <aside
          className={cn(
            'flex flex-col rounded-lg border border-black/[0.10] dark:border-white/[0.08] bg-white/70 dark:bg-[oklch(0.10_0.025_265/0.65)] backdrop-blur-xl backdrop-saturate-[1.3] shadow-[0_6px_18px_-8px_rgb(0_0_0/0.10),inset_0_0_0_1px_rgb(0_0_0/0.04)] dark:shadow-[0_6px_18px_-8px_rgb(0_0_0/0.7),inset_0_0_0_1px_rgb(255_255_255/0.04)] h-full overflow-hidden transition-all duration-200',
            collapsed ? 'w-16' : 'w-56'
          )}
        >
          {/* Logo area */}
          <div className="flex items-center px-4 h-14 border-b border-black/[0.10] dark:border-white/[0.08]">
            {collapsed ? (
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                MM
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 text-white font-mono text-[11px] font-bold">
                  MG
                </div>
                <span className="font-heading text-base font-semibold tracking-tight text-foreground">
                  MobGateway
                </span>
              </div>
            )}
          </div>

          {/* App selector */}
          {!collapsed && (
            <div className="px-3 py-3 border-b border-black/[0.05] dark:border-white/[0.05]">
              <Select
                value={application?.id}
                onValueChange={setApplication}
                disabled={applications.length === 0}
              >
                <SelectTrigger className="w-full h-8 text-[13px] bg-muted/50 border-border/60">
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
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 py-4 px-2 space-y-5 overflow-y-auto">
            {navSections.map((section) => (
              <div key={section.label}>
                {!collapsed && (
                  <p className="px-3 mb-2 font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
                    {section.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(item.route)
                    return (
                      <Link
                        key={item.route}
                        href={sidebarHref(item.route)}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] transition-colors relative',
                          active
                            ? 'bg-primary/12 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-primary" />
                        )}
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer — user */}
          <div
            className={cn(
              'border-t border-black/[0.10] dark:border-white/[0.08] flex items-center gap-2',
              collapsed ? 'p-2 flex-col' : 'p-3'
            )}
          >
            <UserMenu collapsed={collapsed} user={user} />
          </div>
        </aside>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3 h-12 px-3 rounded-lg border border-black/[0.10] dark:border-white/[0.08] bg-white/70 dark:bg-[oklch(0.10_0.025_265/0.65)] backdrop-blur-xl backdrop-saturate-[1.3] shadow-[0_6px_18px_-8px_rgb(0_0_0/0.10),inset_0_0_0_1px_rgb(0_0_0/0.04)] dark:shadow-[0_6px_18px_-8px_rgb(0_0_0/0.7),inset_0_0_0_1px_rgb(255_255_255/0.04)]">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              aria-label="Toggle sidebar"
              className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground shrink-0"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="font-mono text-[11px] uppercase tracking-[0.10em] text-muted-foreground/80 truncate">
              MobGateway{' '}
              <span className="opacity-60 mx-1">/</span>{' '}
              {application ? (
                <span>{application.name}</span>
              ) : (
                <Spinner className="inline-block size-3" />
              )}
            </div>
            <div className="flex-1" />
            <UserMenu collapsed={false} user={user} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto px-4 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={url}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {hasApp ? (
                children
              ) : (
                <div className="flex h-[60vh] items-center justify-center">
                  <Spinner className="size-10" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          className: 'text-sm',
        }}
      />
    </div>
  )
}
