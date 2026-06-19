import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { toast } from 'sonner';
import { PageWrapper } from '../components/layout/PageWrapper';

const lembreteSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  tipo: z.enum(['cobrança', 'pagamento', 'NF', 'retorno', 'agenda', 'conferência', 'pendência com médico'] as const, { message: 'Tipo é obrigatório' }),
  prioridade: z.enum(['baixa', 'média', 'alta'] as const, { message: 'Prioridade é obrigatória' }),
  status: z.enum(['pendente', 'em andamento', 'aguardando retorno']),
  paciente_id: z.string().min(1, 'Paciente é obrigatório'),
  medico_id: z.string().optional(),
  data_vencimento: z.string().min(1, 'Data é obrigatória'),
  hora_vencimento: z.string().optional(),
  observacoes: z.string().optional(),
  recorrente: z.boolean().optional(),
});

type LembreteFormValues = z.infer<typeof lembreteSchema>;

export default function LembreteForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: pacientes, isLoading: loadPacientes } = useQuery({
    queryKey: ['pacientes'],
    queryFn: api.getPacientes,
  });

  const { data: medicos, isLoading: loadMedicos } = useQuery({
    queryKey: ['medicos'],
    queryFn: api.getMedicos,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<LembreteFormValues>({
    resolver: zodResolver(lembreteSchema),
    defaultValues: {
      status: 'pendente',
      prioridade: 'média',
      tipo: 'retorno',
      recorrente: false,
      data_vencimento: new Date().toISOString().split('T')[0],
    }
  });

  const criarMutation = useMutation({
    mutationFn: api.criarLembrete,
    onSuccess: () => {
      toast.success('Lembrete criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['lembretes'] });
      queryClient.invalidateQueries({ queryKey: ['lembretes_dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['resumo'] });
      navigate('/pendencias');
    },
    onError: () => {
      toast.error('Erro ao criar o lembrete.');
    }
  });

  const onSubmit = (data: any) => {
    // medico_id vazio passa como null pro banco para não ferir foreign key se for empty string
    const payload = {
      ...data,
      medico_id: data.medico_id === '' ? undefined : data.medico_id,
    };
    criarMutation.mutate(payload);
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Nova Tarefa / Lembrete</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>Voltar</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título *</label>
              <Input {...register('titulo')} placeholder="Ex: Cobrar consulta" />
              {errors.titulo && <p className="text-xs text-red-500">{errors.titulo.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Paciente *</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...register('paciente_id')}
                >
                  <option value="">Selecione...</option>
                  {pacientes?.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
                {errors.paciente_id && <p className="text-xs text-red-500">{errors.paciente_id.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Médico (Opcional)</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...register('medico_id')}
                >
                  <option value="">Nenhum</option>
                  {medicos?.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo *</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...register('tipo')}
                >
                  <option value="cobrança">Cobrança</option>
                  <option value="pagamento">Pagamento</option>
                  <option value="NF">NF</option>
                  <option value="retorno">Retorno</option>
                  <option value="agenda">Agenda</option>
                  <option value="conferência">Conferência</option>
                  <option value="pendência com médico">Pendência c/ Médico</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prioridade *</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...register('prioridade')}
                >
                  <option value="baixa">Baixa</option>
                  <option value="média">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data Vencimento *</label>
                <Input type="date" {...register('data_vencimento')} />
                {errors.data_vencimento && <p className="text-xs text-red-500">{errors.data_vencimento.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <textarea 
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
                {...register('descricao')} 
                placeholder="Detalhes adicionais..."
              />
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
              <Button type="submit" disabled={criarMutation.isPending || loadPacientes || loadMedicos}>
                {criarMutation.isPending ? 'Salvando...' : 'Salvar Tarefa'}
              </Button>
            </div>
          </form>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
