# Architecture

## Visão Geral
O sistema é um SPA (Single Page Application) focado em **alta produtividade** desenvolvido em React 19 com TypeScript e empacotado com Vite. Ele consome o backend as a Service (BaaS) Supabase para banco de dados relacional (PostgreSQL) e autenticação.

## Camadas e Padrões
- **Frontend**: Componentes de UI construídos com Tailwind CSS e headless UI primitives. Gerenciamento do estado do servidor utilizando React Query (TanStack Query) com **Cache Persistido (Offline Reading)** e estratégias de **Optimistic Updates** e **Stale-while-revalidate** para garantir fluidez, independentemente da oscilação da rede.
- **Navegação**: React Router v7 para roteamento ágil.
- **Backend/Database**: Supabase atua como banco de dados (tabelas e RLS - Row Level Security) e gerencia a autenticação de usuários.
- **Triggers/Histórico**: Utiliza triggers PostgreSQL no Supabase para automatizar o registro de histórico de ações.

## Estrutura de Pastas (src)
- `/components/ui`: Componentes primários de design system (Botões, Inputs, QuickActions, FilterChips).
- `/components/layout`: Wrappers da aplicação (Sidebar, AppLayout).
- `/pages`: Componentes de páginas roteáveis (ex: Dashboard, Calendario, Pendencias).
- `/lib`: Utilitários gerais (ex: formatação de datas).
- `/services`: Chamadas de API ao Supabase.
- `/hooks`: Hooks customizados, englobando as Mutações com optimistic updates do React Query.
- `/types`: Definições globais de interfaces/tipos TypeScript (Zod schemas incluídos).
- `/contexts`: Contextos do React (Auth, Theme).

## Produtividade e UX
- Ações centralizadas em uma **Quick Actions Bar** sempre visível.
- Feedback imediato nas transições de estado de lembretes (Check, Editar, Duplicar).
- Filtros em formato de Chips de acesso instantâneo na lista.

## Segurança
- RLS implementado para restringir acesso apenas a usuários autenticados.
- Nenhuma chave secreta exposta no frontend.
