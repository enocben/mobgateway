import { useState, useEffect } from 'react'
import { router, Link, usePage } from '@inertiajs/react'
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { toast } from 'sonner'
import { useFetch } from '~/hooks/use-fetch'
import type { Application, ApiResponse } from '~/types'

export default function EditApplication() {
  const { url } = usePage()
  const id = url.split('/').filter(Boolean).pop()
  const { data, loading: loadingApp, error } = useFetch<ApiResponse<Application>>(
    id ? `/api/v1/applications/${id}` : null
  )
  const [form, setForm] = useState({ name: '', organization_id: '', environment: 'sandbox' as const })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (data?.data) {
      setForm({
        name: data.data.name,
        organization_id: String(data.data.organization_id),
        environment: data.data.environment,
      })
    }
  }, [data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/v1/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to update application')
      toast.success('Application updated successfully')
      router.visit('/admin/applications')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update application')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <AlertCircle className="size-8 text-destructive" />
        <p className="text-destructive font-medium">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}><RefreshCw className="size-4 mr-2" /> Retry</Button>
      </div>
    )
  }

  if (loadingApp) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-64" />
        <Card className="max-w-2xl">
          <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/applications">
          <Button variant="ghost" size="icon"><ArrowLeft className="size-5" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Application</h1>
          <p className="text-sm text-muted-foreground mt-1">Update application settings</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Application Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Application Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="organization_id">Organization ID</Label>
              <Input id="organization_id" type="number" value={form.organization_id} onChange={(e) => setForm({ ...form, organization_id: e.target.value })} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Environment</Label>
              <Select value={form.environment} onValueChange={(v) => setForm({ ...form, environment: v as 'sandbox' | 'production' })}>
                <SelectTrigger><SelectValue placeholder="Select environment" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
              <Button type="button" variant="outline" onClick={() => router.visit('/admin/applications')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
