import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { CheckSquare, Clock, AlertCircle, CheckCircle2, Plus, Calendar as CalendarIcon, UserPlus } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { format, parseISO, isPast, isToday, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { sileo as toast } from '../components/ui/toast/toaster';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [abaAtiva, setAbaAtiva] = useState<'hoje' | 'proximos' | 'aguardando'>('hoje');

  const { data: resumo, isLoading: loadResumo } = useQuery({
    queryKey: ['resumo'],
    queryFn: api.getResumo,
  });

  const { data: lembretes, isLoading: loadLembretes } = useQuery({
    queryKey: ['lembretes_dashboard'],
    queryFn: api.getLembretesDashboard,
  });

  const concluirMutation = useMutation({
    mutationFn: api.concluirLembrete,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['lembretes_dashboard'] });
      
      const previousLembretes = queryClient.getQueryData(['lembretes_dashboard']);
      
      queryClient.setQueryData(['lembretes_dashboard'], (old: any) => {
        if (!old) return old;
        return old.map((l: any) => l.id === id ? { ...l, status: 'concluído', concluido_em: new Date().toISOString() } : l);
      });

      return { previousLembretes };
    },
    onError: (_err, _id, context) => {
      if (context?.previousLembretes) {
        queryClient.setQueryData(['lembretes_dashboard'], context.previousLembretes);
      }
      toast.error('Erro ao concluir tarefa. Tentando novamente...');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['resumo'] });
      queryClient.invalidateQueries({ queryKey: ['lembretes_dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['lembretes'] });
    },
    onSuccess: () => {
      toast.success('Tarefa concluída! Bom trabalho!');
    }
  });

  // Filtros de Data
  const hojeDate = new Date();
  const hojeString = hojeDate.toISOString().split('T')[0];
  const seteDiasFrente = addDays(hojeDate, 7).toISOString().split('T')[0];

  const tarefasAtivas = lembretes?.filter(l => l.status !== 'concluído') || [];
  const concluidasHojeList = lembretes?.filter(l => l.status === 'concluído') || [];

  // Abas
  const hojeList = tarefasAtivas.filter(l => {
    const dataVencimento = parseISO(l.data_vencimento);
    return isToday(dataVencimento) || (isPast(dataVencimento) && !isToday(dataVencimento));
  });

  const proximosList = tarefasAtivas.filter(l => {
    return l.data_vencimento > hojeString && l.data_vencimento <= seteDiasFrente && l.status !== 'aguardando retorno';
  });

  const aguardandoList = tarefasAtivas.filter(l => l.status === 'aguardando retorno');

  const listaAtual = abaAtiva === 'hoje' ? hojeList : abaAtiva === 'proximos' ? proximosList : aguardandoList;

  // Gráficos Data
  const chartData = [
    { name: 'Concluídas', value: resumo?.concluidasHoje || 0, color: '#10B981' }, // Emerald
    { name: 'Pendentes', value: resumo?.pendentes || 0, color: '#F59E0B' }, // Amber
    { name: 'Aguardando', value: resumo?.aguardandoRetorno || 0, color: '#3B82F6' }, // Blue
    { name: 'Atrasadas/Hoje', value: resumo?.vencidasHoje || 0, color: '#EF4444' } // Red
  ].filter(d => d.value > 0);

  if (loadResumo || loadLembretes) {
    return <div className="text-sm text-muted-foreground p-8 text-center animate-pulse">Carregando sua central de comando...</div>;
  }

  return (
    <PageWrapper>
      <div className="space-y-8">
        
        {/* Cabeçalho e Ações Rápidas */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-lg dark:bg-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Olá! Bom trabalho hoje.</h1>
            <p className="text-slate-300 mt-1 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {format(hojeDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/lembretes/novo">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
              </Button>
            </Link>
            <Link to="/pacientes/novo">
              <Button variant="outline" className="bg-transparent border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white">
                <UserPlus className="mr-2 h-4 w-4" /> Paciente
              </Button>
            </Link>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="border-t-4 border-t-slate-500 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <CheckSquare className="h-4 w-4 text-slate-400" />
              </div>
              <div className="text-3xl font-bold">{resumo?.pendentes || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-red-500 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Vencidas/Hoje</p>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{resumo?.vencidasHoje || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Concluídas Hoje</p>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{resumo?.concluidasHoje || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-amber-500 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Aguardando</p>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{resumo?.aguardandoRetorno || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Área Principal Dividida */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          
          {/* Coluna Principal: Fluxo de Trabalho */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex border-b border-border">
              <button 
                className={`pb-3 px-4 font-medium text-sm transition-all relative ${abaAtiva === 'hoje' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setAbaAtiva('hoje')}
              >
                Hoje / Atrasadas
                {hojeList.length > 0 && <span className="ml-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 py-0.5 px-2 rounded-full text-xs">{hojeList.length}</span>}
                {abaAtiva === 'hoje' && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
              </button>
              <button 
                className={`pb-3 px-4 font-medium text-sm transition-all relative ${abaAtiva === 'proximos' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setAbaAtiva('proximos')}
              >
                Próximos 7 Dias
                {abaAtiva === 'proximos' && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
              </button>
              <button 
                className={`pb-3 px-4 font-medium text-sm transition-all relative ${abaAtiva === 'aguardando' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setAbaAtiva('aguardando')}
              >
                Aguardando Retorno
                {aguardandoList.length > 0 && <span className="ml-2 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 py-0.5 px-2 rounded-full text-xs">{aguardandoList.length}</span>}
                {abaAtiva === 'aguardando' && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
              </button>
            </div>

            <Card className="border-0 shadow-sm bg-card/50">
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {listaAtual.length > 0 ? (
                    listaAtual.map(l => (
                      <div key={l.id} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <div className="flex-1 min-w-0">
                          <Link to={`/pendencias/${l.id}`} className="block focus:outline-none">
                            <h4 className="font-semibold text-foreground truncate group-hover:underline">{l.titulo}</h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
                              {l.pacientes?.nome && (
                                <span className="flex items-center gap-1"><UserPlus className="h-3 w-3"/> {l.pacientes.nome}</span>
                              )}
                              <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3"/> {format(parseISO(l.data_vencimento), "dd/MM/yyyy", { locale: ptBR })}</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                              {l.prioridade === 'alta' && <Badge variant="destructive" className="px-1.5 py-0 text-[10px]">Alta Prioridade</Badge>}
                              <Badge variant="outline" className="px-1.5 py-0 text-[10px]">{l.tipo}</Badge>
                            </div>
                          </Link>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full sm:w-auto border-emerald-200 text-emerald-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white transition-all shadow-sm"
                          onClick={() => concluirMutation.mutate(l.id)}
                          disabled={concluirMutation.isPending}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Concluir
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                      <CheckCircle2 className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
                      <p>Tudo limpo por aqui! Nenhuma tarefa nesta aba.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral: Resumo e Concluídas */}
          <div className="space-y-6">
            
            {/* Gráfico Visual */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Distribuição de Tarefas (Hoje)</CardTitle>
              </CardHeader>
              <CardContent className="h-[240px] w-full pt-0">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#1e293b' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                    Sem dados para o gráfico.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recompensa Visual: Tarefas Concluídas */}
            <Card className="shadow-sm bg-slate-50/50 dark:bg-slate-800/20 border-emerald-100 dark:border-emerald-900/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Dever Cumprido (Hoje)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {concluidasHojeList.length > 0 ? (
                    concluidasHojeList.slice(0, 5).map(l => (
                      <div key={l.id} className="flex items-center gap-3 opacity-70">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="text-sm text-foreground line-through truncate">{l.titulo}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Comece a concluir tarefas para vê-las aqui!
                    </p>
                  )}
                  {concluidasHojeList.length > 5 && (
                    <p className="text-xs text-center text-muted-foreground pt-2">
                      + {concluidasHojeList.length - 5} outras tarefas
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* ConfirmModal removido para check instantâneo */}
      </div>
    </PageWrapper>
  );
}
