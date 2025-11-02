import { Component, type ReactNode } from 'react'
import { type WithTranslation, withTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface Props extends WithTranslation {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      const { t } = this.props
      const isFirebaseConfigError = this.state.error?.message.includes('Firebase configuration')

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">
                {isFirebaseConfigError
                  ? t('errorBoundary.configRequired')
                  : t('errorBoundary.error')}
              </CardTitle>
              <CardDescription>
                {isFirebaseConfigError
                  ? t('errorBoundary.firebaseNotConfigured')
                  : t('errorBoundary.appInitError')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isFirebaseConfigError ? (
                <>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md dark:bg-yellow-900/20 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 font-semibold mb-2 dark:text-yellow-200">
                      {t('errorBoundary.toUseApp')}
                    </p>
                    <ol className="list-decimal list-inside text-sm text-yellow-800 space-y-1 dark:text-yellow-200">
                      <li>{t('errorBoundary.step1')}</li>
                      <li>{t('errorBoundary.step2')}</li>
                      <li>{t('errorBoundary.step3')}</li>
                      <li>{t('errorBoundary.step4')}</li>
                    </ol>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-md dark:bg-gray-800 dark:border-gray-700">
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      <strong>{t('errorBoundary.requiredVars')}</strong>
                    </p>
                    <pre className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                      {`VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...`}
                    </pre>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('errorBoundary.checkReadme').split('README.md')[0]}
                    <code className="bg-gray-100 px-1 py-0.5 rounded dark:bg-gray-800">
                      README.md
                    </code>
                    {t('errorBoundary.checkReadme').split('README.md')[1]}
                  </p>
                </>
              ) : (
                <div className="bg-red-50 border border-red-200 p-4 rounded-md dark:bg-red-900/20 dark:border-red-800">
                  <p className="text-sm text-red-800 font-mono dark:text-red-400">
                    {this.state.error?.message}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {t('errorBoundary.reloadPage')}
              </button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryComponent)
