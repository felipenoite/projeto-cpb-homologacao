# Cenários de Teste — Registrar Clube (CPB)

**Funcionalidade:** Registrar Clube  
**Sistema:** Sistema de Cadastro — Comitê Paralímpico Brasileiro  
**Ambiente:** Homologação — https://homologcadastroweb.cpb.org.br/cadastro-geral-web/  
**Analista:** QA Sênior  
**Data:** 2026-06-01

---

## Fluxo de Acesso

1. Acessar a URL do sistema
2. Na tela de login, clicar em **Registrar Clube**
3. Ler e **confirmar** o aviso exibido no popup
4. Preencher e enviar o formulário de cadastro

---

## CT-001 — Testes de API (Integrações HTTP)

> Verificam as chamadas HTTP reais que o formulário Angular realiza contra os endpoints do backend.
> Usam `cy.intercept()` para observar requisições reais e simular respostas de erro sem depender do estado do servidor.
>
> Endpoints cobertos (descobertos via análise do bundle Angular):
> - `GET /public/clubes/modalidades`
> - `GET /public/clubes/cnpj/{cnpj}`
> - `GET /public/clubes/gestor/{cpf}`

### TC-001 | Formulário carrega lista de modalidades via GET ao ser aberto (200 OK)

**Dado** que o intercept de `GET /public/clubes/modalidades` está ativo  
**Quando** o usuário abre o formulário de cadastro  
**Então** a requisição é disparada e retorna 200, e os checkboxes de modalidade são exibidos

---

### TC-002 | Clicar em Pesquisar dispara GET com o CNPJ digitado na URL

**Dado** que o usuário digitou um CNPJ no campo correspondente  
**Quando** clica no botão "Pesquisar"  
**Então** uma requisição `GET /public/clubes/cnpj/{cnpj}` é enviada ao servidor

---

### TC-003 | CNPJ não encontrado (404) exibe popup SweetAlert2 ao usuário

**Dado** que o servidor retorna 404 para a busca do CNPJ  
**Quando** o usuário clica em "Pesquisar"  
**Então** um popup SweetAlert2 é exibido informando o erro

---

### TC-004 | Erro de servidor (500) no lookup do CNPJ exibe popup de erro

**Dado** que o servidor retorna 500 para a busca do CNPJ  
**Quando** o usuário clica em "Pesquisar"  
**Então** um popup SweetAlert2 é exibido (o sistema não exibe a mensagem técnica do servidor)

---

### TC-005 | CPF do Presidente não encontrado (404) exibe popup SweetAlert2

**Dado** que o servidor retorna 404 para a busca do CPF do Presidente  
**Quando** o usuário clica em "Pesquisar" na seção do Presidente  
**Então** um popup SweetAlert2 é exibido informando que o CPF não foi encontrado

---

## CT-002 — Fluxo Principal (Happy Path)

### TC-006 | Clicar em "Registrar Clube" exibe o modal de aviso

**Dado** que o usuário está na tela de login  
**Quando** clica no botão "Registrar Clube"  
**Então** um modal/popup de aviso é exibido com informações relevantes

---

### TC-007 | Confirmar o modal abre o formulário de cadastro

**Dado** que o modal de aviso está visível  
**Quando** o usuário clica em "Confirmar" (ou equivalente)  
**Então** o modal é fechado e o formulário de cadastro de clube é exibido

---

### TC-008 | URL muda após confirmar modal e abrir formulário

**Dado** que o usuário confirmou o modal de aviso  
**Então** a URL da página muda, indicando que o formulário de cadastro foi aberto

---

### TC-009 | Cadastro completo com dados válidos é aceito

**Dado** que o usuário está no formulário de cadastro  
**Quando** preenche todos os campos obrigatórios com dados válidos (nome do clube, CNPJ, e-mail, telefone, representante legal com CPF, endereço completo, modalidade esportiva)  
**E** clica em enviar  
**Então** uma mensagem de sucesso é exibida confirmando o envio do cadastro para análise

---

### TC-010 | Campos permanecem editáveis antes do envio

