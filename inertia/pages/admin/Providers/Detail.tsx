import { Link, usePage } from '@inertiajs/react'
import { Form } from '@adonisjs/inertia/react'
import { motion } from 'framer-motion'
import { ArrowLeft, Code, Activity, Calendar, Shield, RefreshCw, Globe, Trash2, Route } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { formatDate } from '~/lib/utils'
import { useApplicationStore } from '~/context/application_context'
import { urlFor } from '~/client'
import { Data } from '@generated/data'
import { type InertiaProps } from '~/types'
import { useState } from 'react'

type Props = {
  provider: Data.Provider
  availableCountries: Data.Country[]
  availableOperators: Data.MobileOperator[]
  stats: {
    totalTransactions: number
    totalVolume: number
    successRate: number
  }
}

export default function ProviderDetail() {
  const applicationId = useApplicationStore((a) => a.applicationId)
  const { provider, availableCountries, availableOperators, stats } = usePage<InertiaProps<Props>>().props
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedOperator, setSelectedOperator] = useState('')
  const [routePriority, setRoutePriority] = useState('99')

  if (!provider) {
    return null
  }

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

          {/* Countries */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Countries</CardTitle>
                {availableCountries.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Select onValueChange={setSelectedCountry} value={selectedCountry}>
                      <SelectTrigger className="w-48 h-8 text-xs">
                        <SelectValue placeholder="Add country..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {availableCountries.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name} ({c.code})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Form
                      route="admin.providers.countries.store"
                      routeParams={{ id: applicationId!, providerId: provider.id, countryId: selectedCountry }}
                      onSubmit={() => setSelectedCountry('')}
                    >
                      <Button type="submit" size="sm" disabled={!selectedCountry}>
                        Add
                      </Button>
                    </Form>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {provider.countries && provider.countries.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {provider.countries.map((c) => (
                    <div key={c.id} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <Globe className="size-4 text-muted-foreground" />
                        <span className="text-sm">{c.name}</span>
                        <Badge variant="outline" className="font-mono text-xs">{c.code}</Badge>
                      </div>
                      <Form
                        route="admin.providers.countries.destroy"
                        routeParams={{ id: applicationId!, providerId: provider.id, countryId: c.id }}
                      >
                        <Button variant="ghost" size="icon" type="submit" className="size-7">
                          <Trash2 className="size-3 text-destructive" />
                        </Button>
                      </Form>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No countries linked to this provider
                </p>
              )}
            </CardContent>
          </Card>

          {/* Routes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Routes</CardTitle>
                {availableOperators.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Select onValueChange={setSelectedOperator} value={selectedOperator}>
                      <SelectTrigger className="w-44 h-8 text-xs">
                        <SelectValue placeholder="Add operator..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {availableOperators.map((op) => (
                            <SelectItem key={op.id} value={op.id}>
                              {op.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Pri."
                      className="w-14 h-8 text-xs"
                      value={routePriority}
                      onChange={(e) => setRoutePriority(e.target.value)}
                      min="1"
                      max="999"
                    />
                    <Form
                      route="admin.providers.routes.store"
                      routeParams={{ id: applicationId!, providerId: provider.id }}
                      onSubmit={() => { setSelectedOperator(''); setRoutePriority('99'); }}
                    >
                      <input type="hidden" name="mobileOperatorId" value={selectedOperator} />
                      <input type="hidden" name="priority" value={routePriority} />
                      <Button type="submit" size="sm" disabled={!selectedOperator}>
                        Add
                      </Button>
                    </Form>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {provider.routes && provider.routes.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {provider.routes.map((route) => (
                    <li key={route.id} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <Route className="size-4 text-muted-foreground" />
                        <span className="text-sm">
                          {route.mobileOperator?.name ?? route.mobileOperatorId}
                        </span>
                        <Badge variant="outline" className="font-mono text-xs">
                          prio {route.priority ?? '—'}
                        </Badge>
                      </div>
                      <Form
                        route="admin.providers.routes.destroy"
                        routeParams={{ id: applicationId!, providerId: provider.id, routeId: route.id }}
                      >
                        <Button variant="ghost" size="icon" type="submit" className="size-7">
                          <Trash2 className="size-3 text-destructive" />
                        </Button>
                      </Form>
                    </li>
                  ))}
                </ul>
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
