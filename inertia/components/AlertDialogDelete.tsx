import React, { useEffect, useState } from 'react'
import { Trash2, Trash2Icon } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'

import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

type Props = {
  trigger?: React.ReactNode

  title: string
  description: React.ReactNode

  onConfirm?: () => void | Promise<void>

  confirmationText?: string
  confirmationLabel?: string

  confirmLabel?: string
  cancelLabel?: string

  loading?: boolean

  icon?: React.ReactNode
}

export function AlertDialogDelete({
  trigger = null,
  title,
  description,
  onConfirm,

  confirmationText,
  confirmationLabel,

  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',

  loading = false,

  icon,
}: Props) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (!open) {
      setValue('')
    }
  }, [open])

  const canConfirm = !confirmationText || value === confirmationText

  async function handleConfirm() {
    if (onConfirm) await onConfirm()
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger !== null ? (
          trigger
        ) : (
          <Button variant="destructive">
            <Trash2 className="size-4" />
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20">
            {icon ?? <Trash2Icon />}
          </AlertDialogMedia>

          <AlertDialogTitle>{title}</AlertDialogTitle>

          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {confirmationText && (
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              {confirmationLabel ?? (
                <>
                  Type <strong>{confirmationText}</strong> to confirm.
                </>
              )}
            </p>

            <Input
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={confirmationText}
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">{cancelLabel}</Button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              disabled={!canConfirm || loading}
              onClick={handleConfirm}
              type="submit"
            >
              {confirmLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
