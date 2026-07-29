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
import { Card, CardContent } from '~/components/ui/card'
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
  color: string // CSS var or oklch for dot + icon
}

function StatCard({ config, index }: { config: StatCardConfig; index: number }) {
  const { title, value, subtitle, icon: Icon, color } = config

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
    >
      <Card size="sm" className="group relative">
        <CardContent className="py-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="aether-eyebrow">{title}</p>
              <p className="mt-1.5 font-heading text-xl font-semibold tracking-tight text-foreground tabular-nums">
                {value}
              </p>
              {subtitle && (
                <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>
              )}
            </div>
            <div
              className="shrink-0 rounded-xl p-2.5 transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="size-5" style={{ color }} />
            </div>
          </div>
        </CardContent>
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
        className="flex items-center gap-3 rounded-lg border border-black/[0.10] dark:border-white/[0.08] bg-white/55 dark:bg-[oklch(0.12_0.025_265/0.60)] backdrop-blur-md p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
      >
        <div
          className="rounded-lg p-2.5"
          style={{ backgroundColor: `${action.color}20` }}
        >
          <action.icon className="size-4" style={{ color: action.color }} />
        </div>
        <span className="text-[13px] font-medium">{action.label}</span>
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
      color: 'var(--chart-1)',
    },
    {
      key: 'users',
      title: 'Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'var(--chart-3)',
    },
    {
      key: 'transactions',
      title: 'Transactions',
      value: stats.totalTransactions.toLocaleString(),
      icon: ArrowLeftRight,
      color: 'var(--chart-2)',
    },
    {
      key: 'revenue',
      title: 'Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'var(--chart-2)',
    },
    {
      key: 'successRate',
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      subtitle: 'Completed / total',
      icon: TrendingUp,
      color: 'var(--chart-4)',
    },
    {
      key: 'providers',
      title: 'Active Providers',
      value: stats.activeProviders,
      icon: Building2,
      color: 'var(--chart-5)',
    },
  ]

  const { applicationId } = useApplicationStore()

  const quickActions: QuickAction[] = [
    {
      label: 'Manage Providers',
      icon: Building2,
      route: urlFor('admin.providers', { id: applicationId! }),
      color: 'var(--chart-1)',
    },
    {
      label: 'View Transactions',
      icon: ArrowLeftRight,
      route: urlFor('admin.transactions', { id: applicationId! }),
      color: 'var(--chart-2)',
    },
    {
      label: 'Manage Users',
      icon: Users,
      route: urlFor('admin.users', { id: applicationId! }),
      color: 'var(--chart-3)',
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
          <h1 className="font-heading text-xl font-semibold tracking-tight">
            Dashboard
          </h1>
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
        <h2 className="aether-eyebrow mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {quickActions.map((action, i) => (
            <QuickAction key={action.label} action={action} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
