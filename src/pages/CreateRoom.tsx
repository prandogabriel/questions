import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { LanguageToggle } from '@/components/LanguageToggle'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UserMenu } from '@/components/UserMenu'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { createRoom } from '@/hooks/useRoom'

export default function CreateRoom() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()
  const [roomName, setRoomName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!roomName.trim()) {
      setError(t('createRoom.errorName'))
      return
    }

    if (!adminEmail.trim()) {
      setError(t('createRoom.errorEmail'))
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(adminEmail.trim())) {
      setError(t('createRoom.errorEmailInvalid'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const roomId = await createRoom(roomName.trim(), adminEmail.trim(), user?.uid)
      navigate(`/admin/${roomId}`)
    } catch (err) {
      console.error('Error creating room:', err)
      setError(t('createRoom.errorGeneric'))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative transition-colors duration-300">
      {/* Header with User Menu */}
      <div className="absolute top-4 right-4 flex gap-2">
        <UserMenu />
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-4">
            <Logo size="lg" className="drop-shadow-2xl" />
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{t('createRoom.title')}</h1>
              <p className="text-white/80">{t('createRoom.subtitle')}</p>
            </div>
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
          <CardHeader>
            <CardTitle className="text-2xl">{t('createRoom.newRoom')}</CardTitle>
            <CardDescription>{t('createRoom.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomName">{t('createRoom.roomName')}</Label>
                <Input
                  id="roomName"
                  placeholder={t('createRoom.roomNamePlaceholder')}
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  maxLength={100}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">{t('createRoom.adminEmail')}</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder={t('createRoom.adminEmailPlaceholder')}
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('createRoom.adminEmailHint')}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading || !roomName.trim() || !adminEmail.trim()}
                >
                  {loading ? t('createRoom.creating') : t('createRoom.createButton')}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  {t('common.back')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
