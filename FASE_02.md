# FASE 02 - CLI Development

## Overview
Implementação da interface de linha de comando (CLI) para o INI Parser.

---

## Subfase 2.1 - Estrutura e Planejamento ✅

### Objetivos
- [x] Analisar requisitos do CLI
- [x] Definir estrutura de diretórios
- [x] Especificar interface da linha de comando
- [x] Documentar flags e opções

### Resultados
**Estrutura definida:**
```
src/
  cli/
    index.js          # Entry point do CLI
    args-parser.js    # Parser de argumentos (opcional)
    output-formatter.js # Formatação de output (opcional)
```

**Interface CLI especificada:**
```bash
# Uso básico
ini-parser <file> [options]

# Flags:
--output, -o <file>    # Salva resultado em arquivo
--meta, -m            # Inclui metadados (global keys, sections count)
--quiet, -q           # Suprime output no stdout
--check, -c           # Mostra estatísticas do arquivo
--help, -h            # Ajuda
--version, -v         # Versão
```

---

## Subfase 2.2 - Implementação do Parser de Argumentos ✅

### Objetivos
- [x] Implementar parser de argumentos CLI
- [x] Validar entrada do usuário
- [x] Tratar erros de argumentos inválidos
- [x] Implementar flags --help e --version

### Resultados
- Parser de argumentos implementado em `src/cli/index.js`
- Validação completa de argumentos
- Mensagens de erro claras
- Help e version funcionais

---

## Subfase 2.3 - Integração com Parser Core ✅

### Objetivos
- [x] Integrar CLI com `src/parser/index.js`
- [x] Implementar leitura de arquivo
- [x] Processar resultado do parsing
- [x] Formatar output JSON

### Resultados
- Integração completa com parser core
- Leitura de arquivo com tratamento de erros
- Output JSON formatado (pretty print)
- Suporte a diferentes formatos (.ini, .config, .properties)

---

## Subfase 2.4 - Implementação de Flags e Output ✅

### Objetivos
- [x] Implementar flag --output (salvar em arquivo)
- [x] Implementar flag --meta (metadados)
- [x] Implementar flag --quiet (suprimir stdout)
- [x] Implementar flag --check (estatísticas)
- [x] Formatar outputs conforme cada flag

### Resultados
**Flags implementadas:**

1. **--output, -o**: Salva resultado em arquivo JSON
2. **--meta, -m**: Inclui metadados (globalKeys, sections count)
3. **--quiet, -q**: Suprime stdout (útil com --output)
4. **--check, -c**: Mostra estatísticas:
   - Total de seções
   - Total de chaves
   - Chaves globais
   - Chaves por seção

**Exit codes:**
- `0`: Sucesso
- `1`: Erro de arquivo (não encontrado, sem permissão)
- `2`: Erro de argumentos inválidos

---

## Subfase 2.5 - Análise de Fixtures para Testes CLI ✅

### Objetivos
- [x] Analisar todos os 8 fixtures existentes
- [x] Mapear fixtures para cenários de teste CLI
- [x] Confirmar que não são necessários novos fixtures
- [x] Documentar uso de cada fixture

### Fixtures Analisados

#### 1. `empty.ini` - Arquivo Vazio
**Características:**
- Arquivo vazio (1 linha em branco)
- 0 seções, 0 chaves

**Uso em testes CLI:**
- ✅ Teste de arquivo vazio
- ✅ Validar comportamento com input vazio
- ✅ Verificar que não gera erro

---

#### 2. `valid-simple.ini` - Estrutura Simples
**Características:**
- 3 seções: `[app]`, `[database]`, `[settings]`
- Chaves simples key=value
- Comentários com `#`
- 0 chaves globais

**Uso em testes CLI:**
- ✅ Parsing básico → stdout
- ✅ Flag --quiet (suprimir output)
- ✅ Validação de output JSON básico

**Estrutura:**
```ini
[app]
name=TestApp
version=1.0

[database]
host=localhost
port=3306

[settings]
debug=false
```

---

#### 3. `valid-complete.ini` - Arquivo Completo e Complexo
**Características:**
- 3 chaves globais (app_name, version, debug)
- 6 seções: database, server, features, logging, cache
- Valores multi-linha (features.modules)
- Comentários `#` e `;`
- Comentários inline
- Valores com espaços (split em array)

**Uso em testes CLI:**
- ✅ Flag --output (write file) - conteúdo rico
- ✅ Flag --meta (metadata) - tem globals + seções
- ✅ Flag --check (statistics) - máximo de informações
- ✅ Parsing completo com todas as features

