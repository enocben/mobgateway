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
import { getCountryDataList } from 'countries-list'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useMemo, useState } from 'react'
import { Form } from '@adonisjs/inertia/react'
import { useApplicationStore } from '~/context/application_context'
import { Input } from '~/components/ui/input'
import { Field, FieldLabel } from '~/components/ui/field'
import { Plus, X } from 'lucide-react'
import { Data } from '@generated/data'

type Props = {
  currentOperators?: Data.MobileOperator[]
}

export function DialogMobileOperator({ currentOperators }: Props) {
  const applicationId = useApplicationStore((a) => a.applicationId)
  const countries = useMemo(
    () => getCountryDataList().filter((c) => c.continent === 'AF'),
    []
  )
  const [countryCode, setCountryCode] = useState('')
  const [prefixes, setPrefixes] = useState<string[]>([''])
  const [open, setOpen] = useState(false)

  const addPrefix = () => setPrefixes([...prefixes, ''])
  const removePrefix = (i: number) => {
    if (prefixes.length <= 1) return
    setPrefixes(prefixes.filter((_, idx) => idx !== i))
  }
  const updatePrefix = (i: number, val: string) => {
    setPrefixes(prefixes.map((p, idx) => (idx === i ? val : p)))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Operator</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Mobile Operator</DialogTitle>
          <DialogDescription>
            Register a new mobile network operator for the current application.
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor="name">Operator Name</FieldLabel>
          <Input id="name" name="name" placeholder="Airtel Money" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="logoUrl">Logo URL</FieldLabel>
          <Input id="logoUrl" name="logoUrl" placeholder="https://..." />
        </Field>

        <Select name="countryCode" onValueChange={setCountryCode} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Country</SelectLabel>
              {countries.map((c) => (
                <SelectItem key={c.iso2} value={c.iso2}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <input type="hidden" name="countryCode" value={countryCode} />

        <Field>
          <FieldLabel>Prefixes</FieldLabel>
          {prefixes.map((p, i) => (
            <div key={i} className="flex items-center gap-1">
              <Input
                name="prefixes[]"
                placeholder="+243 or 243"
                value={p}
                onChange={(e) => updatePrefix(i, e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removePrefix(i)}
                disabled={prefixes.length <= 1}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPrefix}
            className="mt-1"
          >
            <Plus className="size-3 mr-1" />
            Add prefix
          </Button>
        </Field>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Form
            route="admin.mobile-operators.store"
            routeParams={{ id: applicationId! }}
            onSubmit={() => setOpen(false)}
          >
            <Button type="submit">Save</Button>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
