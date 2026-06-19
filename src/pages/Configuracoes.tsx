import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Configuracoes() {
  const { user, signOut } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-sm font-medium text-slate-500">Usuário Logado</span>
            <p className="text-slate-900 dark:text-white">{user?.email}</p>
          </div>

          <div className="pt-4 border-t">
            <Button variant="destructive" onClick={signOut}>Sair da Conta</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