**Estatísticas esperadas:**
- Seções: 6
- Chaves globais: 3
- Total de chaves: ~17

---

#### 4. `valid-global-keys.ini` - Apenas Chaves Globais
**Características:**
- 0 seções
- 10 chaves globais
- Valores simples e multi-valor (allowed_hosts)

**Uso em testes CLI:**
- ✅ Parsing sem seções (edge case)
- ✅ Validar estrutura apenas global
- ✅ Teste de metadata com 0 seções

**Estrutura:**
```ini
app_name=GlobalKeysTest
version=2.5.1
author=Test Author
debug=true
...
allowed_hosts=localhost 127.0.0.1 example.com
```

---

#### 5. `valid-multiline.ini` - Valores Multi-linha Complexos
**Características:**
- Valores multi-linha com `=` preservado
- Padrões pytest (pythonpath, addopts, testpaths)
- Valores com primeiro item na mesma linha (deployment.servers)
- Valores contendo "=" (connection_params)

**Uso em testes CLI:**
- ✅ Parsing complexo multi-linha
- ✅ Validar preservação de "=" em valores
- ✅ Teste de arrays multi-linha

**Estrutura:**
```ini
[pytest]
pythonpath=
    .
    src
    tests

addopts=
    --cov=package
    --cov-config=.coveragerc
```

---

#### 6. `edge-cases.ini` - Casos Extremos e Edge Cases
**Características:**
- Seções vazias (`[empty_section]`)
- Chaves com valores vazios
- Valores não-indentados após chave vazia
- Caracteres especiais (paths Windows, URLs)
- Seções consecutivas
- Seções com apenas comentários

**Uso em testes CLI:**
- ✅ Teste de robustez
- ✅ Casos limites e edge cases
- ✅ Validar parsing de cenários extremos

**Estrutura:**
```ini
[empty_section]

[empty_values]
key_with_no_value=

[special_chars]
path=C:\Program Files\App
url=https://example.com/path?param=value
```

---

#### 7. `valid-simple.config` - Formato .config
**Características:**
- Formato alternativo `.config`
- Chaves globais apenas
- Estrutura simples

**Uso em testes CLI:**
- ✅ Teste de extensão alternativa
- ✅ Validar suporte a .config

**Estrutura:**
```config
app_name=test-application
environment=development
debug=true
```

---

#### 8. `valid-simple.properties` - Formato .properties
**Características:**
- Formato Java `.properties`
- Padrão sonar.* (dot notation)
- Comentários com `#`
- Valores com espaços (serão split)

**Uso em testes CLI:**
- ✅ Teste de formato .properties
- ✅ Validar compatibilidade com Java properties

**Estrutura:**
```properties
sonar.projectKey=test-project
sonar.projectName=Test Project
sonar.sourceEncoding=UTF-8
```

---

### Mapeamento: Fixture → Cenários de Teste CLI

| Cenário de Teste CLI | Fixture Usado | Justificativa |
|---------------------|---------------|---------------|
| **Parsing básico → stdout** | `valid-simple.ini` | Estrutura simples, fácil validação de output JSON |
| **Flag --output (write file)** | `valid-complete.ini` | Conteúdo rico para validar escrita completa |
| **Flag --meta (metadata)** | `valid-complete.ini` | Possui chaves globais + seções, ideal para metadata |
| **Flag --quiet (suppress stdout)** | `valid-simple.ini` | Qualquer fixture serve, simples é suficiente |
| **Flag --check (statistics)** | `valid-complete.ini` | Máximo de informações para estatísticas ricas |
| **Arquivo vazio** | `empty.ini` | Único fixture vazio disponível |
| **Formato .config** | `valid-simple.config` | Teste de extensão alternativa |
| **Formato .properties** | `valid-simple.properties` | Teste de formato Java |
| **Parsing global keys only** | `valid-global-keys.ini` | Sem seções, apenas globals |
| **Parsing multiline complexo** | `valid-multiline.ini` | Valores multi-linha com "=" |
| **Edge cases parsing** | `edge-cases.ini` | Robustez e casos limites |
| **Error: file not found** | *(nenhum)* | Teste com path inexistente |
| **Error: invalid args** | *(nenhum)* | Teste com argumentos inválidos |
| **File write tests** | *(temp dir)* | Jest cria diretório temporário |

---

### Outputs Esperados por Cenário

#### 1. Parsing Básico (stdout)
**Comando:** `ini-parser test/__fixtures__/valid-simple.ini`
```json
{
  "app": {
    "name": "TestApp",
    "version": "1.0"
  },
  "database": {
    "host": "localhost",
    "port": "3306"
  },
  "settings": {
    "debug": "false"
  }
}
```

