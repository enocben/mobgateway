import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { cn } from '~/lib/utils'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  Server, Clock, Activity, AlertTriangle, CheckCircle2, Zap, Wifi,
} from 'lucide-react'

const uptimeData = [
  { time: '00:00', value: 99.9 }, { time: '04:00', value: 99.8 },
  { time: '08:00', value: 99.9 }, { time: '12:00', value: 100 },
  { time: '16:00', value: 99.7 }, { time: '20:00', value: 99.9 },
]

const responseTimeData = [
  { time: '00:00', value: 120 }, { time: '04:00', value: 95 },
  { time: '08:00', value: 150 }, { time: '12:00', value: 180 },
  { time: '16:00', value: 130 }, { time: '20:00', value: 110 },
]

function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <Icon className="size-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function MonitoringDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Monitoring</h1>
        <p className="text-sm text-muted-foreground mt-1">System health and performance metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Uptime" value="99.97%" icon={CheckCircle2} />
        <StatCard title="Avg Response Time" value="145ms" icon={Clock} />
        <StatCard title="Error Rate" value="0.12%" icon={AlertTriangle} />
        <StatCard title="Active Connections" value="245" icon={Wifi} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="size-5 text-primary" /> Uptime (24h)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={uptimeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis domain={[99, 100]} className="text-xs" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="size-5 text-primary" /> Response Time (ms)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Server className="size-5 text-primary" /> Service Status</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { name: 'API Gateway', status: 'operational' },
              { name: 'Orange Money Provider', status: 'operational' },
              { name: 'MTN Money Provider', status: 'operational' },
              { name: 'Wave Provider', status: 'degraded' },
              { name: 'Database', status: 'operational' },
              { name: 'Webhook Service', status: 'operational' },
            ].map((service, i) => (
              <div key={service.name}>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{service.name}</span>
                  <Badge variant={service.status === 'operational' ? 'success' : 'warning'}>
                    {service.status === 'operational' ? <CheckCircle2 className="size-3 mr-1 inline" /> : <AlertTriangle className="size-3 mr-1 inline" />}
                    {service.status}
                  </Badge>
                </div>
                {i < 5 && <Separator className="mt-3" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
