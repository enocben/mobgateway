import { motion } from 'framer-motion'
import { Mail, Shield, Calendar, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Separator } from '~/components/ui/separator'
import { formatDate } from '~/lib/utils'
import { Data } from '@generated/data'

const roleVariant: Record<string, 'destructive' | 'warning' | 'info' | 'default'> = {
  admin: 'destructive',
  manager: 'warning',
  developer: 'info',
}

export default function UserDetail({ user }: { user: Data.User}) {

  return (
    <div className="flex flex-col gap-6">
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
                <span className="text-sm">{user.application?.name ?? user.applicationId ?? '—'}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="size-4" /> Joined</div>
                <span className="text-sm">{formatDate(user.createdAt!)}</span>
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
                <p className="text-sm">{formatDate(user.updatedAt!)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
