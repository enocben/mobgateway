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
import {Data} from "@generated/data";

type Props = {
  currentCountries: Data.Country[]
}

export function DialogCountry({ currentCountries }: Props) {
  const applicationId = useApplicationStore((a) => a.applicationId)
  const countries = useMemo(() => getCountryDataList().filter((c) => c.continent === 'AF'), [])
  const currentCodes = useMemo(() => currentCountries.map((c) => c.code), [])
  const [country, setCountry] = useState<string | undefined>('')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Country</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Select onValueChange={setCountry}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Country</SelectLabel>
              {countries.map((c) => (
                <SelectItem key={c.iso2} value={c.iso2} disabled={currentCodes.includes(c.iso2)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Form route="admin.countries.create" routeParams={{ id: applicationId!, iso2: country! }}>
            <DialogClose>
              <Button type="submit">Add Country</Button>
            </DialogClose>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
