import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { sileo as toast } from '../components/ui/toast/toaster';

export default function Pacientes() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState('');
  const [pacienteParaExcluir, setPacienteParaExcluir] = useState<any>(null);

  const { data: pacientes, isLoading } = useQuery({
    queryKey: ['pacientes'],
    queryFn: api.getPacientes,
  });

  const pacientesFiltrados = pacientes?.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));

  const deleteMutation = useMutation({
    mutationFn: api.excluirPaciente,
    onSuccess: () => {
      toast.success('Paciente excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      setPacienteParaExcluir(null);
    },
    onError: () => {
      toast.error('Erro ao excluir paciente. Ele pode ter lembretes vinculados.');
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar paciente por nome, CPF..."
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <Link to="/pacientes/novo">
          <Button>Adicionar Paciente</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando pacientes...</div>
          ) : pacientesFiltrados?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Nenhum paciente encontrado.</div>
          ) : (
            <div className="divide-y">
              {pacientesFiltrados?.map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <Link to={`/pacientes/${p.id}`} className="block focus:outline-none">
                      <h4 className="text-base font-medium text-foreground hover:underline">{p.nome}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                        {p.telefone && <span>{p.telefone}</span>}
                        {p.convenio && (
                          <>
                            <span>•</span>
                            <span>{p.convenio}</span>
                          </>
                        )}
                      </div>
                    </Link>
                  </div>
                  <div className="ml-4 shrink-0 flex items-center gap-3">
                    <Badge variant={p.ativo ? 'success' : 'secondary'}>
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPacienteParaExcluir(p);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={!!pacienteParaExcluir}
        onClose={() => setPacienteParaExcluir(null)}
        onConfirm={() => deleteMutation.mutate(pacienteParaExcluir.id)}
        title="Excluir Paciente"
        description={`Tem certeza que deseja excluir o paciente ${pacienteParaExcluir?.nome}? Esta ação não poderá ser desfeita.`}
        confirmText={deleteMutation.isPending ? 'Excluindo...' : 'Sim, excluir paciente'}
        type="danger"
      />
    </div>
  );
}
