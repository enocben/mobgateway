import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { formatDate, cn } from '~/lib/utils'
import { useFetch } from '~/hooks/use-fetch'
import type { AuditLog, PaginatedResponse } from '~/types'

const methodColors: Record<string, 'info' | 'success' | 'warning' | 'destructive' | 'default'> = {
  GET: 'info', POST: 'success', PUT: 'warning', PATCH: 'warning', DELETE: 'destructive',
}

export default function LogsList() {
  const [search, setSearch] = useState('')
  const { data, loading, error, refetch } = useFetch<PaginatedResponse<AuditLog>>('/api/v1/audit-logs')

  const logs = data?.data ?? []
  const filtered = logs.filter((l) =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.entity_type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">Audit trail of all system actions</p>
      </div>

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6 flex items-center gap-4">
            <AlertCircle className="size-5 text-destructive" />
            <p className="text-sm text-destructive flex-1">{error}</p>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="size-3 mr-1" /> Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by action or entity type..." className="pl-9" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {search ? 'No logs match your search' : 'No audit logs found'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((log, i) => (
                  <motion.tr key={log.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b transition-colors hover:bg-muted/50">
                    <TableCell><Badge variant="secondary">{log.action}</Badge></TableCell>
                    <TableCell className="capitalize">{log.entity_type}</TableCell>
                    <TableCell className="font-mono text-xs">{log.entity_id}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{log.user_id ?? 'system'}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{log.ip_address}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{formatDate(log.created_at)}</TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
