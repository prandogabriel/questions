import * as React from 'react'

import { cn } from '@/lib/utils'

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    // biome-ignore lint/a11y/noLabelWithoutControl: This is a reusable component that receives htmlFor when used
    <label
      ref={ref}
      className={cn(
        'text-sm font-semibold leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300',
        className
      )}
      {...props}
    />
  )
)
Label.displayName = 'Label'

export { Label }
