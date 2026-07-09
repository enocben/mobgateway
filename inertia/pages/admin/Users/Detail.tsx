import { Link, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Shield, Calendar, Activity, Wallet, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { formatDate } from '~/lib/utils'
import { useFetch } from '~/hooks/use-fetch'
import type { User, ApiResponse } from '~/types'

const roleVariant: Record<string, 'destructive' | 'warning' | 'info' | 'default'> = {
  admin: 'destructive',
  manager: 'warning',
  developer: 'info',
}

export default function UserDetail() {
  const { url } = usePage()
  const id = url.split('/').pop()
  const { data, loading, error, refetch } = useFetch<ApiResponse<User>>(
    id ? `/api/v1/users/${id}` : null
  )

  const user = data?.data

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <AlertCircle className="size-8 text-destructive" />
        <p className="text-destructive font-medium">{error}</p>
        <Button variant="outline" onClick={refetch}>
          <RefreshCw className="size-4 mr-2" /> Retry
        </Button>
      </div>
    )
  }

  if (loading || !user) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2"><Card><CardHeader><Skeleton className="h-6 w-40" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card></div>
          <Card><CardHeader><Skeleton className="h-6 w-24" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon"><ArrowLeft className="size-5" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">User profile and activity</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarFallback className="text-lg">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={roleVariant[user.role] || 'default'} className="capitalize">{user.role}</Badge>
                    <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>{user.status}</Badge>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="size-4" /> Email</div>
                <span>{user.email}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Shield className="size-4" /> Role</div>
                <Badge variant={roleVariant[user.role] || 'default'} className="capitalize">{user.role}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Wallet className="size-4" /> Application</div>
                <span className="text-sm">{user.application?.name ?? user.application_id ?? '—'}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="size-4" /> Joined</div>
                <span className="text-sm">{formatDate(user.created_at)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader><CardTitle className="text-lg">Details</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-mono text-sm">{user.id}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm">{formatDate(user.updated_at)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
