import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Plus, Search, Trash2 } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { useApplicationStore } from '~/context/application_context'
import { urlFor } from '~/client'
import { Data } from '@generated/data'
import { Form } from '@adonisjs/inertia/react'

type CountriesListProps = {
  countries: Data.Country[]
}

export default function CountriesList({ countries }: CountriesListProps) {
  const applicationId = useApplicationStore((c) => c.applicationId)
  const [search, setSearch] = useState('')

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.currencyCode.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Countries</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Supported countries and their currencies
          </p>
        </div>
        <Link href={urlFor('admin.countries.create', { id: applicationId! })}>
          <Button>
            <Plus className="mr-2 size-4" />
            Add Country
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries..."
              className="pl-9"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Phone Prefix</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {search ? 'No countries match your search' : 'No countries found'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((country, i) => (
                  <motion.tr
                    key={country.code}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-mono font-medium">{country.code}</TableCell>
                    <TableCell>{country.name}</TableCell>
                    <TableCell className="font-mono">{country.currencyCode}</TableCell>
                    <TableCell className="font-mono text-xs">{country.phonePrefix}</TableCell>
                    <TableCell>
                      <Form
                        route="admin.countries.delete"
                        routeParams={{ id: country.applicationId, countryId: country.id }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          type="submit"
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </Form>
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
