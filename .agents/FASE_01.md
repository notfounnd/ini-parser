# FASE 01 - Biblioteca (LIB)

## Objetivo
Estruturar e implementar a biblioteca core do parser INI, tornando-a um módulo reutilizável e profissional, com testes completos e código seguindo as melhores práticas.

---

## Subfase 1.1 - Configuração do Projeto ✅

### Objetivo
Configurar o ambiente base do projeto com dependências, scripts e estrutura de diretórios.

### Ações
- [x] Criar estrutura de diretórios (`src/lib/`, `test/lib/`, `test/__fixtures__/`)
- [x] Configurar `package.json` com informações do pacote (@notfounnd/ini-parser, v1.0.0, MIT)
- [x] Adicionar dependências de desenvolvimento (Jest, ESLint, Prettier)
- [x] Configurar scripts npm (test, test:watch, test:coverage, lint, lint:fix, format, format:check)
- [x] Revisar `jest.config.js` (verificar `transformIgnorePatterns` e `moduleNameMapper`)
- [x] Validar configurações ESLint e Prettier existentes

---

## Subfase 1.2 - Migração e Refatoração do Parser ✅

### Objetivo
Migrar o código existente de `ini-parser-util.js` para `src/lib/parser.js`, aplicando refatorações necessárias para seguir os padrões do projeto.

### Ações
- [x] Criar arquivo `src/lib/parser.js`
- [x] Migrar código de `ini-parser-util.js` para `src/lib/parser.js`
- [x] Revisar nomenclatura de funções (garantir inglês em tudo)
- [x] Revisar comentários (converter para inglês se necessário)
- [x] Adicionar/revisar JSDoc nas funções públicas
- [x] Executar ESLint e corrigir problemas
- [x] Executar Prettier para formatar código
- [x] Validar que a função `parse()` está exportada corretamente

---

## Subfase 1.3 - Criação de Fixtures ✅

### Objetivo
Criar fixtures otimizadas para testes, cobrindo os principais casos de uso do parser.

### Ações
- [x] Criar diretório `test/__fixtures__/`
- [x] Criar fixture `valid-complete.ini` (seções + valores multi-linha + chaves globais + comentários `;` e `#`)
- [x] Criar fixture `valid-simple.ini` (caso básico com seções e pares key=value)
- [x] Criar fixture `valid-multiline.ini` (foco em valores multi-linha indentados + valores com `=` como `--cov-config=.coveragerc`)
- [x] Criar fixture `valid-global-keys.ini` (foco em chaves sem seção)
- [x] Criar fixture `valid-simple.config` (arquivo config simples sem seções)
- [x] Criar fixture `valid-simple.properties` (arquivo properties simples)
- [x] Criar fixture `empty.ini` (arquivo vazio)
- [x] Criar fixture `edge-cases.ini` (seções vazias, valores não-indentados, casos extremos)

---

## Subfase 1.4 - Implementação de Testes Unitários ✅

### Objetivo
Implementar testes completos para a biblioteca, garantindo cobertura de sentença e decisão (branch).

### Ações
- [x] Criar arquivo `test/lib/parser.test.js`
- [x] Configurar estrutura básica do teste (imports, describe blocks)
- [x] Implementar testes para `parse()` com fixtures válidas
- [x] Implementar testes para opção `meta: true` vs `meta: false`
- [x] Implementar testes para entradas inválidas (null, undefined, non-string)
- [x] Implementar testes para string vazia
- [x] Implementar testes para casos edge (comentários, linhas vazias, etc.)
- [x] Executar testes e garantir que todos passam
- [x] Executar coverage e validar cobertura mínima adequada

### Resultados
- ✅ 40 testes implementados e passando (100% de sucesso)
- ✅ 97.6% de cobertura de statements
- ✅ 83.95% de cobertura de branches
- ✅ 100% de cobertura de funções
- ✅ 97.54% de cobertura de linhas

---

## Subfase 1.5 - Validação e Ajustes Finais ✅

### Objetivo
Validar a biblioteca completa, garantir qualidade do código e preparar para integração com CLI.

### Ações
- [x] Executar todos os testes (`npm test`)
- [x] Executar coverage (`npm run test:coverage`) e revisar relatório
- [x] Executar lint (`npm run lint:check`) e corrigir problemas
- [x] Executar format check (`npm run format:check`)
- [x] Testar importação da lib manualmente (usando parse-examples.js)
- [x] Revisar código completo da lib para garantir qualidade
- [x] Validar que todas as funções privadas usam prefixo `_`
- [x] Validar que todo código está em inglês

### Resultados
- ✅ Todos os testes passando (40 testes)
- ✅ ESLint configurado com suporte a Jest globals
- ✅ Prettier formatação sem erros
- ✅ 21 funções privadas com prefixo `_`, 1 função pública sem prefixo
- ✅ Todo código e comentários em inglês (en-US)
- ✅ Biblioteca funcionando perfeitamente (testado com 12 arquivos)

---

## Critérios de Conclusão da Fase 01 ✅

- ✅ Estrutura de diretórios criada e organizada
- ✅ `package.json` configurado com todas as dependências e scripts
- ✅ Código do parser migrado para `src/lib/parser.js`
- ✅ Código refatorado seguindo padrões (inglês, ESLint, Prettier)
- ✅ Fixtures criadas e otimizadas em `test/__fixtures__/` (8 fixtures)
- ✅ Testes completos implementados com boa cobertura (40 testes)
- ✅ Todos os testes passando (100% de sucesso)
- ✅ Lint e format check sem erros
- ✅ Biblioteca funcional e pronta para ser usada pelo CLI

### Métricas Finais
- **Testes**: 40 testes, 100% passando
- **Cobertura**: 97.6% statements, 83.95% branches, 100% functions
- **Fixtures**: 8 arquivos cobrindo todos os cenários
- **Qualidade**: ESLint + Prettier configurados e validados
- **Documentação**: PARSE_RULES.md completo e validado

---

## Próximos Passos
Após conclusão desta fase, seguir para **FASE_02.md** (CLI + BIN).
