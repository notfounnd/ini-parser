# CI/CD Strategy - @notfounnd/ini-parser

Estratégia de CI/CD definida para o projeto, baseada em Trunk-Based Development com release manual controlado.

---

## 🎯 Estratégia Geral

### Desenvolvimento
- **Trunk-Based Development**: master ← feature-branch → master
- **Branches efêmeras**: Features de curta duração (1-3 dias)
- **Squash merge obrigatório**: 1 feature = 1 commit semântico na master
- **Conventional Commits**: feat:, fix:, docs:, chore:, refactor:, test:

### Release
- **Trigger manual**: Você controla quando publicar (workflow_dispatch)
- **Artifact promovido**: Build único reutilizado (não rebuilda)
- **Versão automática**: Calculada baseada em Conventional Commits
- **CHANGELOG automático**: Gerado pelo release-it

---

## 🔄 Pipelines

### Pipeline 1: Feature Branches (CI)

**Trigger:** Push para qualquer branch (exceto master)

**Objetivo:** Validar código antes do merge

```yaml
Jobs:
  test-and-validate:
    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]
    steps:
      - Checkout code
      - Setup Node.js ${{ matrix.node-version }}
      - npm ci
      - npm run lint:check
      - npm run format:check
      - npm test
      - Upload coverage (Codecov/Coveralls)
```

**Tempo estimado:** 5-7 minutos (3 jobs paralelos)

**Garante:**
- ✅ Compatibilidade Node 18, 20, 22
- ✅ Code quality (lint + format)
- ✅ Testes passando em todas as versões

---

### Pipeline 2: Master (CI/CD)

**Trigger:** Push para master (via merge de feature PR)

**Objetivo:** Validar + criar artifact de produção

```yaml
Jobs:
  test-and-validate:
    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]
    steps:
      - Checkout code
      - Setup Node.js ${{ matrix.node-version }}
      - npm ci
      - npm run lint:check
      - npm run format:check
      - npm test
      - Upload coverage

  build-artifact:
    needs: test-and-validate
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js 22.x (LTS) ← FIXO
      - npm ci
      - npm pack (cria .tgz)
      - Upload artifact
        name: build-${{ github.sha }}
        path: '*.tgz'

  e2e-tests:
    needs: build-artifact
    runs-on: ubuntu-latest
    steps:
      - Download artifact
      - Setup Node.js 22.x (LTS)
      - npm link (usa artifact)
      - bash test/bin/e2e-test.sh
      - Verify 8/8 E2E tests pass
```

**Tempo estimado:** 7-9 minutos

**Garante:**
- ✅ Testes em matrix (18, 20, 22)
- ✅ Artifact de produção (Node 22 LTS)
- ✅ E2E tests validam artifact
- ✅ Artifact pronto para release

---

### Pipeline 3: Release (Manual)

**Trigger:** `workflow_dispatch` (botão manual)

**Input:** `dry-run` (boolean, opcional) - Preview sem executar

**Objetivo:** Publicar release controlado manualmente

