# Lembretes Operacionais - MVP

Um sistema web completo para a gestão de lembretes operacionais focados na secretária financeira de clínicas.

## Funcionalidades
- **Dashboard**: Resumo em tempo real de pendências e visão rápida das tarefas para hoje e atrasadas.
- **Pendências**: Filtros, busca, listagem e a funcionalidade principal de "check" central, que registra a conclusão e altera o status.
- **Pacientes e Médicos**: Gerenciamento integrado e visão de tarefas pendentes para cada paciente.
- **Histórico Automático**: Ao concluir ou alterar um lembrete, o sistema gera log automático no histórico geral.

## Stack
- Vite + React + TypeScript
- Tailwind CSS
- React Query + React Hook Form + Zod
- Supabase (Auth + Database + RLS + Triggers)

## Como executar localmente
1. `npm install`
2. Crie as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no seu arquivo `.env`
3. Aplique o `database/schema.sql` e `database/seed.sql` em seu projeto no Supabase
4. `npm run dev`

Para mais detalhes sobre deploy, confira o arquivo [DEPLOY.md](DEPLOY.md).
