# UI Guidelines

## Princípios
- Profissional, limpo e direto ao ponto.
- O foco é a funcionalidade e o acesso rápido a ações (check central).
- Feedback imediato: loading states, skeleton screens (se necessário) e toasts de sucesso/erro.

## Cores
- **Primária**: Tons de azul escuro / slate (`bg-slate-900`) para elementos focais e navegação.
- **Sucesso (Concluído)**: Verde (`text-emerald-600`, `bg-emerald-100`).
- **Alerta (Atenção/Aguardando)**: Amarelo/Laranja (`text-amber-600`, `bg-amber-100`).
- **Urgente/Atrasado**: Vermelho (`text-red-600`, `bg-red-100`).
- **Background**: Cinza claríssimo/Branco (`bg-slate-50`, `bg-white`).
- **Bordas**: Cinza sutil (`border-slate-200`).

## Tipografia
- Fonte base: Inter ou a padrão sans-serif do sistema (via Tailwind).
- Hierarquia forte:
  - Títulos: `text-2xl font-bold` ou `text-xl font-semibold`.
  - Corpo: `text-sm` e `text-base`.
  - Metadados: `text-xs text-slate-500`.

## Componentes
- **Botões**: Bordas arredondadas (`rounded-md`), estados de hover claros.
- **Inputs**: Bordas visíveis, outline primário ao focar, mensagens de erro em vermelho logo abaixo.
- **Cards**: Fundo branco, sombra leve (`shadow-sm`), borda clara (`border-slate-200`), padding generoso (`p-6`).

## Animações
- Suaves transições de páginas e estados (Framer Motion).
- `fade-in` (opacidade 0 -> 1) nas listas e modais.
- Efeitos de `hover` e escalas sutis nos botões.
