# Plano de Melhorias (Improvements Plan)

## Objetivo Central
Transformar o FinDesk em uma ferramenta de altíssima produtividade (rápida, resiliente e focada em fluxo) para a secretária do financeiro, sem agregar complexidade desnecessária.

## Fases de Melhoria
### Fase 2: Produtividade e Dashboard
- **Dashboard "Meu Dia"**: Transformar o Dashboard para focar 100% no operacional diário: próximas horas, atrasados, aguardando retorno, e finalizados.
- **Ações Rápidas Globais**: Uma barra fixada no topo ou rodapé (QuickActionsBar) que permite adicionar um novo lembrete, acessar a busca ou o calendário de qualquer lugar do app em 1 clique.
- **Filtros Rápidos (Chips)**: Componente horizontal scrollável com chips ("Hoje", "Atrasados", "Alta Prioridade") que disparam filtros no React Query imediatamente.
- **Ações Contextuais**: Check de finalização mais responsivo (Optimistic Update), e botões rápidos na listagem de lembretes (Editar, Reagendar, Duplicar).
- **Duplicação de Lembrete**: Criar rotina para repetir um lembrete com facilidade.

### Fase 3: Calendário
- **Visão Mensal**: Criar uma aba de Calendário que não seja um monstro complexo, mas sim uma visão de badges (quantos lembretes por dia).
- **Interatividade**: Ao clicar num dia, abrir os detalhes do que há pendente ali sem perder contexto.

### Fase 4: Cache e Resiliência
- **Offline/Resiliência de Leitura**: Configurar o `persistQueryClient` usando IndexedDB.
- **Stale-while-revalidate**: Ajustar `staleTime` para que a UI carregue rápido com o dado em cache e logo em seguida confirme as atualizações de fundo.
- **Fila/Optimistic**: Ao dar "Check", a tela reflete instantaneamente, enquanto envia silenciosamente ao Supabase.

### Fase 5: Versionamento e Refinamento
- Aplicar o standard do SemVer de forma estrita.
- Auditar cores, fontes e acessibilidade.
- Ajustar animações sutis usando o Framer Motion que já existe na base.
