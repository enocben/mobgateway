import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { formatCurrency, formatDate } from '~/lib/utils'
import { useFetch } from '~/hooks/use-fetch'
import type { ReconciliationEntry, PaginatedResponse } from '~/types'

const statusVariant: Record<string, 'warning' | 'success' | 'destructive'> = {
  pending: 'warning',
  matched: 'success',
  exception: 'destructive',
}

export default function ReconciliationList() {
  const [search, setSearch] = useState('')
  const { data, loading, error, refetch } = useFetch<PaginatedResponse<ReconciliationEntry>>('/api/v1/reconciliation')

  const entries = data?.data ?? []
  const filtered = entries.filter((e) =>
    e.external_ref.toLowerCase().includes(search.toLowerCase()) ||
    e.source.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reconciliation</h1>
        <p className="text-sm text-muted-foreground mt-1">Reconcile provider statements with system transactions</p>
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
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by external ref or source..." className="pl-9" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>External Ref</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Matched At</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {search ? 'No entries match your search' : 'No reconciliation entries found'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((entry, i) => (
                  <motion.tr key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b transition-colors hover:bg-muted/50">
                    <TableCell className="font-mono text-xs font-medium">{entry.external_ref}</TableCell>
                    <TableCell className="capitalize">{entry.source}</TableCell>
                    <TableCell>{formatCurrency(entry.amount, entry.currency)}</TableCell>
                    <TableCell className="font-mono text-xs">{entry.transaction_id ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[entry.status] || 'default'}>
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {entry.matched_at ? formatDate(entry.matched_at) : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{formatDate(entry.created_at)}</TableCell>
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
