import { Link, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Activity, Code, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { formatDate } from '~/lib/utils'
import { useFetch } from '~/hooks/use-fetch'
import type { Provider, ApiResponse } from '~/types'

export default function ProviderDetail() {
  const { url } = usePage()
  const id = url.split('/').pop()
  const { data, loading, error, refetch } = useFetch<ApiResponse<Provider>>(
    id ? `/api/v1/providers/${id}` : null
  )

  const provider = data?.data

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

  if (loading || !provider) {
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
        <Link href="/admin/providers">
          <Button variant="ghost" size="icon"><ArrowLeft className="size-5" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{provider.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">Provider details and configuration</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle>Provider Information</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Activity className="size-4" /> Status</span>
                <Badge variant={provider.status === 'active' ? 'success' : 'secondary'}>{provider.status}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Code className="size-4" /> Code</span>
                <span className="font-mono text-sm">{provider.code}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="size-4" /> Created</span>
                <span className="text-sm">{formatDate(provider.created_at)}</span>
              </div>
            </CardContent>
          </Card>

          {provider.config && Object.keys(provider.config).length > 0 && (
            <Card>
              <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
              <CardContent>
                <pre className="bg-muted rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(provider.config, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader><CardTitle className="text-lg">Details</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Provider ID</p>
                <p className="font-mono text-sm">{provider.id}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="capitalize text-sm">{provider.type}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm">{formatDate(provider.updated_at)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
