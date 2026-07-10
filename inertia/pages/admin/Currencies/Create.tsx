import { useState } from 'react'
import { router, Link, usePage } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { toast } from 'sonner'
import { useApplicationStore } from '~/context/application_context'

export default function CreateCurrency() {
  const { url } = usePage()
  const applicationId = useApplicationStore((c) => c.applicationId)
  const [form, setForm] = useState({ code: '', name: '', symbol: '', decimals: '2' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/v1/currencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...form, decimals: Number(form.decimals), applicationId }),
      })
      if (!res.ok) throw new Error('Failed to create currency')
      toast.success('Currency created')
      router.visit(url.replace('/create', ''))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create currency')
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
          <h1 className="text-2xl font-bold tracking-tight">Add Currency</h1>
          <p className="text-sm text-muted-foreground mt-1">Register a new currency</p>
        </div>
      </div>

      <Card className="max-w-lg">
        <CardHeader><CardTitle>Currency Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="code">ISO Code (3 letters)</Label>
              <Input id="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="XOF" maxLength={3} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Franc CFA" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input id="symbol" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} placeholder="CFA" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="decimals">Decimals</Label>
              <Input id="decimals" type="number" value={form.decimals} onChange={(e) => setForm({ ...form, decimals: e.target.value })} min={0} max={6} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Currency'}</Button>
              <Button type="button" variant="outline" onClick={() => router.visit(url.replace('/create', ''))}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
