import { useState, useEffect } from 'react'
import { router, Link, usePage } from '@inertiajs/react'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { EmptyState } from '~/components/EmptyState'
import { toast } from 'sonner'
import { useFetch } from '~/hooks/use-fetch'
import type { Application, ApiResponse } from '~/types'

export default function EditApplication() {
  const { url } = usePage()
  const id = url.split('/').filter(Boolean).pop()
  const { data, loading: loadingApp, error, refetch } = useFetch<ApiResponse<Application>>(
    id ? `/api/v1/applications/${id}` : null
  )
  const [form, setForm] = useState<{ name: string; environment: 'sandbox' | 'production' }>({
    name: '',
    environment: 'sandbox',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (data?.data) {
      setForm({
        name: data.data.name,
        environment: (data.data.environment as 'sandbox' | 'production') || 'sandbox',
      })
    }
  }, [data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/v1/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to update application')
      toast.success('Application updated successfully')
      router.visit('/admin/applications')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update application'
      )
    } finally {
      setLoading(false)
    }
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

  if (loadingApp) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-7 w-64" />
        <Card className="max-w-xl">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/applications">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-xl font-semibold tracking-tight">
            Edit Application
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Update application settings
          </p>
        </div>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-[13px]">
                Application Name
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[13px]">Environment</Label>
              <Select
                value={form.environment}
                onValueChange={(v: string) =>
                  setForm({ ...form, environment: (v as 'sandbox' | 'production') || 'sandbox' })
                }
              >
                <SelectTrigger className="h-8 text-[13px]">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" size="sm" disabled={loading}>
                {loading ? 'Saving…' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.visit('/admin/applications')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
