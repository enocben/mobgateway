import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, AlertCircle, RefreshCw, Globe, Hash } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { useFetch } from '~/hooks/use-fetch'
import type { MobileOperator, OperatorPrefix, PaginatedResponse } from '~/types'

interface OperatorWithPrefixes extends MobileOperator {
  prefixes?: OperatorPrefix[]
}

export default function MobileOperatorsList() {
  const [search, setSearch] = useState('')
  const { data, loading, error, refetch } = useFetch<PaginatedResponse<OperatorWithPrefixes>>('/api/v1/mobile-operators')

  const operators = data?.data ?? []
  const filtered = operators.filter((op) =>
    op.name.toLowerCase().includes(search.toLowerCase()) ||
    op.country_code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mobile Operators</h1>
        <p className="text-sm text-muted-foreground mt-1">Mobile network operators by country</p>
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
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search operators..." className="pl-9" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Prefixes</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {search ? 'No operators match your search' : 'No mobile operators found'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((op, i) => (
                  <motion.tr key={op.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b transition-colors hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {op.logo_url ? (
                          <img src={op.logo_url} alt={op.name} className="size-6 rounded" />
                        ) : (
                          <Globe className="size-4 text-muted-foreground" />
                        )}
                        {op.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">{op.country?.name ?? op.country_code}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {op.prefixes?.length ? (
                          op.prefixes.map((p) => (
                            <Badge key={p.id} variant="secondary" className="font-mono text-xs">
                              <Hash className="size-3 mr-0.5" />{p.prefix}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={op.is_enabled ? 'success' : 'secondary'}>
                        {op.is_enabled ? 'enabled' : 'disabled'}
                      </Badge>
                    </TableCell>
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