**Dado** que o formulário está preenchido  
**Quando** o usuário edita um campo já preenchido  
**Então** o novo valor é aceito e o campo reflete a edição

---

## CT-003 — Validação de Campos

### TC-011 | Formulário vazio não é enviado

**Dado** que o usuário está no formulário de cadastro  
**Quando** clica em enviar sem preencher nenhum campo  
**Então** mensagens de erro são exibidas indicando os campos obrigatórios

---

### TC-012 | Nome do clube com mais de 255 caracteres

**Dado** que o usuário está no campo "Nome do Clube"  
**Quando** digita uma string com 256 caracteres  
**Então** o campo trunca o valor ao limite máximo **ou** exibe mensagem de erro de comprimento máximo

---

### TC-013 | E-mail com formato inválido é rejeitado

**Dado** que o usuário preenche o campo de e-mail  
**Quando** insere um valor sem o caractere "@" (ex: "emailinvalido.com")  
**Então** uma mensagem de erro de formato inválido é exibida

---

### TC-014 | Telefone preenchido com letras é rejeitado

**Dado** que o usuário preenche o campo de telefone  
**Quando** insere apenas letras (ex: "abcdefghij")  
**Então** o campo exibe erro de validação

---

### TC-015 | Cancelar o modal retorna à tela de login

**Dado** que o modal de aviso está visível  
**Quando** o usuário clica em "Cancelar"  
**Então** o modal fecha e o botão "Registrar Clube" permanece visível na tela de login

---

### TC-016 | Campo e-mail não aceita espaços em branco

**Dado** que o usuário preenche o campo de e-mail  
**Quando** insere um e-mail com espaço (ex: "email invalido@teste.com")  
**Então** o campo exibe erro de formato inválido

---

### TC-017 | Somente o nome do clube preenchido ainda exibe erros

**Dado** que o usuário preenche apenas o campo "Nome do Clube"  
**Quando** clica em enviar  
**Então** erros dos demais campos obrigatórios são exibidos

---

## CT-004 — Validação de Documentos (CNPJ e CPF)

### TC-018 | CNPJ válido é aceito

**Dado** que o usuário preenche o campo CNPJ  
**Quando** insere um CNPJ com dígitos verificadores corretos  
**Então** o campo não exibe erro de validação

---

### TC-019 | CNPJ com todos zeros é rejeitado

**Dado** que o usuário preenche o campo CNPJ  
**Quando** insere "00000000000000"  
**Então** o campo exibe erro de CNPJ inválido

---

### TC-020 | CNPJ com todos dígitos iguais é rejeitado

**Dado** que o usuário preenche o campo CNPJ  
**Quando** insere "11111111111111"  
**Então** o campo exibe erro de CNPJ inválido

---

### TC-021 | CNPJ com dígito verificador errado é rejeitado

**Dado** que o usuário preenche o campo CNPJ  
**Quando** insere um CNPJ cujo dígito verificador não corresponde ao algoritmo Módulo 11  
**Então** o campo exibe erro de CNPJ inválido

---

### TC-022 | CNPJ com menos de 14 dígitos é rejeitado

**Dado** que o usuário preenche o campo CNPJ  
**Quando** insere apenas 13 dígitos  
**Então** o formulário não aceita o envio e exibe erro de comprimento

---

### TC-023 | CPF válido é aceito

**Dado** que o usuário preenche o campo CPF do representante  
**Quando** insere um CPF com dígitos verificadores corretos  
**Então** o campo não exibe erro de validação

---

### TC-024 | CPF com todos zeros é rejeitado

**Dado** que o usuário preenche o campo CPF  
**Quando** insere "00000000000"  
**Então** o campo exibe erro de CPF inválido

---

### TC-025 | CPF com dígito verificador inválido é rejeitado

**Dado** que o usuário preenche o campo CPF  
**Quando** insere um CPF cujo dígito verificador não corresponde ao algoritmo  
**Então** o campo exibe erro de CPF inválido

---

### TC-026 | Campo CNPJ aplica máscara de formatação

