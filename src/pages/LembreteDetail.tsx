import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { CheckCircle2, XCircle, Calendar, ArrowLeft, History } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { sileo as toast } from '../components/ui/toast/toaster';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ConfirmModal } from '../components/ui/ConfirmModal';

export default function LembreteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [novaData, setNovaData] = useState('');
  const [confirmarAcao, setConfirmarAcao] = useState<'concluir' | 'cancelar' | null>(null);

  const { data: lembrete, isLoading } = useQuery({
    queryKey: ['lembrete', id],
    queryFn: () => api.getLembreteById(id!),
    enabled: !!id,
  });

  const { data: historico } = useQuery({
    queryKey: ['historico', id],
    queryFn: () => api.getHistorico(id),
    enabled: !!id,
  });

  const concluirMutation = useMutation({
    mutationFn: api.concluirLembrete,
    onSuccess: () => {
      toast.success('Tarefa concluída com sucesso!');
      setConfirmarAcao(null);
      queryClient.invalidateQueries({ queryKey: ['lembrete', id] });
      queryClient.invalidateQueries({ queryKey: ['historico', id] });
    }
  });

  const cancelarMutation = useMutation({
    mutationFn: api.cancelarLembrete,
    onSuccess: () => {
      toast.success('Tarefa cancelada.');
      setConfirmarAcao(null);
      queryClient.invalidateQueries({ queryKey: ['lembrete', id] });
      queryClient.invalidateQueries({ queryKey: ['historico', id] });
    }
  });

  const reagendarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: string }) => api.reagendarLembrete(id, data),
    onSuccess: () => {
      toast.success('Tarefa reagendada!');
      setIsRescheduling(false);
      queryClient.invalidateQueries({ queryKey: ['lembrete', id] });
      queryClient.invalidateQueries({ queryKey: ['historico', id] });
    }
  });

  if (isLoading) return <div className="p-8 text-center">Carregando detalhes...</div>;
  if (!lembrete) return <div className="p-8 text-center text-red-500">Lembrete não encontrado.</div>;

  const podeConcluir = lembrete.status !== 'concluído' && lembrete.status !== 'cancelado';
  const podeCancelar = lembrete.status !== 'concluído' && lembrete.status !== 'cancelado';
  const podeReagendar = lembrete.status !== 'concluído' && lembrete.status !== 'cancelado';

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold flex-1">{lembrete.titulo}</h2>
          <Badge variant={lembrete.status === 'concluído' ? 'success' : lembrete.status === 'cancelado' ? 'destructive' : 'default'}>
            {lembrete.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Tarefa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 block">Paciente</span>
                    <span className="font-medium text-slate-900 dark:text-slate-50">{lembrete.pacientes?.nome || 'Nenhum'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Médico</span>
                    <span className="font-medium text-slate-900 dark:text-slate-50">{lembrete.medicos?.nome || 'Nenhum'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Vencimento</span>
                    <span className="font-medium text-slate-900 dark:text-slate-50">
                      {format(parseISO(lembrete.data_vencimento), "dd/MM/yyyy", { locale: ptBR })}
                      {lembrete.hora_vencimento && ` às ${lembrete.hora_vencimento.slice(0, 5)}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Prioridade</span>
                    <Badge variant={lembrete.prioridade === 'alta' ? 'destructive' : 'secondary'}>{lembrete.prioridade}</Badge>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-sm mb-1">Descrição</span>
                  <p className="text-slate-900 bg-slate-50 p-3 rounded-md text-sm whitespace-pre-wrap dark:bg-slate-800 dark:text-slate-50">
                    {lembrete.descricao || 'Nenhuma descrição fornecida.'}
                  </p>
                </div>

                {/* Ações */}
                <div className="pt-4 border-t flex flex-wrap gap-3">
                  {podeConcluir && (
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white"
                      onClick={() => setConfirmarAcao('concluir')}
                      disabled={concluirMutation.isPending}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Concluir Tarefa
                    </Button>
                  )}

                  {podeReagendar && (
                    <Button variant="outline" className="dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800 dark:hover:text-slate-50" onClick={() => setIsRescheduling(!isRescheduling)}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Reagendar
                    </Button>
                  )}

                  {podeCancelar && (
                    <Button
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-all dark:hover:bg-slate-800 dark:hover:text-slate-50"
                      onClick={() => setConfirmarAcao('cancelar')}
                      disabled={cancelarMutation.isPending}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancelar Tarefa
                    </Button>
                  )}
                </div>

                {/* Formulário inline de reagendamento */}
                {isRescheduling && (
                  <div className="p-4 rounded-md border mt-4 flex items-end gap-3">
                    <div className="flex-1 space-y-2">
                      <label className="text-sm font-medium dark:text-slate-50">Nova data de vencimento</label>
                      <Input
                        type="date"
                        value={novaData}
                        onChange={(e) => setNovaData(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                      />
                    </div>
                    <Button
                      onClick={() => reagendarMutation.mutate({ id: lembrete.id, data: novaData })}
                      disabled={!novaData || reagendarMutation.isPending}
                      className="dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                    >
                      Confirmar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral: Histórico */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Histórico
                </CardTitle>
              </CardHeader>
              <CardContent>
                {historico?.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-50">Nenhum histórico registrado.</p>
                ) : (
                  <div className="space-y-4">
                    {historico?.map(h => (
                      <div key={h.id} className="relative pl-4 border-l-2 border-slate-200 pb-4 last:pb-0">
                        <div className="absolute w-2 h-2 bg-slate-400 rounded-full -left-[5px] top-1.5" />
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{h.descricao}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {format(parseISO(h.data_acao), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </p>
                        <Badge variant="outline" className="mt-2 text-[10px]">{h.tipo_acao}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal de Concluir */}
        <ConfirmModal
          isOpen={confirmarAcao === 'concluir'}
          onClose={() => setConfirmarAcao(null)}
          onConfirm={() => concluirMutation.mutate(lembrete.id)}
          title="Concluir Tarefa?"
          description="Esta tarefa será movida para o histórico como concluída."
          confirmText="Concluir"
          type="success"
          isLoading={concluirMutation.isPending}
        />

        {/* Modal de Cancelar */}
        <ConfirmModal
          isOpen={confirmarAcao === 'cancelar'}
          onClose={() => setConfirmarAcao(null)}
          onConfirm={() => cancelarMutation.mutate(lembrete.id)}
          title="Cancelar Tarefa?"
          description="Tem certeza que deseja cancelar esta tarefa? Ela não aparecerá mais nos alertas."
          confirmText="Sim, Cancelar"
          type="danger"
          isLoading={cancelarMutation.isPending}
        />
      </div>
    </PageWrapper>
  );
}
