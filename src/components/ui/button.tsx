import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-primary-400 dark:ring-offset-gray-900',
  {
    variants: {
      variant: {
        default:
          'bg-primary-600 text-white hover:bg-primary-700 active:scale-95 shadow-sm hover:shadow-md dark:bg-primary-500 dark:hover:bg-primary-600',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-sm dark:bg-red-500 dark:hover:bg-red-600',
        outline:
          'border-2 border-primary-300 bg-transparent hover:bg-primary-50 text-primary-700 dark:border-primary-600 dark:text-primary-400 dark:hover:bg-primary-950',
        secondary:
          'bg-secondary-600 text-white hover:bg-secondary-700 active:scale-95 shadow-sm dark:bg-secondary-500 dark:hover:bg-secondary-600',
        accent:
          'bg-accent-500 text-white hover:bg-accent-600 active:scale-95 shadow-sm dark:bg-accent-600 dark:hover:bg-accent-700',
        ghost:
          'hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-950 dark:hover:text-primary-300',
        link: 'text-primary-600 underline-offset-4 hover:underline dark:text-primary-400',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
