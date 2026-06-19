import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
          <div className="space-y-6 max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex justify-center">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Ops! Algo deu errado.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Ocorreu um erro inesperado na aplicação. Nossa equipe já foi notificada.
              </p>
            </div>
            {this.state.error && (
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-left overflow-auto max-h-32">
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="pt-4">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Recarregar página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
