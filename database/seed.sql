-- O ideal é rodar esse seed logado com um user, mas para testes de desenvolvimento
-- vamos inserir um usuário de teste (caso não exista, o Supabase auth não suporta insert direto fácil na auth.users sem bypass, 
-- então assumimos que o DEV vai criar um user no Supabase Auth e usar o ID dele, 
-- OU podemos criar uma função dummy ou usar auth.uid() em RLS desativado).
-- Para este seed funcionar via SQL Editor, temporariamente vamos pegar o UID de um user existente ou desabilitar RLS.

-- NOTA: Execute isso APÓS criar uma conta de e-mail/senha no painel Auth do Supabase.
-- Substitua 'SEU_USER_UUID' pelo ID que foi gerado para a conta da secretária.
-- Exemplo: set session "my.user_id" = 'uuid-da-secretaria';

DO $$
DECLARE
  v_user_id uuid;
  v_pac_1 uuid;
  v_pac_2 uuid;
  v_pac_3 uuid;
  v_pac_4 uuid;
  v_pac_5 uuid;
  v_med_1 uuid;
  v_med_2 uuid;
  v_med_3 uuid;
  v_lemb_1 uuid;
BEGIN
  -- Se você souber o ID, atribua aqui. Se não houver, vamos inserir na marra 
  -- um uuid fictício só para foreign key se as FK permitissem, 
  -- mas auth.users exige registro válido no Supabase.
  -- Para fins deste seed de teste: 
  select id into v_user_id from auth.users limit 1;
  
  if v_user_id is null then
    RAISE NOTICE 'Nenhum usuário encontrado em auth.users. Crie um usuário no painel primeiro.';
    RETURN;
  end if;

  -- Inserir Pacientes
  insert into pacientes (nome, telefone, email, convenio) values 
    ('João Silva', '(11) 98888-1111', 'joao@example.com', 'Unimed') returning id into v_pac_1;
  insert into pacientes (nome, telefone, email, convenio) values 
    ('Maria Oliveira', '(11) 98888-2222', 'maria@example.com', 'Bradesco') returning id into v_pac_2;
  insert into pacientes (nome, telefone, email, convenio) values 
    ('Carlos Souza', '(11) 98888-3333', 'carlos@example.com', 'Amil') returning id into v_pac_3;
  insert into pacientes (nome, telefone, email, convenio) values 
    ('Ana Costa', '(11) 98888-4444', 'ana@example.com', 'SulAmérica') returning id into v_pac_4;
  insert into pacientes (nome, telefone, email, convenio) values 
    ('Pedro Santos', '(11) 98888-5555', 'pedro@example.com', 'Particular') returning id into v_pac_5;

  -- Inserir Médicos
  insert into medicos (nome, especialidade, telefone) values 
    ('Dr. Roberto', 'Cardiologia', '(11) 99999-1111') returning id into v_med_1;
  insert into medicos (nome, especialidade, telefone) values 
    ('Dra. Fernanda', 'Dermatologia', '(11) 99999-2222') returning id into v_med_2;
  insert into medicos (nome, especialidade, telefone) values 
    ('Dr. Marcos', 'Ortopedia', '(11) 99999-3333') returning id into v_med_3;

  -- Inserir Lembretes
  insert into lembretes (titulo, descricao, tipo, prioridade, status, paciente_id, medico_id, data_vencimento, created_by) values 
    ('Cobrar consulta', 'Paciente não pagou a consulta particular', 'cobrança', 'alta', 'pendente', v_pac_5, v_med_1, current_date, v_user_id) returning id into v_lemb_1;
    
  insert into lembretes (titulo, descricao, tipo, prioridade, status, paciente_id, medico_id, data_vencimento, created_by) values 
    ('Emitir NF', 'Emitir nota fiscal do retorno', 'NF', 'média', 'pendente', v_pac_1, v_med_2, current_date, v_user_id);
    
  insert into lembretes (titulo, descricao, tipo, prioridade, status, paciente_id, data_vencimento, created_by) values 
    ('Retorno de exames', 'Ligar para avisar que exame chegou', 'retorno', 'alta', 'pendente', v_pac_2, current_date, v_user_id);
    
  insert into lembretes (titulo, descricao, tipo, prioridade, status, paciente_id, medico_id, data_vencimento, created_by) values 
    ('Verificar guia', 'Guia do convênio ainda não foi liberada', 'pendência com médico', 'baixa', 'aguardando retorno', v_pac_3, v_med_3, current_date - interval '1 day', v_user_id);

  insert into lembretes (titulo, descricao, tipo, prioridade, status, paciente_id, data_vencimento, created_by) values 
    ('Remarcar consulta', 'Paciente desmarcou em cima da hora', 'agenda', 'média', 'pendente', v_pac_4, current_date + interval '2 days', v_user_id);

  -- Registrar histórico do primeiro lembrete
  insert into historico_acoes (lembrete_id, tipo_acao, descricao, usuario_id) values 
    (v_lemb_1, 'criacao', 'Lembrete criado', v_user_id);

END $$;
