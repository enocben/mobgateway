import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Search, MoreHorizontal } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { formatDate } from '~/lib/utils'
import { useApplicationStore } from '~/context/application_context'
import { urlFor } from '~/client'
import { Data } from '@generated/data'

type Props = {
  providers: Data.Provider[]
}

export default function ProvidersList({ providers }: Props) {
  const [search, setSearch] = useState('')
  const applicationId = useApplicationStore((a) => a.applicationId)

  const filtered = providers.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Providers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Available payment providers — add new ones via code only
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search providers..."
              className="pl-9"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {search ? 'No providers match your search' : 'No providers registered — add a provider class in app/providers/payment/'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((provider, i) => (
                  <motion.tr
                    key={provider.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      <Link
                        href={urlFor('admin.providers.detail', {
                          id: applicationId!,
                          providerId: provider.id,
                        })}
                        className="hover:underline"
                      >
                        {provider.name}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{provider.code}</TableCell>
                    <TableCell className="capitalize">{provider.type}</TableCell>
                    <TableCell>
                      <Badge variant={provider.status === 'active' ? 'success' : 'secondary'}>
                        {provider.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {formatDate(provider.createdAt!)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={urlFor('admin.providers.detail', {
                                id: applicationId!,
                                providerId: provider.id,
                              })}
                            >
                              View Details
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
        </CardContent>
      </Card>
    </div>
  )
}
