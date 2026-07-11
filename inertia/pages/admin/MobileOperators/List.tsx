import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Globe, Hash } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Data } from '@generated/data'
import { DialogMobileOperator } from '~/components/mobile_operator/dialog_mobile_operator'

type Props = {
  mobileOperators: Data.MobileOperator[] | undefined
}

export default function MobileOperatorsList({ mobileOperators: operators }: Props) {
  const [search, setSearch] = useState('')

  const filtered =
    operators?.filter(
      (op) =>
        op.name.toLowerCase().includes(search.toLowerCase()) ||
        op.country.currencyCode.toLowerCase().includes(search.toLowerCase())
    ) ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mobile Operators</h1>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground mt-1">Mobile network operators by country</p>
          <DialogMobileOperator />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search operators..."
              className="pl-9"
            />
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
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {search ? 'No operators match your search' : 'No mobile operators found'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((op, i) => (
                  <motion.tr
                    key={op.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {op.logoUrl ? (
                          <img src={op.logoUrl} alt={op.name} className="size-6 rounded" />
                        ) : (
                          <Globe className="size-4 text-muted-foreground" />
                        )}
                        {op.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">
                        {op.country?.name ?? op.country.code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {op.prefixes?.length ? (
                          op.prefixes.map((p) => (
                            <Badge key={p.id} variant="secondary" className="font-mono text-xs">
                              <Hash className="size-3 mr-0.5" />
                              {p.prefix}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={op.isEnabled ? 'success' : 'secondary'}>
                        {op.isEnabled ? 'enabled' : 'disabled'}
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
