import { useState } from 'react'
import { router, Link, usePage } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { toast } from 'sonner'
import { useApplicationStore } from '~/context/application_context'

export default function CreateCountry() {
  const { url } = usePage()
  const applicationId = useApplicationStore((c) => c.applicationId)
  const [form, setForm] = useState({ code: '', name: '', currencyCode: '', phonePrefix: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/v1/countries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...form, applicationId }),
      })
      if (!res.ok) throw new Error('Failed to create country')
      toast.success('Country created')
      router.visit(url.replace('/create', ''))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create country')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href={url.replace('/create', '')}>
          <Button variant="ghost" size="icon"><ArrowLeft className="size-5" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Country</h1>
          <p className="text-sm text-muted-foreground mt-1">Register a new country</p>
        </div>
      </div>

      <Card className="max-w-lg">
        <CardHeader><CardTitle>Country Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="code">ISO Code (2 letters)</Label>
              <Input id="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="CI" maxLength={2} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Côte d'Ivoire" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="currencyCode">Currency Code</Label>
              <Input id="currencyCode" value={form.currencyCode} onChange={(e) => setForm({ ...form, currencyCode: e.target.value.toUpperCase() })} placeholder="XOF" maxLength={3} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phonePrefix">Phone Prefix</Label>
              <Input id="phonePrefix" value={form.phonePrefix} onChange={(e) => setForm({ ...form, phonePrefix: e.target.value })} placeholder="+225" required />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Country'}</Button>
              <Button type="button" variant="outline" onClick={() => router.visit(url.replace('/create', ''))}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
