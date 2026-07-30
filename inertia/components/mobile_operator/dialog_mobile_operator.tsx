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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Edit3Icon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Form } from '@adonisjs/inertia/react'
import { useApplicationStore } from '~/context/application_context'
import { Input } from '~/components/ui/input'
import { Field, FieldLabel } from '~/components/ui/field'
import { Plus, X } from 'lucide-react'
import type { Data } from '@generated/data'
import type Country from '#models/country'

type Props = {
  operator?: Data.MobileOperator
  countries: Country[]
}

export function DialogMobileOperator({ operator, countries }: Props) {
  const applicationId = useApplicationStore((a) => a.applicationId)

  const isUpdate = !!operator

  const [open, setOpen] = useState(false)

  const [countryCode, setCountryCode] = useState('')
  const [name, setName] = useState('')
  const [prefixes, setPrefixes] = useState<string[]>([''])

  useEffect(() => {
    if (!open) return

    setName(operator?.name ?? '')
    setCountryCode(operator?.country?.code ?? '')
    const length = operator?.prefixes?.length ?? 0

    setPrefixes(length > 0 ? operator!.prefixes.map((p) => p.prefix) : [''])
  }, [open, operator])

  const addPrefix = () => {
    setPrefixes((pref) => [...pref, ''])
  }

  const removePrefix = (index: number) => {
    setPrefixes((prev) => {
      if (prev.length === 1) return prev
      return prev.filter((_, i) => i !== index)
    })
  }

  const updatePrefix = (index: number, value: string) => {
    setPrefixes((prev) => prev.map((p, i) => (i === index ? value : p)))
  }

  const handleCountryChange = (code: string) => {
    setCountryCode(code)
    const selected = countries.find((c) => c.code === code)
    if (selected) {
      setName((current) => {
        const base = current.replace(/\s*\([^)]+\)$/, '')
        return `${base} (${selected.code.toUpperCase()})`
      })
    }
  }

  const hasCountries = countries.length > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isUpdate ? (
          <Button variant="ghost" size="icon">
            <Edit3Icon className="size-4" />
          </Button>
        ) : (
          <Button>Add Operator</Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <Form
          route={
            isUpdate ? 'admin.mobile-operators.update' : 'admin.mobile-operators.store'
          }
          routeParams={
            isUpdate
              ? {
                  id: applicationId!,
                  operatorId: operator.id,
                }
              : {
                  id: applicationId!,
                }
          }
          onSubmit={() => setOpen(false)}
        >
          {({ processing }) => (
            <>
              <DialogHeader>
                <DialogTitle>
                  {isUpdate ? 'Update Mobile Operator' : 'Create Mobile Operator'}
                </DialogTitle>

                <DialogDescription>
                  {isUpdate
                    ? 'Update the information of this mobile network operator.'
                    : 'Create a new mobile network operator for this application.'}
                </DialogDescription>
              </DialogHeader>

              <Field className="mb-3">
                <FieldLabel htmlFor="name">Operator name</FieldLabel>

                <Input
                  id="name"
                  name="name"
                  placeholder="Airtel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>

              <Field className="mb-3">
                <FieldLabel htmlFor="logoUrl">Logo URL</FieldLabel>

                <Input
                  id="logoUrl"
                  name="logoUrl"
                  defaultValue={operator?.logoUrl as string | undefined}
                  placeholder="https://example.com/logo.png"
                />
              </Field>

              <Field className="mb-3">
                <FieldLabel>Country</FieldLabel>

                {!hasCountries ? (
                  <p className="text-sm text-muted-foreground py-2">
                    No countries added yet. Add countries first in the Countries section.
                  </p>
                ) : (
                  <Select value={countryCode} onValueChange={handleCountryChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Application countries</SelectLabel>

                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name} ({country.code.toUpperCase()})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}

                <input type="hidden" name="countryCode" value={countryCode} />
              </Field>

              <Field>
                <FieldLabel>Phone prefixes</FieldLabel>

                {prefixes.map((prefix, index) => (
                  <div key={index} className="mb-2 flex gap-2">
                    <Input
                      className="flex-1"
                      name="prefixes[]"
                      value={prefix}
                      placeholder="9"
                      onChange={(e) => updatePrefix(index, e.target.value)}
                    />

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={prefixes.length === 1}
                      onClick={() => removePrefix(index)}
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
                  <Plus className="mr-2 size-3" />
                  Add prefix
                </Button>
              </Field>

              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>

                <DialogClose disabled={processing}>
                  <Button disabled={processing || !hasCountries} type="submit">
                    {isUpdate ? 'Update operator' : 'Create operator'}
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
