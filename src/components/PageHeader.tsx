import type { ReactNode } from 'react'
import { LanguageToggle } from '@/components/LanguageToggle'
import { ThemeToggle } from '@/components/ThemeToggle'

interface PageHeaderProps {
  title: string | ReactNode
  subtitle?: string | ReactNode
  actions?: ReactNode
  children?: ReactNode
}

export function PageHeader({ title, subtitle, actions, children }: PageHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-primary-200 shadow-lg sticky top-0 z-10 dark:bg-gray-900/80 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            {typeof title === 'string' ? (
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-secondary-400">
                {title}
              </h1>
            ) : (
              title
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            {actions}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
