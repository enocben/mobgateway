import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Plus, Search, MoreHorizontal, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { EmptyState } from '~/components/EmptyState'
import { formatDate } from '~/lib/utils'
import { useFetch } from '~/hooks/use-fetch'
import type { Application, PaginatedResponse } from '~/types'

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
  active: 'success',
  pending: 'warning',
  suspended: 'destructive',
  rejected: 'destructive',
}

const envVariant: Record<string, 'info' | 'success'> = {
  sandbox: 'info',
  production: 'success',
}

export default function ApplicationsList() {
  const [search, setSearch] = useState('')
  const { data, loading, error, refetch } = useFetch<PaginatedResponse<Application>>('/api/v1/applications')

  const applications = data?.data ?? []
  const filtered = applications.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-semibold tracking-tight">Applications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your API applications and credentials
          </p>
        </div>
        <Link href="/admin/applications/create">
          <Button size="sm">
            <Plus className="size-3.5" />
            New Application
          </Button>
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <Card>
          <CardContent className="flex items-center gap-4">
            <AlertCircle className="size-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive flex-1">{error}</p>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="size-3" /> Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search + Table */}
      <Card>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applications..."
              className="pl-9"
            />
          </div>

          <div className="glass-table-wrapper">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <EmptyState
                        icon={search ? Search : Plus}
                        title={search ? 'No results found' : 'No applications yet'}
                        description={
                          search
                            ? 'Try a different search term'
                            : 'Create your first application to get started'
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((app, i) => (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        <Link
                          href={`/admin/applications/${app.id}`}
                          className="hover:underline"
                        >
                          {app.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={envVariant[app.environment] || 'default'}>
                          {app.environment}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[app.status]}>{app.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {formatDate(app.created_at)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="size-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/applications/${app.id}`}>
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/applications/${app.id}/edit`}>
                                Edit
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
