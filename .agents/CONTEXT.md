# CONTEXT.md - INI Parser Project

## Visão Geral do Projeto

Este projeto consiste no desenvolvimento de um parser profissional para arquivos INI, disponibilizado como pacote NPM para a comunidade. O parser deve funcionar tanto como biblioteca JavaScript quanto como ferramenta CLI.

### Nome do Pacote
`@notfounnd/ini-parser`

### Versão Inicial
`1.0.0`

### Licença
MIT

---

## Objetivos do Projeto

### 1. Biblioteca (Library)
- Receber o conteúdo de um arquivo INI como string
- Retornar um objeto JSON estruturado com o parse do conteúdo
- Dar liberdade ao desenvolvedor para gerenciar a leitura de arquivos
- Manter a simplicidade: string in, object out

### 2. CLI (Command Line Interface)
- Permitir parse de arquivos INI via linha de comando
- Aceitar caminhos relativos ou absolutos
- Suportar instalação global e uso como ferramenta
- Oferecer opções de saída flexíveis (stdout ou arquivo)

---

## Requisitos Técnicos

### Compatibilidade
- **Node.js**: 18+ (versão mínima suportada)
- **JavaScript**: ES6+ (compatível com projetos TypeScript)

### Dependências Principais
- **CommanderJS**: Gerenciamento de CLI e argumentos
- **ChalkJS**: Colorização de saída no terminal
- **Jest**: Framework de testes
- **ESLint + Prettier**: Formatação e linting de código

---

## Estrutura de Diretórios

```
ini-parser/
├── src/
│   ├── lib/
│   │   └── parser.js          # Lógica core do parser
│   └── cli/
│       └── index.js            # Lógica CLI
├── bin/
│   └── ini-parser.js           # Entry point executável
├── test/
│   ├── lib/
│   │   └── parser.test.js     # Testes da biblioteca
│   ├── cli/
│   │   └── index.test.js      # Testes do CLI
│   └── __fixtures__/          # Arquivos INI de exemplo para testes
├── .agents/
│   └── CONTEXT.md             # Este arquivo
├── package.json
├── README.md
├── LICENSE
├── eslint.config.mjs          # Configuração ESLint (flat config)
├── .prettierrc.json           # Configuração Prettier
└── jest.config.js             # Configuração Jest
```

---

## Funcionalidades da Biblioteca

### Função Principal: `parse(content, options)`

#### Parâmetros:
- `content` (string): Conteúdo do arquivo INI
- `options` (object): Opções de configuração
  - `meta` (boolean): Se `true`, retorna formato com metadados; se `false`, retorna formato simplificado (padrão: `false`)

#### Retorno:
- Objeto JSON estruturado com seções e configurações

#### Comportamento Atual do Parser:
- Suporta seções `[section]`
- Suporta pares chave-valor `key=value`
- Suporta valores multi-linha (indentados)
- Suporta chaves globais (fora de seções)
- Ignora linhas vazias e comentários (`#` e `;`)
- Divide valores por espaços quando apropriado
- Valores indentados são adicionados à chave anterior
- Implementa Guard Clauses e Strategy Pattern para código limpo e manutenível

### Tratamento de Erros (LIB):
- **Entrada inválida** (null, undefined, não-string): retorna `{}`
- **String vazia**: retorna `{}`
- **Conteúdo malformado**: faz melhor esforço para parsear
- **Não lida com I/O**: responsabilidade de quem chama

---

## Funcionalidades do CLI

### Comando Base
```bash
ini-parser <arquivo>
```

### Flags e Opções

#### Obrigatórias:
- `<arquivo>`: Caminho do arquivo INI (relativo ou absoluto)

#### Opcionais:
- `--output <file>` ou `-o <file>`: Salva resultado em arquivo JSON
- `--meta`: Retorna formato com metadados (padrão: formato simplificado)
- `--quiet` ou `-q`: Suprime saída em stdout quando salvar em arquivo
- `--validate`: Apenas valida se o INI é válido, sem processar
- `--help` ou `-h`: Exibe ajuda
- `--version` ou `-v`: Exibe versão do pacote

### Comportamento Padrão:
- Sem flags: imprime JSON em stdout com pretty-print
- Com `--output`: salva em arquivo JSON com pretty-print E imprime em stdout (a menos que `--quiet` seja usado)

### Tratamento de Erros (CLI):

#### Códigos de Saída:
- `0`: Sucesso
- `1`: Erro geral (arquivo não encontrado, sem permissão de leitura, erro ao escrever arquivo de saída)
- `2`: Argumentos inválidos

#### Comportamentos Específicos:
- **Arquivo não existe**: erro com código 1 e mensagem descritiva
- **Arquivo sem permissão de leitura**: erro com código 1 e mensagem descritiva
- **Arquivo vazio**: processa normalmente (retorna `{}`)
- **Erro ao escrever arquivo de saída**: erro com código 1 e mensagem descritiva
- **Conteúdo malformado**: processa normalmente (melhor esforço)

