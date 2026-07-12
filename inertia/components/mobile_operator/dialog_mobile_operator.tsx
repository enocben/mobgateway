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
import { getCountryData, getCountryDataList, TCountryCode } from 'countries-list'
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

export function DialogMobileOperator({}: Props) {
  const applicationId = useApplicationStore((a) => a.applicationId)

  const countries = useMemo(
    () => getCountryDataList().filter((c) => c.continent === 'AF'),
    []
  )

  const [open, setOpen] = useState(false)
  const [countryCode, setCountryCode] = useState<TCountryCode | ''>('')
  const [name, setName] = useState('')
  const [prefixes, setPrefixes] = useState<string[]>([''])

  const addPrefix = () => {
    setPrefixes((prev) => [...prev, ''])
  }

  const removePrefix = (index: number) => {
    setPrefixes((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
  }

  const updatePrefix = (index: number, value: string) => {
    setPrefixes((prev) =>
      prev.map((prefix, i) => (i === index ? value : prefix))
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Operator</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <Form
          route="admin.mobile-operators.store"
          routeParams={{ id: applicationId! }}
          onSubmit={() => setOpen(false)}
        >
          <DialogHeader>
            <DialogTitle>Add Mobile Operator</DialogTitle>
            <DialogDescription>
              Register a new mobile network operator for the current application.
            </DialogDescription>
          </DialogHeader>

          <Field className="mb-2">
            <FieldLabel htmlFor="name">Operator Name</FieldLabel>

            <Input
              id="name"
              name="name"
              placeholder="Airtel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>

          <Field className="mb-2">
            <FieldLabel htmlFor="logoUrl">Logo URL</FieldLabel>

            <Input
              id="logoUrl"
              name="logoUrl"
              placeholder="https://..."
            />
          </Field>

          <Field className="mb-2">
            <FieldLabel>Country</FieldLabel>

            <Select
              value={countryCode}
              onValueChange={(value) => {
                setCountryCode(value as TCountryCode)

                const country = getCountryData(value as TCountryCode)

                if (!country) return

                setName((current) => {
                  const baseName = current.replace(/\s*\([^)]+\)$/, '')
                  return `${baseName} (${country.iso3})`
                })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Country</SelectLabel>

                  {countries.map((country) => (
                    <SelectItem
                      key={country.iso2}
                      value={country.iso2}
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <input
              type="hidden"
              name="countryCode"
              value={countryCode}
            />
          </Field>

          <Field>
            <FieldLabel>Prefixes</FieldLabel>

            {prefixes.map((prefix, index) => (
              <div
                key={index}
                className="mb-2 flex items-center gap-2"
              >
                <Input
                  name="prefixes[]"
                  placeholder="+243 or 243"
                  value={prefix}
                  onChange={(e) =>
                    updatePrefix(index, e.target.value)
                  }
                  className="flex-1"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePrefix(index)}
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
            >
              <Plus className="mr-1 size-3" />
              Add prefix
            </Button>
          </Field>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button type="submit">
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