#### 2. Flag --meta
**Comando:** `ini-parser test/__fixtures__/valid-complete.ini --meta`
```json
{
  "globalKeys": {
    "app_name": "MyApplication",
    "version": "1.0.0",
    "debug": "true"
  },
  "sections": {
    "database": { ... },
    "server": { ... },
    "features": { ... },
    "logging": { ... },
    "cache": { ... }
  },
  "metadata": {
    "totalSections": 6,
    "totalKeys": 17,
    "globalKeysCount": 3
  }
}
```

#### 3. Flag --check
**Comando:** `ini-parser test/__fixtures__/valid-complete.ini --check`
```
File Statistics:
  Total Sections: 6
  Total Keys: 17
  Global Keys: 3

Sections:
  - database (4 keys)
  - server (3 keys)
  - features (2 keys)
  - logging (3 keys)
  - cache (1 key)
```

#### 4. Flag --output
**Comando:** `ini-parser test/__fixtures__/valid-complete.ini -o output.json`
- Cria arquivo `output.json` com conteúdo parseado
- Stdout: `Output saved to output.json`

#### 5. Flag --quiet + --output
**Comando:** `ini-parser test/__fixtures__/valid-simple.ini -o result.json -q`
- Cria arquivo `result.json`
- Stdout: *(vazio)*

#### 6. Arquivo Vazio
**Comando:** `ini-parser test/__fixtures__/empty.ini`
```json
{}
```

#### 7. File Not Found (Error)
**Comando:** `ini-parser nonexistent.ini`
```
Error: File not found: nonexistent.ini
```
**Exit code:** 1

#### 8. Invalid Arguments (Error)
**Comando:** `ini-parser --invalid-flag file.ini`
```
Error: Unknown option: --invalid-flag
Use --help for usage information
```
**Exit code:** 2

---

### Confirmação: Nenhum Fixture Novo Necessário ✅

**Análise completa confirmou:**

✅ **8 fixtures existentes cobrem todos os cenários:**
- Parsing básico e complexo
- Chaves globais e seções
- Valores multi-linha
- Edge cases e casos extremos
- Formatos .ini, .config, .properties
- Arquivo vazio

✅ **Testes de erro não precisam de fixtures:**
- File not found: usa path inexistente
- Invalid args: usa argumentos inválidos
- Ambos testam comportamento de erro, não parsing

✅ **Testes de escrita usam temp dir:**
- Jest cria diretórios temporários
- Não precisa de fixture específico
- Validação é sobre criação de arquivo, não conteúdo

✅ **Total: 14+ cenários cobertos com 8 fixtures**

**Conclusão:** Fixtures existentes são suficientes. Nenhum novo fixture necessário.

---

## Subfase 2.6 - Testes do CLI (Próxima) ⏳

### Objetivos
- [ ] Criar suite de testes para CLI
- [ ] Testar todas as flags
- [ ] Testar tratamento de erros
- [ ] Validar exit codes
- [ ] Usar fixtures mapeados na Subfase 2.5

### Cenários a Testar (usando fixtures existentes)
1. Parsing básico → stdout (`valid-simple.ini`)
2. Flag --output (`valid-complete.ini`)
3. Flag --meta (`valid-complete.ini`)
4. Flag --quiet (`valid-simple.ini`)
5. Flag --check (`valid-complete.ini`)
6. Arquivo vazio (`empty.ini`)
7. Formatos alternativos (`.config`, `.properties`)
8. Parsing global keys (`valid-global-keys.ini`)
9. Multiline complexo (`valid-multiline.ini`)
10. Edge cases (`edge-cases.ini`)
11. File not found (erro)
12. Invalid arguments (erro)

---

## Subfase 2.7 - Documentação e Finalização ⏳

### Objetivos
- [ ] Documentar uso do CLI em README
- [ ] Adicionar exemplos práticos
- [ ] Documentar flags e opções
- [ ] Criar scripts npm para CLI

---

## Status Geral FASE 02

- ✅ Subfase 2.1 - Estrutura e Planejamento
- ✅ Subfase 2.2 - Parser de Argumentos
- ✅ Subfase 2.3 - Integração com Parser Core
- ✅ Subfase 2.4 - Flags e Output
- ✅ Subfase 2.5 - Análise de Fixtures
- ⏳ Subfase 2.6 - Testes do CLI (próxima)
- ⏳ Subfase 2.7 - Documentação

**Progresso:** 5/7 subfases completas (71%)
