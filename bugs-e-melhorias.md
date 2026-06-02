# Bugs e Sugestões de Melhoria — Registrar Clube (CPB)

**Funcionalidade:** Registrar Clube  
**Ambiente:** Homologação — https://homologcadastroweb.cpb.org.br/cadastro-geral-web/  
**Data da exploração:** 2026-06-01  
**Analista:** QA Sênior

---

## Bugs Encontrados

### BUG-001 — CNPJ inválido (todos zeros) retorna "já cadastrado" em vez de erro de validação

| Campo | Valor |
|---|---|
| **Severidade** | Alta |
| **Prioridade** | P1 |
| **Status** | Aberto |

**Descrição:**  
Ao inserir o CNPJ `00.000.000/0000-00` (todos zeros) e clicar em "Pesquisar", o sistema retorna uma mensagem indicando que o CNPJ já está cadastrado. Este CNPJ é matematicamente inválido e jamais deveria alcançar a consulta ao banco de dados.

**Passos para reproduzir:**
1. Acesse o formulário de Registrar Clube
2. No campo CNPJ, insira `00000000000000`
3. Clique em "Pesquisar"

**Resultado esperado:**  
Mensagem de erro de validação: "CNPJ inválido" — sem nenhuma consulta ao banco.

**Resultado obtido:**  
O sistema retorna mensagem indicando que o CNPJ já está cadastrado, revelando que a validação matemática do CNPJ não ocorre antes da consulta ao banco de dados.

**Impacto:**  
Indica ausência de validação client-side do algoritmo Módulo 11 para CNPJ. Por algum BUG esse CNPJ foi cadastrado na base e deveria ser considerado inválido.

---

### BUG-002 — Validações de campo incorretas na seção de Endereço

| Campo | Valor |
|---|---|
| **Severidade** | Média |
| **Prioridade** | P2 |
| **Status** | Aberto |

**Descrição:**  
Múltiplos campos da seção de Endereço possuem validações de tipo incorretas ou ausentes, permitindo entradas incoerentes com a natureza de cada campo.

| Campo | Comportamento encontrado | Comportamento esperado |
|---|---|---|
| CEP | Aceita apenas números, porém sem comprimento mínimo — é possível inserir apenas 1 dígito | Exigir exatamente 8 dígitos |
| Endereço (Logradouro) | Aceita qualquer entrada (letras, números e caracteres especiais) sem restrição ou padrão definido | Aceitar letras, números e caracteres válidos de endereço, com validação mínima de formato |
| Número | Aceita qualquer entrada (letras, números e caracteres especiais) sem restrição ou padrão definido | Aceitar apenas números, com suporte opcional a letras para casos como "10-A" |
| Bairro | Aceita números | Aceitar apenas letras e caracteres textuais |

**Passos para reproduzir:**
1. Acesse o formulário de Registrar Clube e desbloqueie os campos de endereço (via consulta de CEP)
2. No campo CEP, insira `1` e tente avançar — o campo aceita sem erro de comprimento
3. No campo Endereço, insira `Rua das Flores`, `12345` e `!@#$%` — todos os valores são aceitos sem restrição
4. No campo Número, insira `100`, `abc` e `!@#$%` — todos os valores são aceitos sem restrição
5. No campo Bairro, insira `12345` — números são aceitos sem erro

**Resultado esperado:**  
Cada campo deve aceitar e rejeitar entradas conforme o tipo de dado esperado.

**Resultado obtido:**  
Os campos aceitam tipos de dados incorretos para a sua finalidade e rejeitam os tipos corretos.

---

### BUG-003 — Campo "Nome Completo" aceita caracteres numéricos

| Campo | Valor |
|---|---|
| **Severidade** | Média |
| **Prioridade** | P2 |
| **Status** | Aberto |

**Descrição:**  
Os campos de Nome Completo nas seções de Presidência e Diretor não possuem validação de tipo, aceitando qualquer entrada sem restrição — números, letras e caracteres especiais são todos permitidos em campos destinados a nomes de pessoas.

| Seção | Campo | Comportamento encontrado |
|---|---|---|
| Dados da Presidência | Nome Completo | Aceita qualquer entrada (letras, números e caracteres especiais) sem restrição |
| Dados do Diretor | Nome Completo | Aceita qualquer entrada (letras, números e caracteres especiais) sem restrição |

**Passos para reproduzir:**
1. Acesse a seção "Dados da Presidência"
2. No campo Nome Completo, insira `12345`, `João Silva` e `!@#$%` — todos os valores são aceitos sem erro
3. Acesse a seção "Dados do Diretor"
4. Repita o mesmo procedimento — comportamento idêntico

**Resultado esperado:**  
Campo Nome Completo deve aceitar apenas letras, espaços e caracteres de nome próprio (acentos, hífen).

**Resultado obtido:**  
O campo não possui qualquer restrição de tipo, aceitando números e caracteres especiais sem nenhum feedback de erro.

---

### BUG-004 — Campos de Email sem validação de formato em todas as seções

| Campo | Valor |
|---|---|
| **Severidade** | Média |
| **Prioridade** | P2 |
| **Status** | Aberto |

**Descrição:**  
Todos os campos de e-mail do formulário de cadastro não possuem validação de formato real. Qualquer string que contenha o caractere `@` é aceita como e-mail válido, sem verificar domínio, TLD ou estrutura mínima. O problema afeta as três seções que possuem campo de e-mail.

