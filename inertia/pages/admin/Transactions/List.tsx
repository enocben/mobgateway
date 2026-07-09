import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
import { formatCurrency, formatDate } from '~/lib/utils'
import { useFetch } from '~/hooks/use-fetch'
import type { Transaction, TransactionEvent, PaginatedResponse, ApiResponse } from '~/types'

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'info' | 'default'> = {
  completed: 'success',
  pending: 'warning',
  processing: 'info',
  failed: 'destructive',
  cancelled: 'destructive',
  expected: 'default',
}

export default function TransactionsList() {
  const [search, setSearch] = useState('')
  const { data, loading, error, refetch } = useFetch<PaginatedResponse<Transaction>>('/api/v1/transactions')
  const [selectedTxId, setSelectedTxId] = useState<number | null>(null)
  const { data: eventsData, loading: eventsLoading } = useFetch<ApiResponse<TransactionEvent[]>>(
    selectedTxId ? `/api/v1/transactions/${selectedTxId}/events` : null
  )

  const transactions = data?.data ?? []
  const filtered = transactions.filter((tx) =>
    tx.reference?.toLowerCase().includes(search.toLowerCase()) ||
    tx.msisdn?.includes(search) ||
    tx.idempotency_key?.toLowerCase().includes(search.toLowerCase())
  )

  const selectedTx = transactions.find((t) => t.id === selectedTxId) ?? null
  const events = eventsData?.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">View all payment transactions</p>
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
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by reference, MSISDN, or idempotency key..." className="pl-9" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>MSISDN</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Idempotency Key</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {search ? 'No transactions match your search' : 'No transactions found'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((tx, i) => (
                  <motion.tr key={tx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b transition-colors hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">{tx.reference}</TableCell>
                    <TableCell className="font-mono text-xs">{tx.msisdn}</TableCell>
                    <TableCell className="capitalize">{tx.tx_type}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(tx.amount, tx.currency)}</TableCell>
                    <TableCell><Badge variant={statusVariant[tx.status] || 'default'}>{tx.status}</Badge></TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground max-w-[120px] truncate">{tx.idempotency_key}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{formatDate(tx.created_at)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedTxId(tx.id)}>
                        <Eye className="size-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedTxId} onOpenChange={() => setSelectedTxId(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>{selectedTx?.reference}</DialogDescription>
          </DialogHeader>
          {selectedTx && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold">{formatCurrency(selectedTx.amount, selectedTx.currency)}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant={statusVariant[selectedTx.status]}>{selectedTx.status}</Badge></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="capitalize">{selectedTx.tx_type}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">MSISDN</span><span className="font-mono text-sm">{selectedTx.msisdn}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Idempotency Key</span><span className="font-mono text-xs">{selectedTx.idempotency_key}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Provider Ref</span><span className="font-mono text-xs">{selectedTx.provider_ref || '—'}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Error</span><span className="text-sm text-destructive">{selectedTx.error_message || '—'}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-sm">{formatDate(selectedTx.created_at)}</span></div>

              {events.length > 0 && (
                <>
                  <Separator className="!my-2" />
                  <h4 className="text-sm font-semibold">Transaction Events</h4>
                  {eventsLoading ? (
                    <Skeleton className="h-20 w-full" />
                  ) : (
                    <div className="flex flex-col gap-2">
                      {events.map((event) => (
                        <div key={event.id} className="flex items-center gap-3 text-sm p-2 rounded-lg bg-muted/50">
                          <Badge variant="secondary" className="shrink-0 text-xs">
                            {event.to_status}
                          </Badge>
                          <span className="text-muted-foreground text-xs font-mono">{formatDate(event.created_at)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
