import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { formatDate } from '~/lib/utils'
import { Data } from '@generated/data'
import { urlFor } from '~/client'
import { useApplicationStore } from '~/context/application_context'

const roleVariant: Record<string, 'default' | 'secondary' | 'info' | 'destructive' | 'warning'> = {
  admin: 'destructive',
  manager: 'warning',
  developer: 'info',
}

type Props = {
  users: Data.User[]
}

export default function UsersList({ users }: Props) {
  const [search, setSearch] = useState('')
  const applicationId = useApplicationStore((c) => c.applicationId)

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage user accounts and permissions</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-9"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {search ? 'No users match your search' : 'No users found'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell>
                      <Link
                        href={urlFor('admin.users.detail', {
                          id: applicationId!,
                          userId: user.id,
                        })}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs">
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium hover:underline">{user.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={roleVariant[user.role] || 'default'} className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {formatDate(user.createdAt ?? '')}
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
