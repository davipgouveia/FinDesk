# FinDesk - Lembretes Operacionais para Clínicas

Um sistema web completo, focado e de altíssima produtividade para a gestão de lembretes operacionais voltados para a secretária financeira de clínicas.

## Funcionalidades
- **Dashboard Operacional "Meu Dia"**: Resumo em tempo real de pendências focadas nas próximas horas, atrasos e tarefas finalizadas hoje.
- **Pendências Rápidas**: Filtros, busca de 1-clique (chips), listagem e funcionalidade principal de "check" com feedback instantâneo (optimistic updates).
- **Ações Rápidas**: Barra de produtividade para criação e pesquisa global de lembretes.
- **Calendário Mensal**: Visão rápida de volume de tarefas por dia.
- **Resiliência de Rede**: Cache persistido local (offline reading) usando React Query e stale-while-revalidate.
- **Pacientes e Médicos**: Gerenciamento integrado e visão de tarefas pendentes para cada paciente.
- **Histórico Automático**: Geração de log automático no histórico geral a cada ação.

## Stack
- Vite + React 19 + TypeScript
- Tailwind CSS
- React Query (Persistido) + React Hook Form + Zod
- Supabase (Auth + Database + RLS + Triggers)

## Como executar localmente
1. `npm install`
2. Crie as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no seu arquivo `.env`
3. Aplique o `database/schema.sql` e `database/seed.sql` em seu projeto no Supabase
4. `npm run dev`

Para mais detalhes sobre deploy, confira o arquivo [DEPLOY.md](DEPLOY.md).
