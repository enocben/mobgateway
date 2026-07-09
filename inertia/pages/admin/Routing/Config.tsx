import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, ArrowUpDown, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { toast } from 'sonner'
import type { RoutingRule } from '~/types'

const mockRules: RoutingRule[] = [
  { id: '1', name: 'Orange CI Default', provider: 'Orange Money', network: 'Orange', country: "Côte d'Ivoire", priority: 1, weight: 100, status: 'active' },
  { id: '2', name: 'MTN GH Default', provider: 'MTN Money', network: 'MTN', country: 'Ghana', priority: 1, weight: 100, status: 'active' },
  { id: '3', name: 'Wave SN Backup', provider: 'Wave', network: 'Wave', country: 'Senegal', priority: 2, weight: 50, status: 'active' },
  { id: '4', name: 'Moov BJ', provider: 'Moov Money', network: 'Moov', country: 'Benin', priority: 1, weight: 100, status: 'inactive' },
]

export default function RoutingConfig() {
  const [rules, setRules] = useState<RoutingRule[]>(mockRules)

  const moveRule = (index: number, direction: 'up' | 'down') => {
    const newRules = [...rules]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newRules.length) return
    ;[newRules[index], newRules[targetIndex]] = [newRules[targetIndex], newRules[index]]
    setRules(newRules)
  }

  const handleSave = () => {
    toast.success('Routing configuration saved')
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Routing Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure transaction routing rules and priorities</p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" /> Add Rule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Routing Rules</CardTitle>
          <CardDescription>Rules are evaluated in priority order. Higher weight = more traffic.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Priority</TableHead><TableHead>Name</TableHead><TableHead>Provider</TableHead><TableHead>Network</TableHead><TableHead>Country</TableHead><TableHead>Weight</TableHead><TableHead>Status</TableHead><TableHead className="w-20">Order</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule, i) => (
                <motion.tr key={rule.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b transition-colors hover:bg-muted/50">
                  <TableCell><Badge variant={rule.priority === 1 ? 'default' : 'secondary'}>{rule.priority}</Badge></TableCell>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>{rule.provider}</TableCell>
                  <TableCell>{rule.network}</TableCell>
                  <TableCell>{rule.country}</TableCell>
                  <TableCell>{rule.weight}</TableCell>
                  <TableCell><Badge variant={rule.status === 'active' ? 'success' : 'secondary'}>{rule.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => moveRule(i, 'up')} disabled={i === 0}>
                        <ArrowUpDown className="size-3 rotate-180" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => moveRule(i, 'down')} disabled={i === rules.length - 1}>
                        <ArrowUpDown className="size-3" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <Button onClick={handleSave}>
              <Save className="mr-2 size-4" /> Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
