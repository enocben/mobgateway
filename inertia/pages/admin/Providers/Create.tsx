import { useState } from 'react'
import { router, Link } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { toast } from 'sonner'

export default function CreateProvider() {
  const [form, setForm] = useState({ name: '', code: '', type: 'direct', config: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let configJson = {}
      if (form.config.trim()) {
        try { configJson = JSON.parse(form.config) } catch { throw new Error('Invalid config JSON') }
      }
      const res = await fetch('/api/v1/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: form.name, code: form.code, type: form.type, config: configJson }),
      })
      if (!res.ok) throw new Error('Failed to create provider')
      toast.success('Provider created successfully')
      router.visit('/admin/providers')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create provider')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/providers">
          <Button variant="ghost" size="icon"><ArrowLeft className="size-5" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Provider</h1>
          <p className="text-sm text-muted-foreground mt-1">Register a new payment provider</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Provider Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Provider Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Orange Money" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="code">Provider Code</Label>
              <Input id="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="OM" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="aggregator">Aggregator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="config">Config (JSON)</Label>
              <Textarea id="config" value={form.config} onChange={(e) => setForm({ ...form, config: e.target.value })} placeholder='{"api_key": "...", "endpoint": "..."}' rows={4} />
              <p className="text-xs text-muted-foreground">Optional provider-specific configuration in JSON format.</p>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Provider'}</Button>
              <Button type="button" variant="outline" onClick={() => router.visit('/admin/providers')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
