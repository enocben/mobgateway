import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { Switch } from '~/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { formatDate } from '~/lib/utils'
import { useFetch } from '~/hooks/use-fetch'
import type { Webhook, PaginatedResponse } from '~/types'

export default function WebhooksList() {
  const { data, loading, error, refetch } = useFetch<PaginatedResponse<Webhook>>('/api/v1/webhooks')

  const webhooks = data?.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Webhooks</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage webhook endpoints for real-time notifications</p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" /> Add Webhook
        </Button>
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
                <TableHead>URL</TableHead>
                <TableHead>Application</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                  </TableRow>
                ))
              ) : webhooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No webhooks configured
                  </TableCell>
                </TableRow>
              ) : (
                webhooks.map((webhook, i) => (
                  <motion.tr key={webhook.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b transition-colors hover:bg-muted/50">
                    <TableCell className="font-mono text-xs max-w-[200px] truncate">{webhook.url}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{webhook.application_id}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events?.map((e) => <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant={webhook.status === 'active' ? 'success' : 'secondary'}>{webhook.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-xs">{formatDate(webhook.created_at)}</TableCell>
                    <TableCell><Switch checked={webhook.status === 'active'} /></TableCell>
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
