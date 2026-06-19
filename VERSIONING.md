# Versionamento e Histórico

A partir da adoção deste processo de melhorias contínuas, o projeto FinDesk passará a usar **Versionamento Semântico (SemVer)** de forma explícita.

## Política SemVer
- **MAJOR (`x.0.0`)**: Mudanças estruturais grandes, reescrita de rotas, quebras de compatibilidade com versões antigas da API ou regras de banco de dados.
- **MINOR (`0.x.0`)**: Novas funcionalidades adicionadas de maneira retrocompatível (ex: nova view de calendário, chips de filtros, duplicação).
- **PATCH (`0.0.x`)**: Correções de bugs, pequenas melhorias visuais e ajustes de performance (ex: arrumar animação de check, otimizar cache).

## Como Fazer Bumps de Versão
1. Atualizar o campo `"version"` no `package.json`.
2. Adicionar as notas ao `CHANGELOG.md` na seção da nova versão.
3. Se possível, commitar com tag (ex: `git tag v1.1.0` e `git push --tags`).
4. A versão será lida do `package.json` ou importada via env vars durante o build para ser mostrada na UI.

*A versão que marca o fim destas melhorias estruturais de IA será definida como a base estável (ex: `1.0.0` ou `1.1.0`).*
