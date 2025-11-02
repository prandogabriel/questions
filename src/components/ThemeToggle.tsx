import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from './ui/button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  const handleToggle = () => {
    console.log('ThemeToggle clicked! Current theme:', theme)
    toggleTheme()
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="rounded-full bg-white/20 hover:bg-white/30 dark:bg-gray-800/50 dark:hover:bg-gray-800/70 backdrop-blur-sm"
      aria-label="Toggle theme"
      title={`Current: ${theme}. Click to toggle`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-white" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-300" />
      )}
    </Button>
  )
}
