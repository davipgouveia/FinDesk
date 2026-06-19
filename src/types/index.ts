export type StatusLembrete = 'pendente' | 'em andamento' | 'aguardando retorno' | 'concluído' | 'cancelado';
export type PrioridadeLembrete = 'baixa' | 'média' | 'alta';
export type TipoLembrete = 'cobrança' | 'pagamento' | 'NF' | 'retorno' | 'agenda' | 'conferência' | 'pendência com médico';

export interface Paciente {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  data_nascimento?: string;
  cpf?: string;
  convenio?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Medico {
  id: string;
  nome: string;
  especialidade?: string;
  telefone?: string;
  email?: string;
  crm?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lembrete {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: TipoLembrete;
  prioridade: PrioridadeLembrete;
  status: StatusLembrete;
  paciente_id: string;
  medico_id?: string;
  data_vencimento: string;
  hora_vencimento?: string;
  observacoes?: string;
  recorrente: boolean;
  concluido_em?: string;
  cancelado_em?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  
  // Relações que faremos fetch junto:
  pacientes?: Paciente;
  medicos?: Medico;
}

export interface HistoricoAcao {
  id: string;
  lembrete_id: string;
  tipo_acao: 'criacao' | 'edicao' | 'conclusao' | 'reagendamento' | 'cancelamento' | 'visualizacao';
  descricao: string;
  data_acao: string;
  usuario_id: string;
  created_at: string;
}
