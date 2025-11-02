import { signOut } from 'firebase/auth'
import { LogOut, Plus, User, Users } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { auth } from '@/lib/firebase'
import { AdminEmailModal } from './AdminEmailModal'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function UserMenu() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showEmailModal, setShowEmailModal] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // If not authenticated or anonymous, show login button
  if (!user || user.isAnonymous) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowEmailModal(true)}
          className="rounded-full"
        >
          <User className="h-5 w-5" />
        </Button>
        <AdminEmailModal open={showEmailModal} onOpenChange={setShowEmailModal} />
      </>
    )
  }

  // If authenticated, show dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{t('userMenu.admin')}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/')}>
          <Users className="mr-2 h-4 w-4" />
          <span>{t('userMenu.myRooms')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/create')}>
          <Plus className="mr-2 h-4 w-4" />
          <span>{t('userMenu.createRoom')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('userMenu.signOut')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
