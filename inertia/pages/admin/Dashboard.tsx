import { motion } from 'framer-motion'
import {
  Wallet,
  Users,
  ArrowLeftRight,
  DollarSign,
  TrendingUp,
  Building2,
} from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { formatCurrency } from '~/lib/utils'

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

function StatsCard({ title, value, description, icon: Icon }: {
  title: string
  value: string | number
  description?: string
  icon: React.ElementType
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <Icon className="size-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Dashboard({ stats }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your mobile money gateway
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Applications" value={stats.totalApplications} icon={Wallet} />
        <StatsCard title="Users" value={stats.totalUsers} icon={Users} />
        <StatsCard title="Transactions" value={stats.totalTransactions.toLocaleString()} icon={ArrowLeftRight} />
        <StatsCard title="Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} />
        <StatsCard title="Success Rate" value={`${stats.successRate}%`} icon={TrendingUp} description="Completed / total" />
        <StatsCard title="Active Providers" value={stats.activeProviders} icon={Building2} />
      </div>
    </div>
  )
}
