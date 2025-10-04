# FASE 02 - CLI + BIN

## Objetivo
Implementar a interface de linha de comando (CLI) e o entry point executável (BIN), permitindo que o parser INI seja usado como ferramenta standalone instalável globalmente.

---

## Subfase 2.1 - Estrutura Base do CLI

### Objetivo
Criar a estrutura básica do CLI com configuração de argumentos e flags usando CommanderJS.

### Ações
- [ ] Criar diretório `src/cli/`
- [ ] Criar arquivo `src/cli/index.js`
- [ ] Instalar dependências (commander, chalk)
- [ ] Importar CommanderJS e configurar programa base
- [ ] Definir nome, versão e descrição do programa
- [ ] Configurar argumento obrigatório `<file>` (caminho do arquivo INI)
- [ ] Configurar flag `--output <file>` (alias `-o`)
- [ ] Configurar flag `--meta`
- [ ] Configurar flag `--quiet` (alias `-q`)
- [ ] Configurar flag `--validate`
- [ ] Configurar `--help` e `--version` (automático no Commander)

---

## Subfase 2.2 - Implementação da Lógica do CLI

### Objetivo
Implementar a lógica de processamento do CLI, incluindo leitura de arquivos, chamada do parser e formatação de saída.

### Ações
- [ ] Importar biblioteca parser de `src/lib/parser.js`
- [ ] Importar módulos Node.js necessários (fs, path)
- [ ] Implementar função para validar existência do arquivo de entrada
- [ ] Implementar função para ler arquivo de entrada
- [ ] Implementar função para parsear conteúdo usando lib
- [ ] Implementar função para formatar JSON com pretty-print
- [ ] Implementar lógica de saída para stdout
- [ ] Implementar lógica de saída para arquivo (quando `--output`)
- [ ] Implementar lógica para flag `--quiet`
- [ ] Implementar lógica para flag `--validate`

---

## Subfase 2.3 - Tratamento de Erros e Mensagens

### Objetivo
Implementar tratamento robusto de erros com mensagens descritivas e coloridas usando ChalkJS.

### Ações
- [ ] Importar Chalk para colorização
- [ ] Implementar função para exibir erros (vermelho)
- [ ] Implementar função para exibir sucesso (verde)
- [ ] Implementar função para exibir warnings (amarelo)
- [ ] Implementar tratamento para arquivo não encontrado (exit code 1)
- [ ] Implementar tratamento para arquivo sem permissão de leitura (exit code 1)
- [ ] Implementar tratamento para erro ao escrever arquivo de saída (exit code 1)
- [ ] Implementar tratamento para argumentos inválidos (exit code 2)
- [ ] Garantir que todas as mensagens estão em inglês
- [ ] Testar mensagens de erro manualmente

---

## Subfase 2.4 - Entry Point Executável (BIN)

### Objetivo
Criar o entry point executável que será usado quando o pacote for instalado globalmente.

### Ações
- [ ] Criar diretório `bin/`
- [ ] Criar arquivo `bin/ini-parser.js`
- [ ] Adicionar shebang `#!/usr/bin/env node`
- [ ] Importar CLI de `src/cli/index.js`
- [ ] Chamar função principal do CLI
- [ ] Configurar `package.json` com campo `bin` apontando para `bin/ini-parser.js`
- [ ] Testar executável localmente usando `node bin/ini-parser.js`

---

## Subfase 2.5 - Criação de Fixtures para Testes do CLI

### Objetivo
Criar fixtures específicas para testar o CLI, incluindo cenários de sucesso e erro.

### Ações
- [ ] Reutilizar fixtures existentes de `test/__fixtures__/` quando possível
- [ ] Criar fixture para teste de saída em arquivo (`output-test.ini`)
- [ ] Criar fixture para teste de validação (`validate-test.ini`)
- [ ] Preparar diretório temporário para testes de escrita de arquivos
- [ ] Documentar fixtures específicas do CLI

---

## Subfase 2.6 - Implementação de Testes do CLI

### Objetivo
Implementar testes completos para o CLI, cobrindo todos os comandos, flags e cenários de erro.

### Ações
- [ ] Criar arquivo `test/cli/index.test.js`
- [ ] Configurar estrutura básica do teste (imports, describe blocks)
- [ ] Implementar testes para comando básico (arquivo -> stdout)
- [ ] Implementar testes para flag `--output` (saída em arquivo)
- [ ] Implementar testes para flag `--meta`
- [ ] Implementar testes para flag `--quiet`
- [ ] Implementar testes para flag `--validate`
- [ ] Implementar testes para combinações de flags
- [ ] Implementar testes para arquivo não encontrado (exit code 1)
- [ ] Implementar testes para arquivo sem permissão (exit code 1)
- [ ] Implementar testes para erro ao escrever arquivo de saída (exit code 1)
- [ ] Implementar testes para argumentos inválidos (exit code 2)
- [ ] Implementar testes para arquivo vazio
- [ ] Executar testes e garantir que todos passam

---

## Subfase 2.7 - Testes de Integração End-to-End

### Objetivo
Testar o CLI de forma integrada, simulando uso real via linha de comando.

### Ações
- [ ] Criar script de teste manual para instalação local (`npm link`)
- [ ] Testar comando `ini-parser <file>` localmente
- [ ] Testar comando `ini-parser <file> --output result.json`
- [ ] Testar comando `ini-parser <file> --meta`
- [ ] Testar comando `ini-parser <file> -o result.json --quiet`
- [ ] Testar comando `ini-parser --help`
- [ ] Testar comando `ini-parser --version`
- [ ] Testar comando `ini-parser nonexistent.ini` (erro esperado)
- [ ] Validar saída colorida no terminal
- [ ] Validar códigos de saída (exit codes)

---

## Subfase 2.8 - Validação e Ajustes Finais

### Objetivo
Validar o CLI completo, garantir qualidade do código e preparar para publicação.

### Ações
- [ ] Executar todos os testes (`npm test`)
- [ ] Executar coverage (`npm run test:coverage`) e revisar relatório
- [ ] Executar lint (`npm run lint`) e corrigir problemas
- [ ] Executar format check (`npm run format:check`)
- [ ] Revisar código completo do CLI para garantir qualidade
- [ ] Validar que todas as mensagens estão em inglês
- [ ] Validar que todas as mensagens de erro são descritivas
- [ ] Validar que cores (Chalk) estão sendo usadas apropriadamente
- [ ] Testar instalação local via `npm link`
- [ ] Validar campo `bin` no `package.json`

---

## Critérios de Conclusão da Fase 02

- ✅ CLI implementado em `src/cli/index.js` com todas as funcionalidades
- ✅ Entry point executável criado em `bin/ini-parser.js`
- ✅ Todas as flags e opções funcionando corretamente
- ✅ Tratamento de erros robusto com mensagens descritivas
- ✅ Mensagens coloridas usando ChalkJS
- ✅ Testes completos do CLI implementados
- ✅ Testes de integração end-to-end realizados
- ✅ Todos os testes passando
- ✅ Lint e format check sem erros
- ✅ CLI funcional e pronto para uso via `npm link`
- ✅ Campo `bin` configurado corretamente no `package.json`

---

## Próximos Passos
Após conclusão desta fase:
- Documentação completa (README.md, exemplos de uso, etc.)
- Preparação para publicação no NPM
- Validação final e release v1.0.0
