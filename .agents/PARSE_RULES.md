# INI Parser - Regras de Parse

Este documento descreve as regras de parse implementadas no parser INI do projeto `@notfounnd/ini-parser`.

---

## 1. Estrutura Básica

### 1.1 Seções
- Seções são definidas por `[section_name]`
- Devem estar em uma linha própria
- O nome da seção é extraído removendo `[` e `]` e aplicando trim
- Seções podem estar vazias (sem chaves dentro)

**Exemplo:**
```ini
[database]
host=localhost

[empty_section]
```

### 1.2 Chaves Globais
- Chaves definidas **antes** de qualquer seção são consideradas globais
- Chaves globais não pertencem a nenhuma seção
- Comportamento idêntico às chaves dentro de seções

**Exemplo:**
```ini
app_name=MyApp
version=1.0.0

[database]
host=localhost
```

### 1.3 Pares Chave-Valor
- Formato: `key=value`
- Espaços ao redor do `=` são permitidos e serão removidos (trim)
- Chaves sem `=` são ignoradas (a menos que sejam valores indentados)

**Exemplo:**
```ini
host=localhost
port = 5432
name  =  test
```

---

## 2. Comentários

### 2.1 Caracteres de Comentário
Dois caracteres indicam comentários:
- `#` (hash)
- `;` (ponto e vírgula)

### 2.2 Comentários no Início da Linha
Linhas que começam com `#` ou `;` são **completamente ignoradas**.

**Exemplo:**
```ini
# Este é um comentário
; Este também é um comentário
[section]
```

### 2.3 Comentários Inline
Tudo após `#` ou `;` até o final da linha é considerado comentário e **removido**.

**Exemplo:**
```ini
host=localhost # este é o servidor local
port=5432 ; porta padrão do PostgreSQL
```

**Resultado:**
```json
{
  "host": ["localhost"],
  "port": ["5432"]
}
```

### 2.4 Comentários em Valores
**IMPORTANTE:** Se `#` ou `;` aparecer em um valor, **tudo após ele é removido**, mesmo que faça parte do valor original.

**Exemplo:**
```ini
connection_string=server=localhost;database=test
```

**Resultado:**
```json
{
  "connection_string": ["server=localhost"]
}
```

⚠️ **Nota:** Isso significa que connection strings SQL ou outros valores que usam `;` como separador serão truncados. Esta é a especificação padrão INI.

---

## 3. Valores Multi-linha

### 3.1 Indentação
Linhas que começam com espaços ou tabs são consideradas **valores indentados** e pertencem à chave anterior.

**Exemplo:**
```ini
[section]
key=
    value1
    value2
    value3
```

**Resultado:**
```json
{
  "section": {
    "key": ["value1", "value2", "value3"]
  }
}
```

### 3.2 Primeiro Valor na Mesma Linha
O primeiro valor pode estar na mesma linha da chave, e valores adicionais indentados.

**Exemplo:**
```ini
servers=prod1
    prod2
    prod3
```

**Resultado:**
```json
{
  "servers": ["prod1", "prod2", "prod3"]
}
```

### 3.3 Valores Não-Indentados Após Chave Vazia
Se uma chave não tem valor inicial (apenas `key=`), linhas **não-indentadas** subsequentes são tratadas como valores até encontrar uma nova chave ou seção.

**Exemplo:**
```ini
key=
value1
value2
```

**Resultado:**
```json
{
  "key": ["value1", "value2"]
}
```

---

## 4. Divisão de Valores

### 4.1 Valores com Espaços
Valores que contêm **espaços em branco** (espaços, tabs, etc.) são **automaticamente divididos** em múltiplos valores durante o parse.

**Exemplo:**
```ini
tags=production stable v1.0
```

**Resultado:**
```json
{
  "tags": ["production", "stable", "v1.0"]
}
```

### 4.2 Valores com Espaços e `=`
**IMPORTANTE:** Valores que contêm espaços são divididos **independentemente** de conterem `=` ou não.

Isso garante consistência, pois o formato INI não suporta strings com múltiplas palavras.

**Exemplo:**
```ini
params=timeout=30 retry=3
```

**Resultado:**
```json
{
  "params": ["timeout=30", "retry=3"]
}
```

**Equivalente a:**
```ini
params=
    timeout=30
    retry=3
```

⚠️ **Nota:**
- Lembre-se que `;` em valores será tratado como comentário (regra 2.4)
- Arquivos `.properties` com valores multi-palavra serão divididos (use lib específica para properties se precisar preservar espaços)
- A divisão ocorre **durante o parse**, não em etapa separada de pós-processamento

### 4.3 Valores Indentados com `=`
Valores indentados que contêm `=` são tratados como **valores normais**, não como novas declarações de chave.

**Exemplo correto (sem espaços ao redor do `=`):**
```ini
[pytest]
addopts=
    --cov-config=.coveragerc
    --cov-context=test
```

