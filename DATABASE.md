# Database Schema (Supabase / PostgreSQL)

## Tabelas

### `pacientes`
- `id`: UUID, Primary Key
- `nome`: Text, Not Null
- `telefone`: Text
- `email`: Text
- `data_nascimento`: Date
- `cpf`: Text
- `convenio`: Text
- `ativo`: Boolean, Default: true
- `created_at`: Timestampz
- `updated_at`: Timestampz

### `medicos`
- `id`: UUID, Primary Key
- `nome`: Text, Not Null
- `especialidade`: Text
- `telefone`: Text
- `email`: Text
- `crm`: Text
- `ativo`: Boolean, Default: true
- `created_at`: Timestampz
- `updated_at`: Timestampz

### `lembretes`
- `id`: UUID, Primary Key
- `titulo`: Text, Not Null
- `descricao`: Text
- `tipo`: Text, Not Null (cobrança, pagamento, NF, retorno, agenda, conferência, pendência com médico)
- `prioridade`: Text, Not Null (baixa, média, alta)
- `status`: Text, Not Null (pendente, em andamento, aguardando retorno, concluído, cancelado)
- `paciente_id`: UUID, Foreign Key (pacientes), Nullable
- `medico_id`: UUID, Foreign Key (medicos), Nullable
- `data_vencimento`: Date, Not Null
- `hora_vencimento`: Time, Nullable
- `observacoes`: Text
- `recorrente`: Boolean, Default: false
- `concluido_em`: Timestampz, Nullable
- `cancelado_em`: Timestampz, Nullable
- `created_by`: UUID, Foreign Key (auth.users), Not Null
- `created_at`: Timestampz
- `updated_at`: Timestampz

### `historico_acoes`
- `id`: UUID, Primary Key
- `lembrete_id`: UUID, Foreign Key (lembretes), Not Null
- `tipo_acao`: Text, Not Null (criacao, edicao, conclusao, reagendamento, cancelamento, visualizacao)
- `descricao`: Text, Not Null
- `data_acao`: Timestampz, Default: now()
- `usuario_id`: UUID, Foreign Key (auth.users), Not Null

## Automação (Triggers)
- Ao atualizar o status de um lembrete para `concluído`, um trigger deve inserir uma linha no `historico_acoes` marcando a conclusão.

## RLS (Row Level Security)
- Políticas que permitem as operações (SELECT, INSERT, UPDATE, DELETE) em todas as tabelas apenas para o usuário autenticado (`auth.uid() = created_by` ou qualquer auth.uid() no MVP onde só há uma usuária).
