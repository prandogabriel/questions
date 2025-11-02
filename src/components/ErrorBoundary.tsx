import { Component, type ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      const isFirebaseConfigError = this.state.error?.message.includes('Firebase configuration')

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">
                {isFirebaseConfigError ? '🔧 Configuração Necessária' : '❌ Erro'}
              </CardTitle>
              <CardDescription>
                {isFirebaseConfigError
                  ? 'O Firebase ainda não foi configurado'
                  : 'Ocorreu um erro ao inicializar a aplicação'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isFirebaseConfigError ? (
                <>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                    <p className="text-sm text-yellow-800 font-semibold mb-2">
                      Para usar este aplicativo, você precisa:
                    </p>
                    <ol className="list-decimal list-inside text-sm text-yellow-800 space-y-1">
                      <li>Criar um projeto no Firebase Console</li>
                      <li>Configurar Firestore Database</li>
                      <li>Ativar Authentication (modo Anônimo)</li>
                      <li>Copiar as credenciais e adicionar no arquivo .env</li>
                    </ol>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                    <p className="text-sm font-mono text-gray-700">
                      <strong>Variáveis necessárias no .env:</strong>
                    </p>
                    <pre className="text-xs mt-2 text-gray-600">
                      {`VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...`}
                    </pre>
                  </div>

                  <p className="text-sm text-gray-600">
                    📖 Consulte o arquivo{' '}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">README.md</code> para
                    instruções detalhadas de configuração.
                  </p>
                </>
              ) : (
                <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                  <p className="text-sm text-red-800 font-mono">{this.state.error?.message}</p>
                </div>
              )}

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Recarregar Página
              </button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
