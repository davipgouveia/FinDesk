import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CheckCircle2, Search, Plus, Filter, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ConfirmModal } from '../components/ui/ConfirmModal';

export default function Pendencias() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [prioridadeFiltro, setPrioridadeFiltro] = useState('');
  const [lembreteAConfirmar, setLembreteAConfirmar] = useState<string | null>(null);
  const [lembreteAExcluir, setLembreteAExcluir] = useState<any>(null);

  const { data: lembretes, isLoading } = useQuery({
    queryKey: ['lembretes', statusFiltro, prioridadeFiltro, busca],
    queryFn: () => api.getLembretes({ 
      status: statusFiltro || undefined, 
      prioridade: prioridadeFiltro || undefined, 
      busca: busca || undefined 
    }),
  });

  const concluirMutation = useMutation({
    mutationFn: api.concluirLembrete,
    onSuccess: () => {
      toast.success('Tarefa concluída!');
      setLembreteAConfirmar(null);
      queryClient.invalidateQueries({ queryKey: ['lembretes'] });
      queryClient.invalidateQueries({ queryKey: ['resumo'] });
      queryClient.invalidateQueries({ queryKey: ['lembretes_dashboard'] });
    },
    onError: () => {
      toast.error('Erro ao concluir tarefa.');
      setLembreteAConfirmar(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: api.excluirLembrete,
    onSuccess: () => {
      toast.success('Tarefa excluída permanentemente!');
      setLembreteAExcluir(null);
      queryClient.invalidateQueries({ queryKey: ['lembretes'] });
      queryClient.invalidateQueries({ queryKey: ['resumo'] });
      queryClient.invalidateQueries({ queryKey: ['lembretes_dashboard'] });
    },
    onError: () => {
      toast.error('Erro ao excluir tarefa.');
      setLembreteAExcluir(null);
    }
  });

  return (
    <PageWrapper>
      <div className="space-y-6">
      {/* Barra de Ações e Filtros */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar título..."
              className="pl-9"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <select 
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            <option value="">Status (Todos abertos)</option>
            <option value="pendente">Pendente</option>
            <option value="em andamento">Em andamento</option>
            <option value="aguardando retorno">Aguardando retorno</option>
          </select>
          <select 
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={prioridadeFiltro}
            onChange={(e) => setPrioridadeFiltro(e.target.value)}
          >
            <option value="">Prioridade (Todas)</option>
            <option value="alta">Alta</option>
            <option value="média">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>
        <Link to="/lembretes/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
        </Link>
      </div>

      {/* Lista */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando pendências...</div>
          ) : lembretes?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Nenhuma pendência encontrada.</div>
          ) : (
            <div className="divide-y">
              {lembretes?.map(l => (
                <div key={l.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex-1 min-w-0 mb-4 md:mb-0">
                    <Link to={`/pendencias/${l.id}`} className="block focus:outline-none">
                      <h4 className="text-base font-medium text-foreground truncate hover:underline">{l.titulo}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{l.pacientes?.nome}</span>
                        <span>•</span>
                        <span>Vence: {format(parseISO(l.data_vencimento), "dd/MM/yyyy", { locale: ptBR })}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={l.prioridade === 'alta' ? 'destructive' : 'secondary'}>
                          {l.prioridade}
                        </Badge>
                        <Badge variant="outline">{l.tipo}</Badge>
                        <Badge variant={l.status === 'aguardando retorno' ? 'warning' : 'default'}>
                          {l.status}
                        </Badge>
                      </div>
                    </Link>
                  </div>
                  <div className="ml-0 md:ml-4 shrink-0 w-full md:w-auto flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 md:flex-none border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/30 transition-all"
                      onClick={() => setLembreteAConfirmar(l.id)}
                      disabled={concluirMutation.isPending}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Check
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setLembreteAExcluir(l)}
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
        isOpen={!!lembreteAConfirmar}
        onClose={() => setLembreteAConfirmar(null)}
        onConfirm={() => lembreteAConfirmar && concluirMutation.mutate(lembreteAConfirmar)}
        title="Concluir Tarefa?"
        description="Esta tarefa será movida para o histórico. Tem certeza?"
        confirmText="Concluir"
        type="success"
        isLoading={concluirMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!lembreteAExcluir}
        onClose={() => setLembreteAExcluir(null)}
        onConfirm={() => lembreteAExcluir && deleteMutation.mutate(lembreteAExcluir.id)}
        title="Excluir Tarefa"
        description={`Tem certeza que deseja excluir "${lembreteAExcluir?.titulo}"? Esta ação não poderá ser desfeita.`}
        confirmText={deleteMutation.isPending ? 'Excluindo...' : 'Sim, excluir'}
        type="danger"
      />
    </div>
    </PageWrapper>
  );
}
