import { supabase } from '../lib/supabase';
import type { Lembrete, Paciente, Medico } from '../types';

export const api = {
  // --- Dashboard Metrics ---
  async getResumo() {
    const hoje = new Date().toISOString().split('T')[0];
    
    // Total de pendentes (não concluídos nem cancelados)
    const { count: pendentes } = await supabase
      .from('lembretes')
      .select('id', { count: 'exact', head: true })
      .in('status', ['pendente', 'em andamento', 'aguardando retorno']);

    // Vencidas hoje (ou antes de hoje que ainda estão pendentes)
    const { count: vencidasHoje } = await supabase
      .from('lembretes')
      .select('id', { count: 'exact', head: true })
      .in('status', ['pendente', 'em andamento', 'aguardando retorno'])
      .lte('data_vencimento', hoje);

    // Concluídas hoje
    const { count: concluidasHoje } = await supabase
      .from('lembretes')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'concluído')
      .gte('concluido_em', `${hoje}T00:00:00Z`);

    // Aguardando Retorno
    const { count: aguardandoRetorno } = await supabase
      .from('lembretes')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'aguardando retorno');

    return {
      pendentes: pendentes || 0,
      vencidasHoje: vencidasHoje || 0,
      concluidasHoje: concluidasHoje || 0,
      aguardandoRetorno: aguardandoRetorno || 0,
    };
  },

  async getLembretesDashboard() {
    const hoje = new Date().toISOString().split('T')[0];
    
    // Buscar todos os pendentes, em andamento, aguardando
    const { data: ativos, error: err1 } = await supabase.from('lembretes').select(`
      *,
      pacientes ( nome ),
      medicos ( nome )
    `).in('status', ['pendente', 'em andamento', 'aguardando retorno'])
      .order('data_vencimento', { ascending: true })
      .order('prioridade', { ascending: false });

    if (err1) throw err1;

    // Buscar concluídos hoje
    const { data: concluidosHoje, error: err2 } = await supabase.from('lembretes').select(`
      *,
      pacientes ( nome ),
      medicos ( nome )
    `).eq('status', 'concluído')
      .gte('concluido_em', `${hoje}T00:00:00Z`)
      .order('concluido_em', { ascending: false });

    if (err2) throw err2;

    return [...(ativos || []), ...(concluidosHoje || [])] as Lembrete[];
  },

  // --- Lembretes ---
  async getLembretes(filters?: { status?: string, prioridade?: string, busca?: string, filtroCustom?: string }) {
    let query = supabase.from('lembretes').select(`
      *,
      pacientes ( nome ),
      medicos ( nome )
    `).order('data_vencimento', { ascending: true })
      .order('prioridade', { ascending: false });

    const hoje = new Date().toISOString().split('T')[0];

    if (filters?.filtroCustom === 'concluidos') {
      query = query.eq('status', 'concluído');
    } else {
      if (filters?.status && filters?.status !== 'todos') {
        query = query.eq('status', filters.status);
      } else if (filters?.status !== 'todos') {
        // Padrão não mostra concluídos/cancelados, a menos que seja explicitamente 'todos'
        query = query.in('status', ['pendente', 'em andamento', 'aguardando retorno']);
      }
    }

    if (filters?.filtroCustom === 'hoje') {
      query = query.eq('data_vencimento', hoje);
    } else if (filters?.filtroCustom === 'atrasados') {
      query = query.lt('data_vencimento', hoje).in('status', ['pendente', 'em andamento', 'aguardando retorno']);
    }

    if (filters?.prioridade) {
      query = query.eq('prioridade', filters.prioridade);
    }

    if (filters?.busca) {
      query = query.ilike('titulo', `%${filters.busca}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Lembrete[];
  },

  async getRelatorioLembretes() {
    const { data, error } = await supabase.from('lembretes').select(`
      *,
      pacientes ( nome ),
      medicos ( nome )
    `).order('data_vencimento', { ascending: false });
    if (error) throw error;
    return data as Lembrete[];
  },

  async getLembreteById(id: string) {
    const { data, error } = await supabase
      .from('lembretes')
      .select(`
        *,
        pacientes ( * ),
        medicos ( * )
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as Lembrete;
  },

  async criarLembrete(lembrete: Partial<Lembrete>) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('lembretes')
      .insert([{ ...lembrete, created_by: userData.user.id }])
      .select()
      .single();
      
    if (error) throw error;
    
    // O histórico de criação pode ser feito via trigger, mas
    // se o banco não tiver trigger pra CREATE, inserimos manual.
    // Pelo nosso schema, não fizemos trigger pra INSERT, apenas pra concluir/cancelar.
    // Vamos inserir o histórico de criação.
    await supabase.from('historico_acoes').insert([{
      lembrete_id: data.id,
      tipo_acao: 'criacao',
      descricao: 'Lembrete criado',
      usuario_id: userData.user.id
    }]);

    return data;
  },

  async atualizarLembrete(id: string, lembrete: Partial<Lembrete>) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('lembretes')
      .update(lembrete)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    await supabase.from('historico_acoes').insert([{
      lembrete_id: data.id,
      tipo_acao: 'edicao',
      descricao: 'Lembrete editado manualmente',
      usuario_id: userData.user.id
    }]);

    return data;
  },

  async concluirLembrete(id: string) {
    const { data, error } = await supabase
      .from('lembretes')
      .update({ status: 'concluído' })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async cancelarLembrete(id: string) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('lembretes')
      .update({ status: 'cancelado' })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    await supabase.from('historico_acoes').insert([{
      lembrete_id: id,
      tipo_acao: 'cancelamento',
      descricao: 'Lembrete cancelado manualmente',
      usuario_id: userData.user.id
    }]);

    return data;
  },

  async reagendarLembrete(id: string, novaData: string) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('lembretes')
      .update({ data_vencimento: novaData, status: 'pendente' })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;

    await supabase.from('historico_acoes').insert([{
      lembrete_id: id,
      tipo_acao: 'reagendamento',
      descricao: `Reagendado para ${novaData}`,
      usuario_id: userData.user.id
    }]);

    return data;
  },

  async getHistorico(lembrete_id?: string) {
    let query = supabase.from('historico_acoes').select(`
      *,
      lembretes ( titulo )
    `).order('data_acao', { ascending: false });

    if (lembrete_id) {
      query = query.eq('lembrete_id', lembrete_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // --- Listagens ---
  async getPacientes() {
    const { data, error } = await supabase.from('pacientes').select('*').order('nome');
    if (error) throw error;
    return data as Paciente[];
  },

  async getMedicos() {
    const { data, error } = await supabase.from('medicos').select('*').order('nome');
    if (error) throw error;
    return data as Medico[];
  },

  async getPacienteById(id: string) {
    const { data, error } = await supabase
      .from('pacientes')
      .select(`
        *,
        lembretes (
          id, titulo, status, prioridade, tipo, data_vencimento
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },

  async getTodosHistoricos(filters?: { tipo_acao?: string, busca?: string }) {
    let query = supabase.from('historico_acoes').select(`
      *,
      lembretes ( titulo, pacientes ( nome ) ),
      auth_users_view:usuario_id ( email )
    `).order('data_acao', { ascending: false });

    if (filters?.tipo_acao) {
      query = query.eq('tipo_acao', filters.tipo_acao);
    }

    if (filters?.busca) {
      query = query.ilike('descricao', `%${filters.busca}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // --- Pacientes CRUD ---
  async criarPaciente(paciente: Omit<Paciente, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('pacientes').insert(paciente).select().single();
    if (error) throw error;
    return data;
  },

  async atualizarPaciente(id: string, paciente: Partial<Omit<Paciente, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase.from('pacientes').update(paciente).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async excluirPaciente(id: string) {
    const { error } = await supabase.from('pacientes').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // --- Médicos CRUD ---
  async criarMedico(medico: Omit<Medico, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('medicos').insert(medico).select().single();
    if (error) throw error;
    return data;
  },

  async atualizarMedico(id: string, medico: Partial<Omit<Medico, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase.from('medicos').update(medico).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async excluirMedico(id: string) {
    const { error } = await supabase.from('medicos').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async excluirLembrete(id: string) {
    const { error } = await supabase.from('lembretes').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};