### Mensagens de Erro:
- Todas as mensagens devem ser claras e em **inglês (en-US)**
- Usar ChalkJS para colorização (vermelho para erros, verde para sucesso, amarelo para warnings)

---

## Estratégia de Testes

### Abordagem Geral:
- **Cobertura**: Sentença e decisão (branch coverage)
- **Fixtures**: Todos os testes devem usar arquivos fixtures
- **Otimização**: Evitar criação de múltiplos fixtures desnecessários
  - Uma fixture de sucesso pode validar o código inteiro
  - Fixtures devem ser reutilizáveis e focadas
- **Templates**: Usar Handlebars para gerar fixtures dinamicamente em tempo de teste (quando apropriado)

### Técnicas de Teste:

#### Opção 1: Testes unitários por função
- 1 `it()` para verificações únicas em cada função
- Mais granular, maior cobertura de edge cases

#### Opção 2: Testes de integração (preferencial para início)
- 1 parse único de sucesso
- Comparar objeto de saída completo
- Mais enxuto e direto

### Estrutura de Testes:
```
test/
├── lib/
│   └── parser.test.js
├── cli/
│   └── index.test.js
└── __fixtures__/
    ├── valid-simple.ini
    ├── valid-multiline.ini
    ├── valid-global-keys.ini
    ├── empty.ini
    └── ... (otimizados)
```

### Casos de Teste Importantes:
- ✅ Parse de arquivo INI simples com seções
- ✅ Parse com valores multi-linha indentados
- ✅ Parse com chaves globais (sem seção)
- ✅ Parse de arquivo vazio
- ✅ Parse com comentários
- ✅ Opção `meta: true` vs `meta: false`
- ✅ CLI: arquivo não encontrado
- ✅ CLI: arquivo sem permissão
- ✅ CLI: saída para stdout
- ✅ CLI: saída para arquivo
- ✅ CLI: flags combinadas

### Configuração do Jest:
- Arquivo `jest.config.js` configurado e validado
- Suporte a globals do Jest configurado em `eslint.config.mjs`
- Cobertura configurada: statements, branches, functions, lines

---

## Padrões de Desenvolvimento

### Idioma do Código
- **TUDO em inglês (en-US)**:
  - Nomes de variáveis, funções, classes
  - Comentários no código
  - Mensagens de erro e saída do CLI
  - Documentação inline (JSDoc)
  - README.md
  - Strings literais

### Idioma da Comunicação
- **Chat e arquivos `.agents/`**: pt-BR
- **Código e documentação técnica**: en-US

### Convenções de Código:
- **ESLint + Prettier**: Arquivos de configuração já criados com preferências do desenvolvedor
- **Nomenclatura**:
  - Funções privadas/auxiliares: prefixo `_` (ex: `_isValidInput`)
  - Constantes: UPPER_SNAKE_CASE (quando apropriado)
  - Variáveis e funções: camelCase
- **Modularização**: Separar responsabilidades em funções pequenas e testáveis
- **JSDoc**: Documentar funções públicas e complexas

