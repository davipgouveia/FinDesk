# Architecture

## Visão Geral
O sistema é um SPA (Single Page Application) desenvolvido em React com TypeScript e empacotado com Vite. Ele consome o backend as a Service (BaaS) Supabase para banco de dados relacional (PostgreSQL) e autenticação.

## Camadas
- **Frontend**: Componentes de UI construídos com Tailwind CSS e headless UI primitives. Gerenciamento do estado do servidor utilizando React Query (TanStack Query). Navegação feita via React Router v6.
- **Backend/Database**: Supabase atua como banco de dados (tabelas e RLS - Row Level Security) e gerencia a autenticação de usuários (e-mail e senha).
- **Triggers/Histórico**: Utiliza triggers PostgreSQL no Supabase para automatizar o registro de histórico de ações (Ex: ao atualizar o status de um lembrete para `concluído`).

## Estrutura de Pastas (src)
- `/components`: Componentes reutilizáveis de UI (ex: Button, Input, Modal).
- `/pages`: Componentes de páginas roteáveis (ex: Login, Dashboard, LembreteDetail).
- `/lib`: Utilitários gerais (ex: formatação de datas, classes tailwind via clsx/tailwind-merge).
- `/services`: Chamadas de API ao Supabase e definição de clientes.
- `/hooks`: Hooks React customizados (ex: mutações e queries do React Query).
- `/types`: Definições globais de interfaces/tipos TypeScript (Zod schemas incluídos).
- `/contexts`: Contextos do React (ex: AuthProvider).

## Segurança
- RLS implementado para restringir acesso apenas a usuários autenticados.
- Nenhuma chave secreta exposta (apenas a chave anônima do Supabase exposta para chamadas de frontend protegidas via RLS).
- Dados do usuário acessados via JWT provido pelo Supabase Auth.
