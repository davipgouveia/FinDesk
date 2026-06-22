-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Tabela de Pacientes
create table pacientes (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  telefone text,
  email text,
  data_nascimento date,
  cpf text,
  convenio text,
  ativo boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Tabela de Médicos
create table medicos (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  especialidade text,
  telefone text,
  email text,
  crm text,
  ativo boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Tabela de Lembretes
create table lembretes (
  id uuid primary key default uuid_generate_v4(),
  titulo text not null,
  descricao text,
  tipo text not null check (tipo in ('cobrança', 'pagamento', 'NF', 'retorno', 'agenda', 'conferência', 'pendência com médico')),
  prioridade text not null check (prioridade in ('baixa', 'média', 'alta')),
  status text not null check (status in ('pendente', 'em andamento', 'aguardando retorno', 'concluído', 'cancelado')),
  paciente_id uuid references pacientes(id) on delete cascade,
  medico_id uuid references medicos(id) on delete set null,
  data_vencimento date not null,
  hora_vencimento time without time zone,
  observacoes text,
  recorrente boolean default false,
  concluido_em timestamp with time zone,
  cancelado_em timestamp with time zone,
  created_by uuid not null references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Tabela de Histórico de Ações
create table historico_acoes (
  id uuid primary key default uuid_generate_v4(),
  lembrete_id uuid not null references lembretes(id) on delete cascade,
  tipo_acao text not null check (tipo_acao in ('criacao', 'edicao', 'conclusao', 'reagendamento', 'cancelamento', 'visualizacao')),
  descricao text not null,
  data_acao timestamp with time zone default timezone('utc'::text, now()),
  usuario_id uuid not null references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Triggers & Functions para updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger pacientes_updated_at before update on pacientes for each row execute procedure handle_updated_at();
create trigger medicos_updated_at before update on medicos for each row execute procedure handle_updated_at();
create trigger lembretes_updated_at before update on lembretes for each row execute procedure handle_updated_at();

-- Trigger para registrar a conclusão do lembrete automaticamente
create or replace function log_lembrete_conclusao()
returns trigger as $$
begin
  if old.status != 'concluído' and new.status = 'concluído' then
    insert into historico_acoes (lembrete_id, tipo_acao, descricao, usuario_id)
    values (new.id, 'conclusao', 'Lembrete marcado como concluído automaticamente', new.created_by);
    -- update concluido_em
    new.concluido_em = timezone('utc'::text, now());
  elsif old.status != 'cancelado' and new.status = 'cancelado' then
    new.cancelado_em = timezone('utc'::text, now());
  end if;
  return new;
end;
$$ language plpgsql;

create trigger on_lembrete_conclusao before update on lembretes for each row execute procedure log_lembrete_conclusao();

-- RLS (Row Level Security)
alter table pacientes enable row level security;
alter table medicos enable row level security;
alter table lembretes enable row level security;
alter table historico_acoes enable row level security;

-- Como só teremos a secretária (ou usuários autenticados da clínica), podemos permitir
-- leitura e escrita para todos os usuários autenticados.
create policy "Autenticados podem ler/escrever pacientes" on pacientes for all using (auth.role() = 'authenticated');
create policy "Autenticados podem ler/escrever medicos" on medicos for all using (auth.role() = 'authenticated');
create policy "Autenticados podem ler/escrever lembretes" on lembretes for all using (auth.role() = 'authenticated');
create policy "Autenticados podem ler/escrever historico" on historico_acoes for all using (auth.role() = 'authenticated');