```yaml
Jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      # 1. Download artifact validado do master
      - uses: actions/download-artifact@v4
        with:
          name: build-latest

      # 2. Checkout com histórico completo
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Precisa histórico para analisar commits

      # 3. Setup Node LTS
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: 'https://registry.npmjs.org'

      # 4. Install dependencies
      - run: npm ci

      # 5. Release-it (faz tudo)
      - name: Release
        run: |
          if [ "${{ inputs.dry-run }}" == "true" ]; then
            npx release-it --dry-run --ci
          else
            npx release-it --ci
          fi
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Tempo estimado:** 5-7 minutos

**O que release-it faz:**
1. Analisa commits desde último release
2. Calcula versão (MAJOR/MINOR/PATCH)
3. Atualiza `package.json`
4. Gera/atualiza `CHANGELOG.md`
5. Cria commit: `chore: release vX.Y.Z`
6. Cria tag: `vX.Y.Z`
7. Push para master
8. Publica NPM (usando artifact)
9. Cria GitHub Release

**Garante:**
- ✅ Versão calculada automaticamente
- ✅ CHANGELOG gerado automaticamente
- ✅ Artifact promovido (não rebuilda)
- ✅ NPM + GitHub Release publicados

---

## 🛠️ Ferramentas

### release-it

**Versão:** `^17.0.0` (ou latest)

**Plugin:** `@release-it/conventional-changelog`

**Instalação:**
```bash
npm install --save-dev release-it @release-it/conventional-changelog
```

**Configuração (`.release-it.json`):**
```json
{
  "git": {
    "commitMessage": "chore: release v${version}",
    "tagName": "v${version}",
    "requireCleanWorkingDir": false
  },
  "github": {
    "release": true,
    "releaseName": "Release v${version}"
  },
  "npm": {
    "publish": true,
    "publishArgs": ["--access", "public"]
  },
  "plugins": {
    "@release-it/conventional-changelog": {
      "preset": {
        "name": "conventionalcommits",
        "types": [
          {"type": "feat", "section": "Features"},
          {"type": "fix", "section": "Bug Fixes"},
          {"type": "docs", "section": "Documentation"},
          {"type": "chore", "section": "Miscellaneous Chores"},
          {"type": "refactor", "section": "Code Refactoring"},
          {"type": "test", "section": "Tests"}
        ]
      },
      "infile": "CHANGELOG.md"
    }
  }
}
```

---

## 📊 Versionamento Semântico

### Regras de Cálculo

Baseado em **Conventional Commits** desde o último release:

| Commit Type | Version Bump | Seção CHANGELOG |
|-------------|--------------|-----------------|
| `feat!:` ou `BREAKING CHANGE:` | **MAJOR** (2.0.0) | BREAKING CHANGES |
| `feat:` | **MINOR** (1.1.0) | Features |
| `fix:` | **PATCH** (1.0.1) | Bug Fixes |
| `docs:` | **PATCH** (1.0.1) | Documentation |
| `chore:` | **PATCH** (1.0.1) | Miscellaneous Chores |
| `refactor:` | **PATCH** (1.0.1) | Code Refactoring |
| `test:` | **PATCH** (1.0.1) | Tests |

### Prioridade de Bump

1. **MAJOR** se tem BREAKING CHANGE
2. **MINOR** se tem feat:
3. **PATCH** se tem fix/docs/chore/refactor/test

### Exemplo Prático

```
Último release: v1.0.0

Commits na master desde então:
1. feat: add multi-line support
2. docs: update README
3. fix: handle empty sections
4. feat: add .properties format
5. test: add edge case tests

Cálculo:
- Tem BREAKING? NÃO
- Tem feat? SIM (commits 1 e 4) → MINOR bump
- Versão calculada: 1.1.0

CHANGELOG gerado:
## [1.1.0] - 2025-01-07

### Features
- add multi-line support
- add .properties format

### Bug Fixes
- handle empty sections

### Documentation
- update README

### Tests
- add edge case tests
```

---

## 🏗️ Estratégia de Node.js

### Testes (Matrix)

**Versões:** 18.x, 20.x, 22.x

**Onde:** Feature CI e Master CI

**Motivo:** Garantir compatibilidade Node 18+ (package.json: `"engines": {"node": ">=18.0.0"}`)

### Build (LTS Fixo)

**Versão:** 22.x (LTS atual)

**Onde:** Master CI/CD (artifact) e Release

**Motivo:** Artifact de produção estável e confiável

### Resumo

| Pipeline | Testes | Build | Motivo |
|----------|--------|-------|--------|
| Feature CI | 18, 20, 22 (matrix) | - | Compatibilidade |
| Master CI/CD | 18, 20, 22 (matrix) | 22 (LTS) | Tests + artifact |
| Release | - | 22 (LTS) | Usa artifact |
| E2E Tests | 22 (LTS) | - | Valida artifact |

---

## 🔐 Secrets Necessários

### GitHub Secrets

**Repository Settings → Secrets and variables → Actions**

1. **NPM_TOKEN** (obrigatório)
   - Tipo: "Automation" (para CI/CD)
   - Gerar em: npmjs.com → Access Tokens
   - Formato: `npm_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

2. **GITHUB_TOKEN** (automático)
   - Criado automaticamente pelo GitHub Actions
   - Usado para criar releases e tags

---

## 📦 Artifact Strategy

### Promoção de Artifact

**Conceito:** Build único que é reutilizado (não rebuilda)

**Fluxo:**
1. **Master CI/CD** cria artifact (.tgz) com Node 22 LTS
2. Artifact é **uploadado** com ID único (`build-SHA`)
3. **E2E tests** validam o artifact
4. **Release workflow** baixa o artifact validado
5. **NPM publish** usa o artifact (não rebuilda)

**Benefícios:**
- ✅ Mesmo pacote testado é publicado
- ✅ Não há diferenças entre test e production
- ✅ Mais rápido (não rebuilda)
- ✅ Mais confiável (artifact já validado)

