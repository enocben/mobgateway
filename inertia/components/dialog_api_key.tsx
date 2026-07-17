import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Field, FieldLabel } from '~/components/ui/field'
import { Form } from '@adonisjs/inertia/react'
import { useApplicationStore } from '~/context/application_context'
import { Key, Plus } from 'lucide-react'
import { useState } from 'react'

interface Props {
  disabled?: boolean
}

export function DialogApiKey({ disabled }: Props) {
  const applicationId = useApplicationStore((a) => a.applicationId)
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={disabled}>
          <Plus className="size-4 mr-1" /> Generate Key
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <Form
          route="admin.app.settings.api-key.generate"
          routeParams={{ id: applicationId! }}
          // onSubmit={() => setOpen(false)}
          onSubmitComplete={() => setOpen(false)}
        >
          {({ processing }) => (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Key className="size-5" /> Generate API Key
                </DialogTitle>
                <DialogDescription>
                  Enter a name to identify this API key. The key will only be shown once — make sure
                  to copy it.
                </DialogDescription>
              </DialogHeader>

              <Field className="mt-4">
                <FieldLabel htmlFor="keyName">Key name</FieldLabel>
                <Input
                  id="keyName"
                  name="name"
                  placeholder="e.g. Production, Mobile App, Webhook"
                  minLength={3}
                  maxLength={50}
                  required
                />
              </Field>

              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose>
                  <Button type="submit" disabled={processing}>
                    Generate
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  )
}
