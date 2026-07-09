import { motion } from 'framer-motion'
import {
  Wallet,
  Users,
  ArrowLeftRight,
  DollarSign,
  TrendingUp,
  Building2,
  Activity,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import { formatCurrency, formatDate, cn } from '~/lib/utils'
import { useFetch } from '~/hooks/use-fetch'
import type { DashboardStats } from '~/types'

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6']

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'info' | 'default'> = {
  completed: 'success',
  pending: 'warning',
  processing: 'info',
  failed: 'destructive',
  cancelled: 'destructive',
  refunded: 'default',
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="size-12 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  )
}

function StatsCard({ title, value, description, icon: Icon, trend }: {
  title: string
  value: string | number
  description?: string
  icon: React.ElementType
  trend?: { value: number; isPositive: boolean }
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
              {trend && (
                <div className="flex items-center gap-1 mt-1">
                  <span className={cn(
                    'text-xs font-medium',
                    trend.isPositive ? 'text-emerald-500' : 'text-destructive'
                  )}>
                    {trend.isPositive ? '+' : ''}{trend.value}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
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

export default function Dashboard() {
  const { data: stats, loading, error, refetch } = useFetch<DashboardStats>('/api/v1/admin/dashboard')

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-destructive font-medium">{error}</p>
        <Button variant="outline" onClick={refetch}>Retry</Button>
      </div>
    )
  }

  const loadingStats = loading || !stats

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your mobile money gateway
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {loadingStats ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => <StatsCardSkeleton key={i} />)}
          </>
        ) : (
          <>
            <StatsCard title="Applications" value={stats.totalApplications} icon={Wallet} trend={{ value: 12, isPositive: true }} />
            <StatsCard title="Users" value={stats.totalUsers} icon={Users} trend={{ value: 8, isPositive: true }} />
            <StatsCard title="Transactions" value={stats.totalTransactions.toLocaleString()} icon={ArrowLeftRight} trend={{ value: 23, isPositive: true }} />
            <StatsCard title="Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} trend={{ value: 15, isPositive: true }} />
            <StatsCard title="Success Rate" value={`${stats.successRate}%`} icon={TrendingUp} description="Last 30 days" />
            <StatsCard title="Providers" value={stats.activeProviders} icon={Building2} />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-5 text-primary" />
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.revenueByDay}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value: any) => [formatCurrency(value as number), 'Revenue']}
                      contentStyle={{
                        backgroundColor: 'var(--popover)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Line type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={2} dot={{ fill: 'var(--primary)', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5 text-primary" />
                Transaction Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={stats.transactionsByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="count" nameKey="status">
                      {stats.transactionsByStatus.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>MSISDN</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingStats ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : stats.recentTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No recent transactions
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.recentTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs">{tx.reference}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(tx.amount, tx.currency)}</TableCell>
                      <TableCell className="capitalize">{tx.tx_type}</TableCell>
                      <TableCell className="font-mono text-xs">{tx.msisdn}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[tx.status] || 'default'}>{tx.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{formatDate(tx.created_at)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