**Dado** que o usuário digita um CNPJ sem formatação (14 dígitos)  
**Quando** o campo perde o foco  
**Então** o valor é exibido no formato XX.XXX.XXX/XXXX-XX

---

## CT-005 — Endereço

> Esta suíte cobre dois tipos de cenário. Ver também `bugs-e-melhorias.md`.

### Comportamento Real (TC-027, TC-030, TC-031, TC-032)

Verificam o que o sistema faz hoje. Passam e refletem comportamento correto.

### TC-027 | Todos os campos de endereço podem ser preenchidos manualmente

**Dado** que o usuário está na seção de endereço  
**Quando** preenche CEP, logradouro, número, complemento, bairro, estado e cidade  
**Então** todos os campos aceitam os valores informados

---

### TC-028 | [LACUNA] CEP não aciona preenchimento automático de endereço

**Dado** que o usuário preenche o campo CEP  
**Quando** o campo perde o foco  
**Então** logradouro e bairro permanecem vazios — o teste passa, mas documenta a ausência da integração com ViaCEP

> Relacionado: **MELHORIA-001**

---

### TC-029 | [LACUNA] Campo CEP aceita valores sem validação de formato

**Dado** que o usuário digita `abc` no campo CEP  
**Quando** o campo perde o foco  
**Então** nenhuma mensagem de erro é exibida — o teste passa, mas documenta a ausência de validação

> Relacionado: **BUG-003**

---

### TC-030 | Campos de endereço são editáveis após preencher o CEP

**Dado** que o usuário preencheu o CEP  
**Então** os campos logradouro e bairro estão habilitados para edição manual

---

### TC-031 | Campo número pode ser preenchido após o CEP

**Dado** que o CEP foi informado  
**Quando** o usuário preenche o campo número  
**Então** o campo aceita o valor informado normalmente

---

### TC-032 | Endereço pode ser corrigido após preenchimento inicial

**Dado** que os campos de endereço foram preenchidos  
**Quando** o usuário edita um campo já preenchido  
**Então** o novo valor substitui o anterior

---

## CT-006 — Modalidades Esportivas

### TC-033 | Envio sem modalidade selecionada exibe erro

**Dado** que nenhuma modalidade esportiva foi selecionada  
**Quando** o usuário tenta enviar o formulário  
**Então** uma mensagem de erro indica que ao menos uma modalidade deve ser selecionada

---

### TC-034 | É possível selecionar múltiplas modalidades

**Dado** que o usuário está na seção de modalidades  
**Quando** marca mais de uma modalidade  
**Então** todas ficam marcadas simultaneamente

---

### TC-035 | É possível desmarcar uma modalidade

**Dado** que o usuário tem pelo menos duas modalidades marcadas  
**Quando** desmarca uma delas  
**Então** somente ela é desmarcada; as demais permanecem selecionadas

---

### TC-036 | Selecionar modalidade remove o erro de validação

**Dado** que o erro de "modalidade obrigatória" está visível  
**Quando** o usuário seleciona ao menos uma modalidade  
**Então** o erro desaparece

---

### TC-037 | Todas as modalidades são exibidas na lista

**Dado** que o formulário está carregado  
**Então** a seção de modalidades exibe ao menos uma opção disponível para seleção

---

## Matriz de Prioridades

| ID | Tipo | Prioridade |
|---|---|---|
| TC-001 a TC-005 | API — Integrações HTTP | P1 |
| TC-006, TC-007, TC-009 | Happy Path obrigatório | P1 |
| TC-008, TC-010 | Happy Path complementar | P2 |
| TC-011, TC-013, TC-017 | Validação obrigatória | P1 |
| TC-012, TC-014, TC-015, TC-016 | Validação complementar | P2 |
| TC-018 a TC-025 | Documentos (CNPJ/CPF) | P1 |
| TC-026 | Máscara UI | P2 |
| TC-027 a TC-032 | Endereço | P2 |
| TC-033, TC-034 | Modalidades | P1 |
| TC-035 a TC-037 | Modalidades edge cases | P2–P3 |