### Boas Práticas:
1. **DRY (Don't Repeat Yourself)**: Evitar duplicação de código
2. **Single Responsibility**: Cada função tem uma responsabilidade clara
3. **Guard Clauses (Early Return)**: Eliminar aninhamento de condicionais retornando cedo
4. **Strategy Pattern**: Usar object mapping para dispatch de handlers ao invés de if/else chains
5. **Error Handling**: Sempre prever e tratar erros apropriadamente
6. **Testabilidade**: Código deve ser facilmente testável
7. **Documentação**: Código auto-explicativo + comentários quando necessário

---

## Arquitetura do Código

### Camada LIB (`src/lib/parser.js`)
- **Responsabilidade única**: Parse de string para objeto
- **Sem I/O**: Não lê arquivos, não escreve arquivos
- **Stateless**: Funções puras quando possível
- **Exportação**: `module.exports = { parse }`

### Camada CLI (`src/cli/index.js`)
- **Responsabilidades**:
  - Parse de argumentos (CommanderJS)
  - Leitura de arquivos (Node.js fs)
  - Escrita de arquivos (quando `--output`)
  - Formatação de saída (pretty-print JSON)
  - Tratamento de erros de I/O
  - Mensagens coloridas (ChalkJS)
- **Chamada da LIB**: Importa e usa `parse()` da camada lib

### Entry Point (`bin/ini-parser.js`)
- **Responsabilidade**: Invocar CLI
- **Shebang**: `#!/usr/bin/env node`
- **Simples**: Apenas importa e executa CLI

---

## Padrões Arquiteturais Implementados

### Guard Clauses (Early Return)
**Objetivo**: Eliminar aninhamento de condicionais e melhorar legibilidade

**Aplicação no Parser**:
- Todas as funções usam retorno antecipado para casos especiais
- Nenhuma função deve ter mais de 1 nível de aninhamento
- Condicionais verificam casos de borda primeiro e retornam/continuam

**Exemplo**:
```javascript
// ❌ Evitar (nested if/else)
if (condition1) {
  if (condition2) {
    // código
  } else {
    // código
  }
}

// ✅ Preferir (guard clauses)
if (!condition1) return;
if (!condition2) return;
// código principal
```

### Strategy Pattern (Object Mapping)
**Objetivo**: Eliminar if/else chains usando dispatch via object lookup

**Aplicação no Parser**:
- `_createLineClassifier()`: Identifica o tipo de linha (SECTION, KEY_VALUE, etc.)
- `_createLineHandlers()`: Object mapping de tipo → handler function
- Dispatch: `handlers[lineType](line, state)`
- Zero if/else chains para controle de fluxo

**Exemplo**:
```javascript
// ❌ Evitar (if/else chain)
if (lineType === 'SECTION') {
  handleSection();
} else if (lineType === 'KEY_VALUE') {
  handleKeyValue();
} else if (lineType === 'COMMENT') {
  handleComment();
}

// ✅ Preferir (strategy pattern)
const handlers = {
  SECTION: handleSection,
  KEY_VALUE: handleKeyValue,
  COMMENT: handleComment
};
handlers[lineType]();
```

### Separation of Concerns
**Objetivo**: Separar identificação de execução

**Aplicação no Parser**:
- **LineClassifier**: Identifica o tipo de cada linha (classificação)
- **LineHandlers**: Executa a lógica apropriada para cada tipo (ação)
- **ParserState**: Centraliza estado mutável em um único objeto

**Benefícios Alcançados**:
- Complexidade ciclomática reduzida de 15+ para 2
- Código mais testável e manutenível
- Facilita adição de novos tipos de linha sem modificar lógica existente
- Zero nested conditionals

---

## Processo de Desenvolvimento

### Workflow Esperado:
1. **Estruturar projeto**: Criar diretórios e arquivos base
2. **Configurar package.json**: Definir scripts, dependências, bin
3. **Migrar parser existente**: De `ini-parser-util.js` para `src/lib/parser.js`
4. **Desenvolver CLI**: Implementar `src/cli/index.js` e `bin/ini-parser.js`
5. **Criar testes**: Fixtures + testes para lib e CLI
6. **Documentação**: README.md completo com exemplos
7. **Validação final**: Rodar testes, lint, e testar CLI localmente
8. **Publicação**: Preparar para NPM

### Scripts NPM Esperados:
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "lint": "eslint src/**/*.js test/**/*.js",
  "lint:fix": "eslint src/**/*.js test/**/*.js --fix",
  "format": "prettier --write \"src/**/*.js\" \"test/**/*.js\"",
  "format:check": "prettier --check \"src/**/*.js\" \"test/**/*.js\""
}
```

---

## Decisões Arquiteturais Importantes

### 1. Manter Simplicidade da LIB
A biblioteca não deve crescer em complexidade. Ela faz uma coisa e faz bem: parse de string INI para objeto JSON.

### 2. CLI como Camada Separada
O CLI é uma camada completamente separada que apenas usa a lib. Isso permite:
- Testar lib e CLI independentemente
- Reutilizar a lib em outros contextos
- Manter responsabilidades claras

### 3. Fixtures Otimizadas
Evitar proliferação de fixtures. Preferir:
- Fixtures reutilizáveis que testam múltiplos casos
- Templates dinâmicos quando necessário
- Simplicidade sobre quantidade

### 4. Compatibilidade TypeScript
Embora escrito em JavaScript, deve funcionar perfeitamente em projetos TypeScript. Considerar:
- JSDoc completo para inferência de tipos
- Possível adição de `index.d.ts` no futuro (não prioritário na v1.0.0)

### 5. Mensagens de Erro Descritivas
CLI deve sempre fornecer mensagens claras sobre o que deu errado e como corrigir.

---

## Referências e Recursos

### Documentação Oficial:
- **CommanderJS**: https://github.com/tj/commander.js
- **ChalkJS**: https://github.com/chalk/chalk
- **Jest**: https://jestjs.io/
- **ESLint**: https://eslint.org/
- **Prettier**: https://prettier.io/

### MCP Context7:
Sempre usar o MCP context7 para obter documentação atualizada de frameworks e ferramentas durante o desenvolvimento.

---

## Notas Finais para Agentes IA

### Princípios de Trabalho:
1. **Nunca deduza informações críticas** - Sempre pergunte quando houver dúvida
2. **Sempre explique o raciocínio** - Contextualize decisões técnicas
3. **Use MCP context7** - Mantenha-se atualizado com a documentação oficial
4. **Siga as convenções** - Código em en-US, comunicação em pt-BR
5. **Foque em qualidade** - Este é um projeto para a comunidade, deve ser profissional

### Abordagem Iterativa:
- Desenvolva incrementalmente
- Teste frequentemente
- Valide decisões com o desenvolvedor principal
- Mantenha a comunicação clara

### Objetivo Final:
Criar um pacote NPM de alta qualidade, bem testado, bem documentado e útil para a comunidade de desenvolvedores.

---

**Versão do Documento**: 1.1
**Data de Criação**: 2025-10-03
**Última Atualização**: 2025-10-04 (FASE 01 concluída - Guard Clauses + Strategy Pattern implementados)