**Resultado:**
```json
{
  "pytest": {
    "addopts": ["--cov-config=.coveragerc", "--cov-context=test"]
  }
}
```

#### 4.3.1 Má Formatação com Espaços
⚠️ **IMPORTANTE:** Se uma linha indentada contém `=` **com espaços ao redor**, ela será dividida automaticamente durante o parse (regra 4.2).

**Exemplo de má formatação:**
```ini
key = value
    key_indented = value_indented
```

**Resultado:**
```json
{
  "key": ["value", "key_indented", "=", "value_indented"]
}
```

O valor `"key_indented = value_indented"` contém espaços e é dividido em múltiplos elementos do array.

**Como evitar:**
1. **Não indente** declarações de chave: coloque no início da linha
2. **Remova espaços** ao redor do `=` em valores indentados: `key_indented=value_indented`

**Exemplo correto:**
```ini
key = value
    key_indented=value_indented
```

**Resultado:**
```json
{
  "key": ["value", "key_indented=value_indented"]
}
```

---

## 5. Formato de Saída

### 5.1 Formato Simplificado (Padrão)
Por padrão (`meta: false`), o parser retorna formato simplificado:

```json
{
  "section_name": {
    "key": ["value1", "value2"]
  },
  "global_key": ["value"]
}
```

### 5.2 Formato com Metadados
Com `meta: true`, o parser retorna formato com informações de tipo:

```json
{
  "section_name": {
    "type": "section",
    "content": {
      "key": {
        "type": "configuration",
        "content": ["value1", "value2"]
      }
    }
  },
  "global_key": {
    "type": "configuration",
    "content": ["value"]
  }
}
```

---

## 6. Casos Especiais

### 6.1 Arquivo Vazio
Retorna objeto vazio `{}`.

### 6.2 Entrada Inválida
- `null`, `undefined`, ou não-string: retorna `{}`
- String vazia: retorna `{}`

### 6.3 Seções Vazias
Seções sem chaves resultam em objeto vazio para aquela seção.

**Exemplo:**
```ini
[empty_section]

[normal_section]
key=value
```

**Resultado:**
```json
{
  "empty_section": {},
  "normal_section": {
    "key": ["value"]
  }
}
```

### 6.4 Linhas Vazias
Linhas vazias ou apenas com espaços são ignoradas.

### 6.5 Apenas Comentários
Arquivo contendo apenas comentários retorna `{}`.

---

## 7. Extensões de Arquivo Suportadas

O parser funciona com qualquer extensão de arquivo que siga o formato INI:
- `.ini` - Arquivos INI tradicionais
- `.config` - Arquivos de configuração
- `.properties` - Arquivos properties (estilo Java)
- Qualquer outra extensão que use formato INI

---

## 8. Ordem de Processamento

Para cada linha do arquivo:

1. **Trim** da linha
2. **Verificar se é vazia ou comentário** → ignorar
3. **Verificar se é seção** `[...]` → inicializar seção
4. **Verificar se é chave global** (sem seção atual) → processar como global
5. **Verificar se linha está indentada** → adicionar como valor à chave anterior
6. **Verificar se é par chave=valor** → processar normalmente
7. **Verificar se é valor não-indentado** (após chave vazia) → adicionar como valor

---

## 9. Limitações Conhecidas

1. **Valores com `;`**: Qualquer valor contendo `;` será truncado (comentário inline)
2. **Não suporta aspas**: Valores com aspas não têm tratamento especial
3. **Não suporta escape**: Caracteres de escape (`\`) não são processados
4. **Não suporta seções aninhadas**: `[section.subsection]` é tratado como nome único
5. **Não preserva ordem**: A ordem das chaves não é garantida (objeto JavaScript)

---

## 10. Exemplos Completos

### Exemplo 1: Arquivo Completo
```ini
# Global configuration
app_name=MyApp
version=1.0.0

[database]
host=localhost
port=5432 ; default PostgreSQL port
users=
    admin
    readonly
    backup

[features]
enabled_modules=auth api logging
```

**Resultado:**
```json
{
  "app_name": ["MyApp"],
  "version": ["1.0.0"],
  "database": {
    "host": ["localhost"],
    "port": ["5432"],
    "users": ["admin", "readonly", "backup"]
  },
  "features": {
    "enabled_modules": ["auth", "api", "logging"]
  }
}
```

### Exemplo 2: Pytest-style
```ini
[pytest]
addopts=
    -rA
    --cov=package
    --cov-config=.coveragerc
testpaths=
    tests
```

**Resultado:**
```json
{
  "pytest": {
    "addopts": ["-rA", "--cov=package", "--cov-config=.coveragerc"],
    "testpaths": ["tests"]
  }
}
```

---

**Documento mantido por:** Equipe de Desenvolvimento
**Última atualização:** 2025-10-04 (Refatoração: Guard Clauses + Strategy Pattern)
**Versão do Parser:** 1.0.0
