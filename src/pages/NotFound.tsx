import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-9xl font-extrabold text-slate-200 dark:text-slate-800 tracking-tight">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Página não encontrada
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Desculpe, não conseguimos encontrar a página que você está procurando.
            Pode ter sido movida ou não existe mais.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Ir para Início
          </Button>
        </div>
      </div>
    </div>
  );
}
