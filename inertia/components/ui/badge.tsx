import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'

const badgeVariants = cva(
  'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default:
          'bg-primary/15 text-primary border-primary/25 [a]:hover:bg-primary/25',
        secondary:
          'bg-muted/60 text-muted-foreground border-border/60 [a]:hover:bg-muted/80',
        destructive:
          'bg-destructive/12 text-destructive border-destructive/25 focus-visible:ring-destructive/20 dark:bg-destructive/18 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20',
        outline:
          'border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground',
        success:
          'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
        warning:
          'bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/25',
        info:
          'bg-sky-500/12 text-sky-600 dark:text-sky-400 border-sky-500/25',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
