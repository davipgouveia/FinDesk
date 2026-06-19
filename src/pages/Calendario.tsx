import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '../components/ui/Button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';

export default function Calendario() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: lembretes, isLoading } = useQuery({
    queryKey: ['lembretes', 'todos'],
    queryFn: () => api.getLembretes({ status: 'todos' }),
  });

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Agrupar lembretes por data (apenas não concluídos/cancelados para o badge do calendário)
  const lembretesAtivos = lembretes?.filter(l => l.status !== 'concluído' && l.status !== 'cancelado') || [];
  
  const lembretesPorData = lembretesAtivos.reduce((acc: any, lembrete) => {
    const dataStr = lembrete.data_vencimento; // formato YYYY-MM-DD
    if (!acc[dataStr]) acc[dataStr] = [];
    acc[dataStr].push(lembrete);
    return acc;
  }, {});

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedLembretes = lembretesPorData[selectedDateStr] || [];

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Calendário Operacional</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          
          {/* Calendário Grid */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-semibold capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => {setCurrentMonth(new Date()); setSelectedDate(new Date())}} className="h-8">
                  Hoje
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dia, i) => (
                  <div key={i} className="text-xs font-medium text-muted-foreground py-1">
                    {dia}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-2">
                {/* Compensar dias vazios no início do mês */}
                {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-1 sm:p-2" />
                ))}
                
                {daysInMonth.map(date => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const count = lembretesPorData[dateStr]?.length || 0;
                  const isSelected = isSameDay(date, selectedDate);
                  const isHoje = isToday(date);
                  
                  return (
                    <button
                      key={date.toString()}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        min-h-[56px] sm:min-h-[80px] p-1 sm:p-2 rounded-lg sm:rounded-xl flex flex-col items-center justify-start gap-0.5 sm:gap-1 transition-all border
                        ${isSelected ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-card hover:bg-secondary border-border'}
                        ${!isSameMonth(date, currentMonth) ? 'opacity-40' : ''}
                      `}
                    >
                      <span className={`text-xs sm:text-sm font-medium w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full ${isHoje && !isSelected ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : ''}`}>
                        {format(date, 'd')}
                      </span>
                      {count > 0 && (
                        <span className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0 sm:py-0.5 rounded-full font-bold ${isSelected ? 'bg-white/20' : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tarefas do Dia Selecionado */}
          <Card className="shadow-sm sticky top-20">
            <CardHeader className="pb-3 border-b border-border/50 bg-slate-50/50 dark:bg-slate-800/20">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                {isToday(selectedDate) ? 'Hoje' : format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50 max-h-[60vh] overflow-y-auto">
                {isLoading ? (
                  <div className="p-6 text-center text-sm text-muted-foreground animate-pulse">Carregando...</div>
                ) : selectedLembretes.length > 0 ? (
                  selectedLembretes.map((l: any) => (
                    <div key={l.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <Link to={`/pendencias/${l.id}`} className="block focus:outline-none">
                        <h4 className="font-medium text-sm text-foreground truncate hover:underline">{l.titulo}</h4>
                        <div className="flex gap-2 mt-2">
                          {l.prioridade === 'alta' && <Badge variant="destructive" className="px-1.5 py-0 text-[10px]">Alta</Badge>}
                          <Badge variant="outline" className="px-1.5 py-0 text-[10px]">{l.tipo}</Badge>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                    <CheckCircle2 className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="text-sm">Dia livre!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </PageWrapper>
  );
}
