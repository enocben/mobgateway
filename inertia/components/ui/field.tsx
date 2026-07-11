import * as React from 'react'

const Field = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`grid gap-1.5 ${className ?? ''}`} {...props} />
  )
)
Field.displayName = 'Field'

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className ?? ''}`}
    {...props}
  />
))
FieldLabel.displayName = 'FieldLabel'

export { Field, FieldLabel }
