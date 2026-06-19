import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageWrapper } from '../components/layout/PageWrapper';
import { FileText, TrendingUp, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { exportToPDF } from '../lib/exportToPDF';
import { format, parseISO } from 'date-fns';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { toast } from 'sonner';

export default function Relatorios() {
  const queryClient = useQueryClient();
  const [lembreteAExcluir, setLembreteAExcluir] = useState<any>(null);

  const { data: lembretes, isLoading } = useQuery({
    queryKey: ['relatorios_lembretes'],
    queryFn: api.getRelatorioLembretes,
  });

  const stats = useMemo(() => {
    if (!lembretes) return null;
    const concluidos = lembretes.filter(l => l.status === 'concluído').length;
    const pendentes = lembretes.filter(l => l.status === 'pendente' || l.status === 'em andamento').length;
    const cancelados = lembretes.filter(l => l.status === 'cancelado').length;
    const aguardando = lembretes.filter(l => l.status === 'aguardando retorno').length;
    
    return { concluidos, pendentes, cancelados, aguardando, total: lembretes.length };
  }, [lembretes]);

  const handleExport = () => {
    if (!lembretes) return;
    exportToPDF(lembretes);
  };

  const deleteMutation = useMutation({
    mutationFn: api.excluirLembrete,
    onSuccess: () => {
      toast.success('Tarefa excluída permanentemente!');
      setLembreteAExcluir(null);
      queryClient.invalidateQueries({ queryKey: ['relatorios_lembretes'] });
      queryClient.invalidateQueries({ queryKey: ['lembretes'] });
      queryClient.invalidateQueries({ queryKey: ['resumo'] });
    },
    onError: () => {
      toast.error('Erro ao excluir tarefa.');
      setLembreteAExcluir(null);
    }
  });

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Relatórios e Exportações</h2>
            <p className="text-sm text-muted-foreground">Visão geral do volume de tarefas e eficiência.</p>
          </div>
          <Button onClick={handleExport} disabled={!lembretes || lembretes.length === 0} className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
            <FileText className="mr-2 h-4 w-4" />
            Exportar em PDF
          </Button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Carregando dados do relatório...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total || 0}</div>
                <p className="text-xs text-muted-foreground">Cadastradas no sistema</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats?.concluidos || 0}</div>
                <p className="text-xs text-muted-foreground">Trabalho finalizado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats?.pendentes || 0}</div>
                <p className="text-xs text-muted-foreground">Na fila de trabalho</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aguardando Retorno</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.aguardando || 0}</div>
                <p className="text-xs text-muted-foreground">Depende de terceiros</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Amostra de Dados Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Data</th>
                    <th className="px-4 py-3 font-medium">Título</th>
                    <th className="px-4 py-3 font-medium">Paciente</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {lembretes?.slice(0, 10).map(l => (
                    <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 whitespace-nowrap">{format(parseISO(l.data_vencimento), "dd/MM/yyyy")}</td>
                      <td className="px-4 py-3 max-w-[200px] truncate">{l.titulo}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{l.pacientes?.nome || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap capitalize">{l.status}</td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setLembreteAExcluir(l)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {lembretes?.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Nenhum dado disponível.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {lembretes && lembretes.length > 10 && (
              <p className="text-xs text-center text-muted-foreground mt-4 pt-4 border-t">
                Mostrando os 10 registros mais recentes. Exporte para PDF para ver todos os {lembretes.length}.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmModal
        isOpen={!!lembreteAExcluir}
        onClose={() => setLembreteAExcluir(null)}
        onConfirm={() => lembreteAExcluir && deleteMutation.mutate(lembreteAExcluir.id)}
        title="Excluir Tarefa"
        description={`Tem certeza que deseja excluir "${lembreteAExcluir?.titulo}"? Esta ação não poderá ser desfeita.`}
        confirmText={deleteMutation.isPending ? 'Excluindo...' : 'Sim, excluir'}
        type="danger"
      />
    </PageWrapper>
  );
}
