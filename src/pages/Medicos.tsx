import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function Medicos() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState('');
  const [medicoSelecionado, setMedicoSelecionado] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [medicoParaExcluir, setMedicoParaExcluir] = useState<any>(null);

  const { data: medicos, isLoading } = useQuery({
    queryKey: ['medicos'],
    queryFn: api.getMedicos,
  });

  const medicosFiltrados = medicos?.filter(m => m.nome.toLowerCase().includes(busca.toLowerCase()));

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.atualizarMedico(medicoSelecionado.id, data),
    onSuccess: () => {
      toast.success('Médico atualizado!');
      queryClient.invalidateQueries({ queryKey: ['medicos'] });
      setIsEditModalOpen(false);
      setMedicoSelecionado(null);
    },
    onError: () => toast.error('Erro ao atualizar médico')
  });

  const deleteMutation = useMutation({
    mutationFn: api.excluirMedico,
    onSuccess: () => {
      toast.success('Médico excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['medicos'] });
      setMedicoParaExcluir(null);
    },
    onError: () => {
      toast.error('Erro ao excluir médico. Ele pode ter lembretes vinculados.');
    }
  });

  const handleRowClick = (medico: any) => {
    setMedicoSelecionado(medico);
    setEditFormData({
      nome: medico.nome,
      especialidade: medico.especialidade || '',
      telefone: medico.telefone || '',
      email: medico.email || '',
      ativo: medico.ativo ?? true
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(editFormData);
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar médico..."
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <Link to="/medicos/novo">
          <Button>Adicionar Médico</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando médicos...</div>
          ) : medicosFiltrados?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Nenhum médico encontrado.</div>
          ) : (
            <div className="divide-y">
              {medicosFiltrados?.map(m => (
                <div 
                  key={m.id} 
                  onClick={() => handleRowClick(m)}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium text-foreground">{m.nome}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                      {m.especialidade && <span>{m.especialidade}</span>}
                      {m.telefone && (
                        <>
                          <span>•</span>
                          <span>{m.telefone}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 shrink-0 flex items-center gap-3">
                    <Badge variant={m.ativo ? 'success' : 'secondary'}>
                      {m.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMedicoParaExcluir(m);
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

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Médico">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input value={editFormData.nome} onChange={e => setEditFormData({...editFormData, nome: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Especialidade</label>
            <Input value={editFormData.especialidade} onChange={e => setEditFormData({...editFormData, especialidade: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone</label>
              <Input value={editFormData.telefone} onChange={e => setEditFormData({...editFormData, telefone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" checked={editFormData.ativo} onChange={e => setEditFormData({...editFormData, ativo: e.target.checked})} id="ativo" />
            <label htmlFor="ativo" className="text-sm">Médico Ativo</label>
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
        isOpen={!!medicoParaExcluir}
        onClose={() => setMedicoParaExcluir(null)}
        onConfirm={() => deleteMutation.mutate(medicoParaExcluir.id)}
        title="Excluir Médico"
        description={`Tem certeza que deseja excluir o(a) Dr(a). ${medicoParaExcluir?.nome}? Esta ação não poderá ser desfeita.`}
        confirmText={deleteMutation.isPending ? 'Excluindo...' : 'Sim, excluir médico'}
        type="danger"
      />
    </div>
    </PageWrapper>
  );
}
