import { Link, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft, Code, Activity, Calendar, Shield, Route, Clock, Hash, RefreshCw, Radio } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { formatDate } from '~/lib/utils'
import { useApplicationStore } from '~/context/application_context'
import { urlFor } from '~/client'
import { Data } from '@generated/data'
import { type InertiaProps } from '~/types'

type Props = {
  provider: Data.Provider
  stats: {
    totalTransactions: number
    totalVolume: number
    successRate: number
  }
}

export default function ProviderDetail() {
  const applicationId = useApplicationStore((a) => a.applicationId)
  const { provider, stats } = usePage<InertiaProps<Props>>().props

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={urlFor('admin.providers', { id: applicationId! })}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{provider.icon || '🔌'}</span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{provider.label || provider.name}</h1>
            <p className="text-sm text-muted-foreground">{provider.description}</p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalTransactions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalVolume.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.successRate}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 flex flex-col gap-6">
          {/* Provider info */}
          <Card>
            <CardHeader><CardTitle>Provider Information</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Activity className="size-4" /> Status
                </span>
                <Badge variant={provider.status === 'active' ? 'success' : 'secondary'}>
                  {provider.status}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Code className="size-4" /> Code
                </span>
                <span className="font-mono text-sm">{provider.code}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Shield className="size-4" /> Type
                </span>
                <span className="capitalize text-sm">{provider.type}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="size-4" /> Created
                </span>
                <span className="text-sm">{formatDate(provider.createdAt!)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <RefreshCw className="size-4" /> Updated
                </span>
                <span className="text-sm">{formatDate(provider.updatedAt!)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Routes */}
          <Card>
            <CardHeader><CardTitle>Routes</CardTitle></CardHeader>
            <CardContent>
              {provider.routes && provider.routes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Operator</TableHead>
                      <TableHead>Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {provider.routes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell>
                          <span className="text-sm">
                            {route.mobileOperator?.name ?? route.mobileOperatorId}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Hash className="size-3 text-muted-foreground" />
                            <span className="font-mono text-sm">{route.priority ?? '—'}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No routes configured for this provider
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
            <CardContent>
              {provider.transactions && provider.transactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {provider.transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-xs">{tx.providerRef || '—'}</TableCell>
                        <TableCell className="font-mono text-sm">{tx.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tx.status === 'completed' ? 'success'
                              : tx.status === 'failed' ? 'destructive'
                              : 'secondary'
                            }
                          >
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(tx.createdAt!)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No transactions yet
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Details</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Provider ID</p>
                <p className="font-mono text-xs break-all">{provider.id}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Icon</p>
                <p className="text-2xl">{provider.icon || '—'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Label</p>
                <p className="text-sm">{provider.label || provider.name}</p>
              </div>
            </CardContent>
          </Card>

          {/* Config */}
          {provider.config && Object.keys(provider.config).length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Configuration</CardTitle></CardHeader>
              <CardContent>
                <pre className="bg-muted rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-80 overflow-y-auto">
                  {JSON.stringify(provider.config, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
