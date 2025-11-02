import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface AdminEmailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminEmailModal({ open, onOpenChange }: AdminEmailModalProps) {
  const { t } = useTranslation()
  const { sendMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError(t('adminEmail.errorEmailRequired'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Send magic link to access admin rooms
      await sendMagicLink(email.trim())
      setSent(true)
      setLoading(false)
    } catch (err) {
      console.error('Error sending magic link:', err)
      setError(t('adminEmail.errorSending'))
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false)
      // Reset state after close animation
      setTimeout(() => {
        setSent(false)
        setEmail('')
        setError(null)
      }, 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('adminEmail.title')}</DialogTitle>
          <DialogDescription>{t('adminEmail.description')}</DialogDescription>
        </DialogHeader>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('adminEmail.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('adminEmail.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={loading || !email.trim()} className="flex-1 gap-2">
                {loading ? (
                  t('adminEmail.sending')
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    {t('adminEmail.sendLink')}
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg dark:bg-green-900/20 dark:border-green-800">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5 dark:text-green-400" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                    {t('adminEmail.successTitle')}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {t('adminEmail.successMessage', { email })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>{t('adminEmail.nextSteps')}</strong>
              </p>
              <ol className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                <li>{t('adminEmail.step1')}</li>
                <li>{t('adminEmail.step2')}</li>
                <li>{t('adminEmail.step3')}</li>
              </ol>
            </div>

            <Button onClick={handleClose} className="w-full">
              {t('common.close')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
