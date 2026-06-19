import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { sileo as toast } from '../components/ui/toast/toaster';

type FormValues = {
  nome: string;
  especialidade: string;
  telefone: string;
  email: string;
  crm: string;
};

export default function MedicosForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const criarMutation = useMutation({
    mutationFn: api.criarMedico,
    onSuccess: () => {
      toast.success('Médico cadastrado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['medicos'] });
      navigate('/medicos');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao cadastrar médico.');
    }
  });

  const onSubmit = (data: FormValues) => {
    criarMutation.mutate({
      ...data,
      ativo: true,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Novo Médico</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>Voltar</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome Completo *</label>
              <Input {...register('nome', { required: 'Nome é obrigatório' })} placeholder="Ex: Dr. João da Silva" />
              {errors.nome && <p className="text-xs text-red-500">{errors.nome.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Especialidade</label>
                <Input {...register('especialidade')} placeholder="Cardiologia, Dermatologia..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">CRM</label>
                <Input {...register('crm')} placeholder="000000-UF" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone</label>
                <Input {...register('telefone')} placeholder="(11) 90000-0000" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">E-mail</label>
                <Input type="email" {...register('email')} placeholder="doutor@email.com" />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
              <Button type="submit" disabled={criarMutation.isPending}>
                {criarMutation.isPending ? 'Salvando...' : 'Salvar Médico'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
