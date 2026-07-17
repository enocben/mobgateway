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

type SideBarSectionsType = {
  section: string;
  items: {label: string; icon: any, route: Parameters<typeof urlFor>[0]}[]
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

  // ── Flash messages ────────────────────────────────────────────────────
  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (children.props.flash.error) {
      toast.error(children.props.flash.error)
    }
    if (children.props.flash.success) {
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

  type RouteName = Parameters<typeof urlFor>[0]

  const isActive = (route: RouteName) => {
    return url.startsWith(urlFor(route, { id: applicationId! }))
  }

  const sidebarHref = (route: RouteName) => {
    // Routes in the top-level /admin group don't need an application id
    if (route === 'admin.dashboard') {
      return urlFor(route)
    }
    return urlFor(route, { id: applicationId! })
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex h-16 items-center border-b px-4">
          <Select
            value={application?.id}
            onValueChange={setApplication}
            disabled={applications.length === 0}
          >
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
                      <SidebarMenuItem key={item.route}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.route)}
                          tooltip={item.label}
                        >
                          <Link href={sidebarHref(item.route)}>
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
