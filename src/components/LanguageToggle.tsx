import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function LanguageToggle() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const getCurrentLanguage = () => {
    return i18n.language === 'pt' || i18n.language === 'pt-BR' ? 'PT' : 'EN'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/20 hover:bg-white/30 dark:bg-gray-800/50 dark:hover:bg-gray-800/70 backdrop-blur-sm"
        >
          <Languages className="h-5 w-5 text-white" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage('en')}
          className="cursor-pointer"
        >
          <span className="font-medium">🇺🇸 English</span>
          {getCurrentLanguage() === 'EN' && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage('pt')}
          className="cursor-pointer"
        >
          <span className="font-medium">🇧🇷 Português</span>
          {getCurrentLanguage() === 'PT' && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
