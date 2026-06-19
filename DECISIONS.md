# Decisions Log

| Data | Decisão | Justificativa |
|---|---|---|
| Inicial | React + Vite + Tailwind CSS | Escolhido pela velocidade de desenvolvimento, tooling rápido (Vite) e design simplificado através de utilitários flexíveis. |
| Inicial | Supabase (Database, Auth, RLS) | Abordagem BaaS acelera o desenvolvimento eliminando a necessidade de desenvolver backend manual, oferecendo banco PostgreSQL real. |
| Inicial | Check via Trigger (DB) | Registrar histórico de alterações (ex: check central) via banco de dados assegura a confiabilidade dos dados (evitando dependência que o frontend faça 2 requisições garantidas). No entanto, faremos inserções combinadas no backend por praticidade se os triggers se mostrarem burocráticos. A abordagem mista pode ser adotada se for melhor (ex: Supabase RPC ou inserts subsequentes no client). |
| Inicial | Apenas 1 Usuária (A secretária) | O escopo restrito elimina a necessidade de controle robusto de Roles e permissões complexas no MVP. RLS será ativado para proteger a aplicação baseando-se apenas em login ativo. |
