# Automação E2E — Registrar Clube (CPB)

Suíte de testes automatizados para a funcionalidade **Registrar Clube** do Sistema de Cadastro do Comitê Paralímpico Brasileiro (CPB), desenvolvida como parte de desafio técnico para a vaga de QA Sênior.

**Ambiente:** https://homologcadastroweb.cpb.org.br/cadastro-geral-web/

---

## Stack

| Ferramenta | Versão | Finalidade |
|---|---|---|
| Cypress | 13.x | Framework de automação E2E |
| @faker-js/faker | — | Geração de dados dinâmicos |
| cypress-mochawesome-reporter | — | Relatórios HTML |

---

## Clonar o repositório

```bash
git clone https://github.com/felipenoite/projeto-cpb-homologacao.git
cd projeto-cpb
```

---

## Pré-requisitos

- Node.js 18+
- npm 9+

```bash
npm install
```

---

## Executar os testes

**Uso local — limpa relatórios anteriores e roda tudo:**
```bash
npm run cy:run:clean
```

**Modo headless (CI/CD):**
```bash
npm run cy:run
```

**Modo interativo (debug):**
```bash
npm run cy:open
```

**Com browser visível (todos os specs em sequência):**
```bash
npm run cy:run:headed
```

**Apenas testes de registro:**
```bash
npm run cy:run:ui
```

**Apenas testes de API:**
```bash
npm run cy:run:api
```

**Limpar relatórios manualmente:**
```bash
npm run cy:clean
```

---

## Relatórios

Os relatórios HTML são gerados em `cypress/reports/` após cada execução headless (`cy:run` ou `cy:run:clean`). Para visualizar, abra o arquivo `.html` mais recente no navegador:

```bash
# Windows
start cypress\reports\index.html
```

> No modo interativo (`cy:open`) os relatórios HTML não são gerados automaticamente.

---

## Estrutura do projeto

```
cypress/
├── e2e/
│   ├── api/                # Testes de integração HTTP (executam primeiro)
│   │   └── 01_api-registro.cy.js
│   └── registro/           # Testes funcionais do formulário
│       ├── 02_happy-path.cy.js
│       ├── 03_validacao-campos.cy.js
│       ├── 04_cnpj-cpf.cy.js
│       ├── 05_cep-endereco.cy.js
│       └── 06_modalidades.cy.js
├── fixtures/
│   ├── clube-valido.json   # Dados fixos para testes
│   ├── cnpj-invalidos.json
│   └── modalidades.json
├── pages/                  # Page Object Model
│   ├── BasePage.js
│   ├── LoginPage.js
│   ├── ModalConfirmacaoPage.js
│   ├── FormularioClubePagePage.js
│   ├── EnderecoSection.js
│   └── ModalidadesSection.js
├── support/
│   ├── commands.js         # Comandos customizados Cypress
│   ├── e2e.js
│   └── helpers/
│       └── documentHelpers.js  # Geração de CNPJ/CPF válidos
└── reports/                # Relatórios e screenshots (gerados)
```

---

## Cobertura de testes

| Suíte | Arquivo | TCs | Foco |
|---|---|---|---|
| CT-001 | 01_api-registro | TC-001 a TC-005 | Integrações HTTP com o backend |
| CT-002 | 02_happy-path | TC-006 a TC-010 | Fluxo principal e navegação |
| CT-003 | 03_validacao-campos | TC-011 a TC-017 | Validação de campos obrigatórios |
| CT-004 | 04_cnpj-cpf | TC-018 a TC-026 | Validação de documentos |
| CT-005 | 05_cep-endereco | TC-027 a TC-032 | Preenchimento manual de endereço |
| CT-006 | 06_modalidades | TC-033 a TC-037 | Seleção de modalidades esportivas |

**Total: 37 casos de teste**

---

## Bugs e melhorias identificados

Ver [bugs-e-melhorias.md](bugs-e-melhorias.md) para lista completa. Principais achados:

- **BUG-001 (P1):** CNPJ `00000000000000` retorna "já cadastrado" em vez de erro de validação
- **BUG-002 (P2):** Validações incorretas nos campos de endereço — CEP aceita menos de 8 dígitos, Logradouro e Número aceitam qualquer caractere sem restrição, Bairro aceita números
- **BUG-003 (P2):** Campos "Nome Completo" aceitam qualquer caractere sem restrição (Presidência e Diretor)
- **BUG-004 (P2):** Campos de Email sem validação de formato em todas as seções (Clube, Presidência e Diretor) — qualquer string com `@` é aceita
- **MELHORIA-001:** Integração com ViaCEP para preenchimento automático de endereço
- **MELHORIA-002:** Suporte a CNPJ Alfanumérico (já em vigor no Brasil)
- **MELHORIA-003/004:** Padronização de campos de Nome e validação completa de e-mail

---

## Decisões de design

**Page Object Model (POM):** cada seção do formulário tem seu próprio Page Object. `EnderecoSection` e `ModalidadesSection` são separados de `FormularioClubePagePage` por terem responsabilidades distintas.

**Dados dinâmicos:** `cy.generateClubData()` gera CNPJ e CPF matematicamente válidos via algoritmo Módulo 11 a cada execução. O CNPJ gerado é usado em `cy.unlockForm(cnpj)` para garantir que o formulário seja desbloqueado com um CNPJ novo (não cadastrado), evitando conflitos com registros existentes no banco de homologação.

**Ordem de execução:** a pasta `api/` precede `registro/` alfabeticamente, garantindo que os testes de integração HTTP (CT-001) sempre executem primeiro.

**Testes de API com `cy.intercept()`:** os endpoints reais do backend (`GET /public/clubes/cnpj`, `GET /public/clubes/gestor`, `GET /public/clubes/modalidades`) foram descobertos via análise do bundle Angular. Os testes verificam que o frontend dispara as chamadas corretas e responde adequadamente a erros do servidor (404, 500).

**Unlock do formulário:** `cy.unlockForm(cnpj)` aceita um CNPJ opcional. Sem argumento usa `11222333000181` (CNPJ fixo de homologação). Com argumento usa o CNPJ dinâmico gerado pelo Faker — o backend retorna "não encontrado", o SweetAlert é descartado e o formulário é liberado para novo cadastro.

**Intercept no happy path:** o TC-009 usa `cy.intercept` para mockar a resposta do backend, evitando criar registros reais no banco de homologação a cada execução da suíte.
