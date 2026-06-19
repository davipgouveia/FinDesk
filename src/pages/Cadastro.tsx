import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'sonner';

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message || 'Erro ao fazer cadastro. Tente novamente.');
    } else {
      toast.success('Cadastro realizado com sucesso! Verifique seu e-mail ou faça login.');
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Crie sua conta
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Junte-se à plataforma e transforme a gestão da sua clínica.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSignUp} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  E-mail
                </label>
                <div className="mt-1">
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Senha
                </label>
                <div className="mt-1">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo de 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-11"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar minha conta'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-500">
                Faça login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-emerald-800" />
        <div className="absolute inset-0 flex flex-col justify-center px-16 text-white z-10">
          <div className="mb-8">
            <img src="/logo-h-branca.png" alt="Findesk Logo" className="h-16 w-auto rounded-xl shadow-2xl" />
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">A plataforma moderna<br />para a saúde.</h1>
          <p className="text-lg text-emerald-100 max-w-md">Gerencie pacientes, lembretes e relatórios num só lugar, com o máximo de eficiência.</p>
        </div>
      </div>
    </div>
  );
}
