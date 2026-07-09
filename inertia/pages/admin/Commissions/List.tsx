import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { formatCurrency, formatDate } from '~/lib/utils'
import { useFetch } from '~/hooks/use-fetch'
import type { Commission, PaginatedResponse } from '~/types'

export default function CommissionsList() {
  const { data, loading, error, refetch } = useFetch<PaginatedResponse<Commission>>('/api/v1/commissions')

  const commissions = data?.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Commissions</h1>
        <p className="text-sm text-muted-foreground mt-1">Provider commission rates and rules</p>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Min Amount</TableHead>
                <TableHead>Max Amount</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : commissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No commissions configured
                  </TableCell>
                </TableRow>
              ) : (
                commissions.map((c, i) => (
                  <motion.tr key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b transition-colors hover:bg-muted/50">
                    <TableCell className="font-medium">{c.provider_id ?? 'Global'}</TableCell>
                    <TableCell className="capitalize">{c.type}</TableCell>
                    <TableCell>{c.type === 'percentage' ? `${c.value}%` : formatCurrency(c.value)}</TableCell>
                    <TableCell>{c.min_amount !== null ? formatCurrency(c.min_amount) : '—'}</TableCell>
                    <TableCell>{c.max_amount !== null ? formatCurrency(c.max_amount) : '—'}</TableCell>
                    <TableCell className="font-mono text-xs">{c.country_code ?? 'All'}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{formatDate(c.created_at)}</TableCell>
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
