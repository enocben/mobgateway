import { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Copy,
  Check,
  Key,
  Globe,
  Calendar,
  Activity,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { EmptyState } from '~/components/EmptyState'
import { formatDate } from '~/lib/utils'
import { useFetch } from '~/hooks/use-fetch'
import type { Application, ApiResponse } from '~/types'

const envVariant: Record<string, 'info' | 'success'> = {
  sandbox: 'info',
  production: 'success',
}

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
  active: 'success',
  pending: 'warning',
  suspended: 'destructive',
  rejected: 'destructive',
}

export default function ApplicationDetail() {
  const { url } = usePage()
  const id = url.split('/').pop()
  const { data, loading, error, refetch } = useFetch<ApiResponse<Application>>(
    id ? `/api/v1/applications/${id}` : null
  )
  const [copied, setCopied] = useState(false)

  const app = data?.data

  const copyApiKey = () => {
    navigator.clipboard.writeText(app?.slug ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Failed to load"
        description={error}
        actionLabel="Retry"
        onAction={refetch}
      />
    )
  }

  if (loading || !app) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <div>
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/applications">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-xl font-semibold tracking-tight">
              {app.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Application details and configuration
            </p>
          </div>
        </div>
        <Link href={`/admin/applications/${app.id}/edit`}>
          <Button size="sm">Edit</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 flex flex-col gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Application Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="size-4" /> Status
                </div>
                <Badge variant={statusVariant[app.status] || 'default'}>
                  {app.status}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="size-4" /> Environment
                </div>
                <Badge variant={envVariant[app.environment] || 'default'}>
                  {app.environment}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" /> Created
                </div>
                <span className="font-medium text-sm">{formatDate(app.created_at)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="size-4" /> Slug
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md bg-muted px-3 py-2.5 text-sm font-mono break-all">
                  {app.slug}
                </code>
                <Button variant="outline" size="icon-sm" onClick={copyApiKey}>
                  {copied ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Application slug used for API identification.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          <Card size="sm">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Application ID</p>
                <p className="font-mono text-sm">{app.id}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm">{formatDate(app.updated_at)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
