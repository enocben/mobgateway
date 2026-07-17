import { usePage } from '@inertiajs/react'
import { Form } from '@adonisjs/inertia/react'
import { motion } from 'framer-motion'
import { Save, Building2, Calendar, Hash, Shield, Key, Plus, Trash2, Copy, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { Badge } from '~/components/ui/badge'
import { formatDate } from '~/lib/utils'
import { useApplicationStore } from '~/context/application_context'
import { Data } from '@generated/data'
import { type InertiaProps } from '~/types'
import { useState } from 'react'

type Props = {
  application: Data.Application
  apiKeys: {
    id: string
    name: string
    keyType: string
    createdAt: string | null
    lastUsedAt: string | null
    revokedAt: string | null
  }[]
  flash?: {
    generatedApiKey?: string
  }
}

export default function GeneralSettings() {
  const applicationId = useApplicationStore((a) => a.applicationId)
  const { application, apiKeys } = usePage<InertiaProps<Props>>().props
  const generatedKey = (usePage<InertiaProps<Props>>().props.flash as any)?.generatedApiKey
  const [showKey, setShowKey] = useState(true)

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure application settings
        </p>
      </div>

      {/* Generated key banner */}
      {generatedKey && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-emerald-500/50 bg-emerald-500/5">
            <CardContent className="pt-6 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Key className="size-4 text-emerald-500" />
                <span className="font-medium text-sm text-emerald-600">New API Key Generated</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Copy this key now. You won't be able to see it again.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted rounded px-3 py-2 text-xs font-mono break-all select-all">
                  {showKey ? generatedKey : '•'.repeat(48)}
                </code>
                <Button variant="ghost" size="icon" onClick={() => setShowKey(!showKey)}>
                  {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigator.clipboard.writeText(generatedKey)}
                >
                  <Copy className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>Application</CardTitle>
            <CardDescription>Modify the application name and view metadata</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Application Name</Label>
              <Form
                route="admin.app.settings.update"
                routeParams={{ id: applicationId! }}
              >
                <div className="flex gap-3">
                  <Input
                    id="name"
                    name="name"
                    defaultValue={application.name}
                    className="flex-1"
                    placeholder="Application name"
                    required
                  />
                  <Button type="submit">
                    <Save className="size-4 mr-2" /> Save
                  </Button>
                </div>
              </Form>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Hash className="size-4" /> ID
              </span>
              <span className="font-mono text-xs">{application.id}</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Building2 className="size-4" /> Slug
              </span>
              <span className="font-mono text-xs">{application.slug || '—'}</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Shield className="size-4" /> Status
              </span>
              <Badge variant={application.status === 'active' ? 'success' : 'secondary'}>
                {application.status}
              </Badge>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="size-4" /> Created
              </span>
              <span className="text-sm">{formatDate(application.createdAt!)}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Keys */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage API keys for this application</CardDescription>
              </div>
              <Form
                route="admin.app.settings.api-key.generate"
                routeParams={{ id: applicationId! }}
              >
                <Button type="submit" size="sm">
                  <Plus className="size-4 mr-1" /> Generate Key
                </Button>
              </Form>
            </div>
          </CardHeader>
          <CardContent>
            {apiKeys.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No API keys yet. Generate one to get started.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Key className="size-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{key.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {key.keyType} · {key.createdAt ? formatDate(key.createdAt) : '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {key.revokedAt ? (
                        <Badge variant="destructive" className="text-xs">Revoked</Badge>
                      ) : key.lastUsedAt ? (
                        <Badge variant="outline" className="text-xs">Active</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Never used</Badge>
                      )}
                      <Form
                        route="admin.app.settings.api-key.destroy"
                        routeParams={{ id: applicationId!, keyId: key.id }}
                      >
                        <Button variant="ghost" size="icon" type="submit" className="size-7">
                          <Trash2 className="size-3 text-destructive" />
                        </Button>
                      </Form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
