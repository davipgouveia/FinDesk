import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'sonner';
import { ArrowLeft, Mail } from 'lucide-react';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });

    if (error) {
      toast.error('Erro ao enviar e-mail. Tente novamente mais tarde.');
    } else {
      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.', { duration: 5000 });
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground" onClick={() => navigate('/login')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o login
          </Button>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Esqueceu sua senha?
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Digite seu e-mail abaixo e enviaremos um link para você redefinir sua senha.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  E-mail cadastrado
                </label>
                <div className="mt-1 relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="voce@clinica.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar link de recuperação'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-indigo-900" />

        <div className="absolute inset-0 flex flex-col justify-center px-16 text-white z-10">
          <div className="mb-8">
            <img src="/logo-h-branca.png" alt="Findesk Logo" className="h-16 w-auto rounded-xl shadow-2xl" />
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">Alívio mental para a<br />gestão da sua clínica.</h1>
          <p className="text-lg text-emerald-100 max-w-md">Não se preocupe, recuperar o acesso é rápido e seguro.</p>
        </div>
      </div>
    </div>
  );
}