---

## 📋 Arquivos de Configuração

### Workflows GitHub Actions

```
.github/
└── workflows/
    ├── ci-feature.yml       # CI para feature branches
    ├── ci-master.yml        # CI/CD para master
    └── release.yml          # Release manual
```

### Configuração release-it

```
.release-it.json             # Configuração do release-it
```

### Configuração Dependabot (futuro)

```
.github/
└── dependabot.yml           # Configuração do Dependabot
```

---

## 🚀 Fluxo Completo (Diagrama)

```
┌─────────────────────────────────────────────────────────────────┐
│              TRUNK-BASED DEVELOPMENT + Release Manual            │
└─────────────────────────────────────────────────────────────────┘

1. Feature Branch (push)
   ↓
   [CI: Feature Branch]
   - Tests (Node 18, 20, 22 matrix) ← MATRIX
   - Lint + Format
   - Coverage
   ↓
   PR para master (require: CI passing em todas as versões)
   ↓

2. Master (merge/push de feature PR com squash)
   ↓
   [CI/CD: Master]
   - Tests (Node 18, 20, 22 matrix) ← MATRIX
   - Build Artifact (Node 22 LTS) ← LTS FIXO
   - E2E Tests (usa artifact, Node 22 LTS)
   ↓
   Artifact disponível: "build-SHA"
   ↓
   (Você pode fazer vários merges aqui)
   ↓

3. Release (trigger manual - workflow_dispatch)
   ↓
   Você clica "Run workflow" → opcional: dry-run checkbox
   ↓
   [Release Workflow]
   - Download artifact from master (último SHA)
   - release-it analisa commits
   - Calcula versão (MAJOR/MINOR/PATCH)
   - Gera CHANGELOG
   - Version bump + commit + tag + push
   ↓
   ┌─────────────────────┬─────────────────────┐
   │   NPM Publish       │  GitHub Release     │  (PARALELO)
   │   (principal)       │  (adicional)        │
   │   Usa artifact      │  Anexa artifact     │
   │   Node 22 LTS       │  Node 22 LTS        │
   └─────────────────────┴─────────────────────┘
   ↓
   ✅ Pacote publicado no NPM
   ✅ Release page criada no GitHub
   ✅ Master atualizado com nova versão
```

---

## ✅ Características da Estratégia

### Controle
- ✅ Você decide quando publicar (trigger manual)
- ✅ Pode juntar vários merges antes de release
- ✅ Dry-run disponível para preview

### Automação
- ✅ Versão calculada automaticamente
- ✅ CHANGELOG gerado automaticamente
- ✅ NPM + GitHub Release publicados automaticamente

### Qualidade
- ✅ Testes em matrix (18, 20, 22) garantem compatibilidade
- ✅ Artifact promovido (mesmo pacote testado)
- ✅ E2E tests validam artifact de produção
- ✅ Code quality (lint + format) em todas as pipelines

### Performance
- ✅ Jobs paralelos (matrix)
- ✅ Artifact reutilizado (não rebuilda)
- ✅ NPM + GitHub Release em paralelo

---

## 📌 Decisões Importantes

### 1. Squash Merge (Obrigatório)
- Configurar como padrão no GitHub
- Force sempre (desabilitar outros tipos de merge)
- Usa título do PR como mensagem do commit

### 2. Conventional Commits (Obrigatório)
- Todos os commits na master devem seguir o padrão
- Squash merge garante isso (título do PR = commit message)

### 3. Branch Protection (Master)
- Require PR before merging
- Require CI passing (todas as versões Node)
- Require conversation resolution
- Do not allow bypassing

### 4. Node.js Strategy
- **Testes:** Sempre matrix (18, 20, 22)
- **Build/Artifact:** Sempre LTS (22)
- Garante compatibilidade + estabilidade

---

## 🔄 Futuras Melhorias (Após v1.0.0)

### Dependabot + NCU
- Dependabot: PRs automáticos para updates
- NCU: Log de versões disponíveis
- Rodam em paralelo (segunda-feira, 9h)

### Coverage Tracking
- Codecov ou Coveralls integration
- Badge no README.md
- Fail PR se coverage cair

### Build Status Badge
- Badge no README.md
- Link para GitHub Actions

---

**Versão do Documento:** 1.0
**Data de Criação:** 2025-01-06
**Baseado em:** CI_CD_ANALISE.md v1.2
