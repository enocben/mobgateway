import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Plus, Search, Trash2, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { useFetch } from '~/hooks/use-fetch'
import { useApplicationStore } from '~/context/application_context'
import { urlFor } from '~/client'
import { toast } from 'sonner'
import type { Currency, PaginatedResponse } from '~/types'

export default function CurrenciesList() {
  const applicationId = useApplicationStore((c) => c.applicationId)
  const [search, setSearch] = useState('')
  const { data, loading, error, refetch } = useFetch<PaginatedResponse<Currency>>(
    `/api/v1/currencies?application_id=${applicationId}`
  )

  const currencies = data?.data ?? []
  const filtered = currencies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (code: string) => {
    try {
      const res = await fetch(`/api/v1/currencies/${code}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete currency')
      toast.success('Currency deleted')
      refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete currency')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Currencies</h1>
          <p className="text-sm text-muted-foreground mt-1">Supported currencies</p>
        </div>
        <Link href={urlFor('admin.currencies.create', { id: applicationId! })}>
          <Button><Plus className="mr-2 size-4" />Add Currency</Button>
        </Link>
      </div>

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6 flex items-center gap-4">
            <AlertCircle className="size-5 text-destructive" />
            <p className="text-sm text-destructive flex-1">{error}</p>
            <Button variant="outline" size="sm" onClick={refetch}><RefreshCw className="size-3 mr-1" /> Retry</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search currencies..." className="pl-9" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Decimals</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {search ? 'No currencies match your search' : 'No currencies found'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((currency, i) => (
                  <motion.tr key={currency.code} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b transition-colors hover:bg-muted/50">
                    <TableCell className="font-mono font-medium">{currency.code}</TableCell>
                    <TableCell>{currency.name}</TableCell>
                    <TableCell>{currency.symbol}</TableCell>
                    <TableCell>{currency.decimals}</TableCell>
                    <TableCell>
                      <Badge variant={currency.is_active ? 'success' : 'secondary'}>
                        {currency.is_active ? 'active' : 'inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(currency.code)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
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
