import { usePage } from '@inertiajs/react'
import { Form } from '@adonisjs/inertia/react'
import { motion } from 'framer-motion'
import { Save, Building2, Calendar, Hash, Shield } from 'lucide-react'
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

type Props = {
  application: Data.Application
}

export default function GeneralSettings() {
  const applicationId = useApplicationStore((a) => a.applicationId)
  const { application } = usePage<InertiaProps<Props>>().props

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure application settings
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>Application</CardTitle>
            <CardDescription>Modify the application name and view metadata</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Name — editable */}
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

            {/* Read-only metadata */}
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
    </div>
  )
}
