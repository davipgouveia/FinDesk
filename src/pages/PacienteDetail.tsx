import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ArrowLeft, User, Calendar, Phone, Mail } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sileo as toast } from '../components/ui/toast/toaster';
import { Edit2, Trash2 } from 'lucide-react';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { useState } from 'react';
export default function PacienteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: paciente, isLoading } = useQuery({
    queryKey: ['paciente', id],
    queryFn: () => api.getPacienteById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.atualizarPaciente(id!, data),
    onSuccess: () => {
      toast.success('Paciente atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['paciente', id] });
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      setIsEditModalOpen(false);
    },
    onError: () => toast.error('Erro ao atualizar paciente')
  });

  const deleteMutation = useMutation({
    mutationFn: api.excluirPaciente,
    onSuccess: () => {
      toast.success('Paciente excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      navigate('/pacientes');
    },
    onError: () => {
      toast.error('Erro ao excluir paciente. Pode haver lembretes vinculados.');
    }
  });

  const handleOpenEdit = () => {
    setEditFormData({
      nome: paciente?.nome || '',
      email: paciente?.email || '',
      telefone: paciente?.telefone || '',
      data_nascimento: paciente?.data_nascimento || '',
      convenio: paciente?.convenio || '',
      ativo: paciente?.ativo ?? true
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(editFormData);
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Carregando detalhes...</div>;
  if (!paciente) return <div className="p-8 text-center text-red-500">Paciente não encontrado.</div>;

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold flex-1">{paciente.nome}</h2>
        <Badge variant={paciente.ativo ? 'success' : 'secondary'}>
          {paciente.ativo ? 'Ativo' : 'Inativo'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dados do Paciente */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={handleOpenEdit}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => setIsDeleteModalOpen(true)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{paciente.telefone || 'Não informado'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{paciente.email || 'Não informado'}</span>
              </div>
              {paciente.data_nascimento && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(parseISO(paciente.data_nascimento), "dd/MM/yyyy")}</span>
                </div>
              )}
              {paciente.convenio && (
                <div className="mt-4 pt-4 border-t">
                  <span className="text-muted-foreground block mb-1">Convênio</span>
                  <span className="font-medium text-foreground">{paciente.convenio}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lembretes do Paciente */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Lembretes Vinculados</CardTitle>
              <Link to={`/lembretes/novo?paciente=${paciente.id}`}>
                <Button variant="outline" size="sm">Adicionar Lembrete</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {(!paciente.lembretes || paciente.lembretes.length === 0) ? (
                <p className="text-muted-foreground text-sm">Nenhum lembrete para este paciente.</p>
              ) : (
                <div className="divide-y border rounded-md">
                  {paciente.lembretes.map((l: any) => (
                    <div key={l.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <Link to={`/pendencias/${l.id}`} className="block focus:outline-none">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-foreground text-sm hover:underline">{l.titulo}</span>
                          <Badge variant={l.status === 'concluído' ? 'success' : l.status === 'cancelado' ? 'destructive' : 'default'} className="text-[10px]">
                            {l.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>Vence: {format(parseISO(l.data_vencimento), "dd/MM/yyyy", { locale: ptBR })}</span>
                          <span>•</span>
                          <span>{l.tipo}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Paciente">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input value={editFormData.nome} onChange={e => setEditFormData({...editFormData, nome: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone</label>
              <Input value={editFormData.telefone} onChange={e => setEditFormData({...editFormData, telefone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data de Nascimento</label>
              <Input type="date" value={editFormData.data_nascimento} onChange={e => setEditFormData({...editFormData, data_nascimento: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Convênio</label>
              <Input value={editFormData.convenio} onChange={e => setEditFormData({...editFormData, convenio: e.target.value})} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" checked={editFormData.ativo} onChange={e => setEditFormData({...editFormData, ativo: e.target.checked})} id="ativo" />
            <label htmlFor="ativo" className="text-sm">Paciente Ativo</label>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate(paciente.id)}
        title="Excluir Paciente"
        description={`Tem certeza que deseja excluir o paciente ${paciente.nome}? Esta ação não poderá ser desfeita.`}
        confirmText={deleteMutation.isPending ? 'Excluindo...' : 'Sim, excluir paciente'}
        type="danger"
      />
    </div>
    </PageWrapper>
  );
}