| Seção | Campo |
|---|---|
| Dados do Clube | Email |
| Dados da Presidência | Email |
| Dados do Diretor | Email |

**Passos para reproduzir:**
1. Acesse cada uma das seções listadas acima
2. No campo Email, insira `a@a` (sem domínio)
3. Tente avançar ou submeter

**Resultado esperado:**  
Validação de formato de e-mail exigindo estrutura `local@dominio.tld` — ex.: `nome@clube.com.br`.

**Resultado obtido:**  
Os campos aceitam qualquer valor contendo uma letra antes e depois do `@`, sem validar domínio ou TLD.

---

## Sugestões de Melhoria

### MELHORIA-001 — Integração com ViaCEP para preenchimento automático de endereço

| Campo | Valor |
|---|---|
| **Tipo** | UX / Performance |
| **Impacto** | Alto |

**Situação atual:**  
O campo CEP não possui integração com nenhuma API de consulta de endereços. O usuário precisa preencher manualmente logradouro, bairro, cidade e UF, aumentando o tempo de preenchimento e o risco de erros de digitação.

**Proposta:**  
Integrar com a API pública [ViaCEP](https://viacep.com.br/) (gratuita, sem autenticação). Ao sair do campo CEP (evento `blur`), consultar `https://viacep.com.br/ws/{cep}/json/` e preencher automaticamente logradouro, bairro, cidade e UF. Os campos preenchidos automaticamente devem ficar somente leitura, exceto número e complemento.

---

### MELHORIA-002 — Suporte a CNPJ Alfanumérico

| Campo | Valor |
|---|---|
| **Tipo** | Conformidade Legal |
| **Impacto** | Alto |

**Situação atual:**  
O campo CNPJ aceita apenas dígitos numéricos. A Receita Federal publicou normativa que institui o CNPJ Alfanumérico (com letras), com vigência já em curso no Brasil.

**Proposta:**  
Atualizar a máscara e a validação do campo CNPJ para aceitar o novo formato alfanumérico (letras maiúsculas e números), mantendo a estrutura de 14 caracteres. A lógica de validação matemática também deverá ser adaptada conforme o novo algoritmo da Receita Federal.

---

### MELHORIA-003 — Padronização dos campos de Nome para aceitar apenas letras

| Campo | Valor |
|---|---|
| **Tipo** | Qualidade de Dados / UX |
| **Impacto** | Médio |

**Situação atual:**  
Os campos de Nome Completo (Presidência e Diretor) não possuem restrição de tipo consistente, resultando nos comportamentos documentados no BUG-003.

**Proposta:**  
Padronizar todos os campos de nome próprio do formulário para aceitar exclusivamente letras, espaços, acentos e caracteres válidos em nomes (ex.: hífen, apóstrofo). Aplicar a mesma regra nos campos de Logradouro e Bairro para garantir consistência nos dados cadastrados.

---

### MELHORIA-004 — Validação completa de formato de e-mail

| Campo | Valor |
|---|---|
| **Tipo** | Qualidade de Dados / Segurança |
| **Impacto** | Médio |

**Situação atual:**  
O campo Email do Diretor aceita qualquer string com `@`, sem exigir domínio ou TLD (ver BUG-004). Endereços inválidos podem ser cadastrados, impedindo comunicações futuras com o clube.

**Proposta:**  
Implementar validação de formato RFC-compliant (ex.: regex ou biblioteca de validação de e-mail) que exija a estrutura `local@dominio.tld`. Exibir mensagem de erro imediata ao sair do campo com valor inválido.

---

### MELHORIA-005 — Validação de comprimento mínimo e máscara no campo Número do endereço

| Campo | Valor |
|---|---|
| **Tipo** | UX / Qualidade de Dados |
| **Impacto** | Médio |

**Situação atual:**  
O campo Número aceita qualquer entrada sem restrição de tipo ou comprimento (ver BUG-002). Não há máscara, limite de caracteres ou validação de formato definidos.

**Proposta:**  
Restringir o campo a dígitos (e opcionalmente letras para casos como "10-A" ou "S/N"), com comprimento máximo razoável (ex.: 10 caracteres). Rejeitar campos vazios e valores com apenas caracteres especiais.

---

### MELHORIA-006 — Feedback visual de progresso no formulário multi-seção

| Campo | Valor |
|---|---|
| **Tipo** | UX |
| **Impacto** | Médio |

**Situação atual:**  
O formulário possui múltiplas seções (Dados do Clube, Endereço, Presidente, Diretor, Modalidades) sem qualquer indicador de progresso. O usuário não sabe quantas etapas faltam.

**Proposta:**  
Adicionar uma barra de progresso ou indicador de etapas (ex: "Passo 2 de 5") para orientar o usuário durante o preenchimento.

---

### MELHORIA-007 — Mensagem de sucesso mais informativa após envio

| Campo | Valor |
|---|---|
| **Tipo** | UX |
| **Impacto** | Baixo |

**Situação atual:**  
Após o envio do formulário, a mensagem de sucesso não informa o prazo ou próximos passos do processo de análise pelo CPB.

**Proposta:**  
Incluir na mensagem de sucesso: número de protocolo do cadastro, prazo estimado de análise e canal de contato para dúvidas.
