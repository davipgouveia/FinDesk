# Product Requirements Document (PRD)

## Objetivo
Centralizar tarefas operacionais (lembretes) para a secretária do financeiro de uma clínica, facilitando o acompanhamento e garantindo o registro histórico de ações.

## Proposta de Valor
Complementar os sistemas existentes da clínica com um "check central" eficiente para tarefas pontuais de agenda, cobrança, emissão de NF, retornos, etc., que antes ficavam espalhadas ou esquecidas.

## Público-Alvo
- Usuária Principal: Secretária do financeiro da clínica.
- Nível de acesso único no MVP.

## Histórias de Usuário (HU)
- **HU01**: Como secretária, quero fazer login para acessar minhas tarefas de forma segura.
- **HU02**: Como secretária, quero visualizar um dashboard com um resumo das pendências do dia para priorizar meu trabalho.
- **HU03**: Como secretária, quero registrar um novo lembrete contendo título, paciente, data e tipo, para não esquecer de tarefas importantes.
- **HU04**: Como secretária, quero dar um "check" (concluir) em um lembrete para que ele saia da lista de pendências e o sistema registre automaticamente no histórico que eu realizei a tarefa.
- **HU05**: Como secretária, quero poder reagendar um lembrete caso o paciente peça mais prazo, mantendo o histórico dessa mudança.
- **HU06**: Como secretária, quero buscar ou filtrar tarefas por paciente, tipo ou status para encontrar informações rapidamente.
- **HU07**: Como secretária, quero ver o histórico de todas as ações de um lembrete para saber exatamente o que aconteceu com ele.
- **HU08**: Como secretária, quero acessar a visão de um paciente para ver todos os lembretes ligados a ele.

## Funcionalidades (MVP)
1. **Autenticação**: Login com e-mail e senha.
2. **Dashboard**: Resumo e lista rápida das próximas tarefas.
3. **Lista de Pendências**: Filtros, busca, ordenação.
4. **CRUD de Lembretes**: Criar, visualizar detalhe, reagendar, cancelar.
5. **Check Central**: Botão de concluir tarefa que gera histórico de forma automática.
6. **Visão do Paciente**: Lembretes vinculados a um paciente.
7. **Histórico Geral**: Listagem cronológica de todas as ações no sistema.

## Critérios de Aceite
- Lembrete não pode ser criado sem título, tipo, paciente e data de vencimento.
- Ao concluir um lembrete, o status deve mudar para `concluído` e uma ação de histórico deve ser criada.
- Lembretes cancelados não podem ser concluídos, apenas visualizados.
- O sistema deve ser responsivo e acessível.
