# Estado Atual (Current State)

## Resumo
O FinDesk é um sistema web funcional (MVP) de lembretes operacionais voltado para a secretária financeira de clínicas. Ele não substitui o sistema de gestão principal (ERP/Prontuário), mas atua como uma camada operacional rápida e prática para garantir que tarefas diárias não sejam esquecidas.

## Estrutura do Projeto
- **Frontend**: SPA em React 19, TypeScript, empacotado via Vite.
- **Estilos**: Tailwind CSS com plugins e utilitários customizados (via `clsx` e `tailwind-merge`). Animações via Framer Motion.
- **Roteamento**: React Router v7.
- **State/Data Fetching**: React Query (TanStack Query v5) para cache de servidor.
- **Formulários**: React Hook Form com Zod para validação.
- **Backend/Autenticação**: Supabase. Banco de dados relacional com RLS e autenticação via E-mail/Senha. Triggers configurados no banco para gerar logs de histórico de ações.

## Funcionalidades Existentes
1. **Autenticação**: Login, Cadastro, Recuperação de Senha.
2. **Dashboard**: Visão geral de métricas, atrasados e para hoje.
3. **Pendências (Lembretes)**: Listagem com filtros de status e texto, visualização de detalhes, check para conclusão, edição.
4. **Pacientes e Médicos**: CRUD simplificado, atrelado aos lembretes.
5. **Relatórios**: Exportação ou visão em tela com auxílio do `recharts` e `jspdf`.
6. **Configurações/Perfil**: Ajustes de tema e perfil básico.

## Stack Identificada
- `@supabase/supabase-js`
- `@tanstack/react-query`
- `react-hook-form` / `zod`
- `tailwindcss` / `lucide-react`
- `framer-motion`

## Avaliação de Ponto de Partida
O projeto está muito bem estruturado nas camadas de componentes e hooks. O uso de React Query já facilita a adoção de persistência (cache) nas próximas etapas. A UX já conta com navegação fluida, mas as ações demandam muitos cliques, sendo pouco orientadas a produtividade instantânea.
