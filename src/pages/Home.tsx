import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { LanguageToggle } from '@/components/LanguageToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [step, setStep] = useState<1 | 2>(1)
  const [roomCode, setRoomCode] = useState('')
  const [userName, setUserName] = useState('')

  // Load saved name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('userName')
    if (savedName) {
      setUserName(savedName)
    }
  }, [])

  const handleContinueToName = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomCode.trim()) {
      setStep(2)
    }
  }

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomCode.trim()) {
      // Save name for future visits
      if (userName.trim()) {
        localStorage.setItem('userName', userName.trim())
      }
      navigate(`/room/${roomCode.trim().toUpperCase()}`)
    }
  }

  const handleCreateRoom = () => {
    navigate('/create')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative transition-all duration-500 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Theme and Language Toggle */}
      <div className="absolute top-4 right-4 flex gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Logo/Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-8 w-8 text-accent-300 animate-pulse" />
          <h1 className="text-5xl font-extrabold text-white tracking-tight">{t('home.title')}</h1>
        </div>
        <p className="text-white/80 text-lg">{t('home.subtitle')}</p>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-2 border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-secondary-400">
            {step === 1 ? t('home.joinRoom') : t('home.tellUsYourName')}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1 ? t('home.enterRoomCode') : t('home.nameHelpsIdentify')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleContinueToName} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomCode">{t('home.roomCode')}</Label>
                <Input
                  id="roomCode"
                  placeholder={t('home.roomCodePlaceholder')}
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="text-center text-xl font-mono uppercase"
                  maxLength={7}
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={!roomCode.trim()}>
                {t('common.continue')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName">{t('home.yourName')}</Label>
                <Input
                  id="userName"
                  placeholder={t('home.yourNamePlaceholder')}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="text-lg"
                  maxLength={50}
                  autoFocus
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('home.localStorageNotice')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  {t('common.back')}
                </Button>
                <Button type="submit" className="flex-1" size="lg">
                  {t('home.joinRoomButton')}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Create Room Link */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleCreateRoom}
          className="text-white/80 hover:text-white text-sm underline underline-offset-4 transition-colors"
        >
          {t('home.createRoomLink')}
        </button>
      </div>
    </div>
  )
}
