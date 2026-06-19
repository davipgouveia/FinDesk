import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { sileo as toast } from '../components/ui/toast/toaster';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    } else {
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Bem-vindo(a) de volta!
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Acesse sua central de comando.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  E-mail
                </label>
                <div className="mt-1">
                  <Input
                    id="email"
                    type="email"
                    placeholder="secretaria@clinica.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Senha
                  </label>
                  <Link to="/esqueci-senha" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="mt-1">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar na minha conta'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Ainda não tem conta?{' '}
              <Link to="/cadastro" className="font-semibold text-emerald-600 hover:text-emerald-500">
                Criar uma conta
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
