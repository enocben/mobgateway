import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { Separator } from '~/components/ui/separator'
import { toast } from 'sonner'

export default function GeneralSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Mobile Money Gateway',
    adminEmail: 'admin@mmgateway.com',
    defaultCurrency: 'XOF',
    maintenanceMode: false,
    apiRateLimit: 100,
    enableRegistration: true,
    sessionTimeout: 30,
  })

  const handleSave = () => {
    toast.success('Settings saved successfully')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure application settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>Basic application configuration</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Site Name</Label>
                <Input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Admin Email</Label>
                <Input value={settings.adminEmail} onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Default Currency</Label>
                <Input value={settings.defaultCurrency} onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Security & Limits</CardTitle>
              <CardDescription>Rate limiting and session settings</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>API Rate Limit (req/min)</Label>
                <Input type="number" value={settings.apiRateLimit} onChange={(e) => setSettings({ ...settings, apiRateLimit: Number(e.target.value) })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Session Timeout (minutes)</Label>
                <Input type="number" value={settings.sessionTimeout} onChange={(e) => setSettings({ ...settings, sessionTimeout: Number(e.target.value) })} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground">Put the application in maintenance mode</p>
                </div>
                <Switch checked={settings.maintenanceMode} onCheckedChange={(v) => setSettings({ ...settings, maintenanceMode: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Registration</Label>
                  <p className="text-xs text-muted-foreground">Allow new user registrations</p>
                </div>
                <Switch checked={settings.enableRegistration} onCheckedChange={(v) => setSettings({ ...settings, enableRegistration: v })} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="mr-2 size-4" /> Save Settings
        </Button>
      </div>
    </div>
  )
}
