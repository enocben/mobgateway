import { motion } from 'framer-motion'
import {
  Wallet,
  Users,
  ArrowLeftRight,
  DollarSign,
  TrendingUp,
  Building2,
  ArrowUpRight,
} from 'lucide-react'
import { Card } from '~/components/ui/card'
import { formatCurrency } from '~/lib/utils'
import { Link } from '@inertiajs/react'
import { urlFor } from '~/client'
import { useApplicationStore } from '~/context/application_context'

interface StatsProps {
  totalApplications: number
  totalUsers: number
  totalTransactions: number
  totalRevenue: number
  successRate: number
  activeProviders: number
}

type Props = {
  stats: StatsProps
}

// ── Stat card config ────────────────────────────────────────────────────
interface StatCardConfig {
  key: string
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  accent: string // Tailwind border color class
  bg: string // Tailwind bg class for icon
  textColor: string // Tailwind text class for icon
}

function StatCard({ config, index }: { config: StatCardConfig; index: number }) {
  const { title, value, subtitle, icon: Icon, accent, bg, textColor } = config

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
    >
      <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Left accent bar */}
        <div className={`absolute inset-y-0 left-0 w-1 ${accent} rounded-l-xl`} />

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wide uppercase">
                {title}
              </p>
              <p className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
                {value}
              </p>
              {subtitle && (
                <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
            <div
              className={`shrink-0 rounded-2xl p-3 ${bg} transition-transform duration-300 group-hover:scale-110`}
            >
              <Icon className={`size-5 sm:size-6 ${textColor}`} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// ── Quick action link ───────────────────────────────────────────────────
interface QuickAction {
  label: string
  icon: React.ElementType
  route: string
  color: string
}

function QuickAction({ action, index }: { action: QuickAction; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: 0.2 + index * 0.05 }}
    >
      <Link
        href={action.route}
        className={`flex items-center gap-3 rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]`}
      >
        <div className={`rounded-xl p-2.5 ${action.color}`}>
          <action.icon className="size-4 sm:size-5 text-white" />
        </div>
        <span className="text-sm font-medium">{action.label}</span>
        <ArrowUpRight className="size-3.5 text-muted-foreground ml-auto shrink-0" />
      </Link>
    </motion.div>
  )
}

// ── Main Dashboard ──────────────────────────────────────────────────────
export default function Dashboard({ stats }: Props) {
  const statCards: StatCardConfig[] = [
    {
      key: 'applications',
      title: 'Applications',
      value: stats.totalApplications,
      icon: Wallet,
      accent: 'bg-accent-blue',
      bg: 'bg-accent-blue/10',
      textColor: 'text-accent-blue',
    },
    {
      key: 'users',
      title: 'Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      accent: 'bg-accent-purple',
      bg: 'bg-accent-purple/10',
      textColor: 'text-accent-purple',
    },
    {
      key: 'transactions',
      title: 'Transactions',
      value: stats.totalTransactions.toLocaleString(),
      icon: ArrowLeftRight,
      accent: 'bg-accent-teal',
      bg: 'bg-accent-teal/10',
      textColor: 'text-accent-teal',
    },
    {
      key: 'revenue',
      title: 'Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      accent: 'bg-accent-green',
      bg: 'bg-accent-green/10',
      textColor: 'text-accent-green',
    },
    {
      key: 'successRate',
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      subtitle: 'Completed / total',
      icon: TrendingUp,
      accent: 'bg-accent-amber',
      bg: 'bg-accent-amber/10',
      textColor: 'text-accent-amber',
    },
    {
      key: 'providers',
      title: 'Active Providers',
      value: stats.activeProviders,
      icon: Building2,
      accent: 'bg-accent-rose',
      bg: 'bg-accent-rose/10',
      textColor: 'text-accent-rose',
    },
  ]

  const { applicationId } = useApplicationStore()

  const quickActions: QuickAction[] = [
    {
      label: 'Manage Providers',
      icon: Building2,
      route: urlFor('admin.providers', { id: applicationId! }),
      color: 'bg-accent-blue',
    },
    {
      label: 'View Transactions',
      icon: ArrowLeftRight,
      route: urlFor('admin.transactions', { id: applicationId! }),
      color: 'bg-accent-teal',
    },
    {
      label: 'Manage Users',
      icon: Users,
      route: urlFor('admin.users', { id: applicationId! }),
      color: 'bg-accent-purple',
    },
  ]

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Overview of your mobile money gateway
          </p>
        </div>
        <p className="text-xs text-muted-foreground sm:text-right">
          {new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }).format(new Date())}
        </p>
      </motion.div>

      {/* ── Stat Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {statCards.map((config, i) => (
          <StatCard key={config.key} config={config} index={i} />
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {quickActions.map((action, i) => (
            <QuickAction key={action.label} action={action} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
