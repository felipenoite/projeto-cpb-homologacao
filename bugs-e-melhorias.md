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
Indica ausência de validação client-side do algoritmo Módulo 11 para CNPJ. Qualquer CNPJ numericamente inválido pode ser submetido ao backend sem filtro.

---

### BUG-002 — Campos de endereço não possuem validação de formato ou obrigatoriedade

| Campo | Valor |
|---|---|
| **Severidade** | Média |
| **Prioridade** | P2 |
| **Status** | Aberto |

**Descrição:**  
Os campos da seção de endereço (Logradouro, Número, Bairro) aceitam qualquer valor sem validação. É possível submeter o formulário com número como texto, logradouro com caracteres especiais, CEP com menos de 8 dígitos e bairro em branco.

**Passos para reproduzir:**
1. Acesse o formulário de Registrar Clube e desbloqueie os campos
2. No campo CEP, insira `abc`
3. No campo Número, insira `!@#$`
4. Deixe o campo Bairro em branco
5. Tente submeter o formulário

**Resultado esperado:**  
Erros de validação exibidos para cada campo com formato inválido.

**Resultado obtido:**  
O formulário aceita os valores sem exibir erros de validação nos campos de endereço.

---

### BUG-003 — Campo CEP não valida formato nem comprimento

| Campo | Valor |
|---|---|
| **Severidade** | Média |
| **Prioridade** | P2 |
| **Status** | Aberto |

**Descrição:**  
O campo CEP aceita qualquer texto (letras, caracteres especiais) e não rejeita CEPs com menos de 8 dígitos. Não há máscara obrigatória nem validação de formato `XXXXX-XXX`.

**Resultado esperado:**  
Campo com máscara `XXXXX-XXX`, aceitando apenas dígitos e rejeitando entradas com menos de 8 dígitos.

**Resultado obtido:**  
Qualquer string é aceita no campo CEP sem feedback de erro.

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

### MELHORIA-002 — Adicionar validação client-side de CNPJ (algoritmo Módulo 11)

| Campo | Valor |
|---|---|
| **Tipo** | Segurança / UX |
| **Impacto** | Alto |

**Situação atual:**  
O sistema envia o CNPJ ao backend sem validar matematicamente se os dígitos verificadores são corretos (ver BUG-001). A validação só ocorre no servidor, gerando uma chamada de rede desnecessária para CNPJs obviamente inválidos.

**Proposta:**  
Implementar validação do algoritmo Módulo 11 no frontend antes de habilitar o botão "Pesquisar" ou ao sair do campo CNPJ, fornecendo feedback imediato ao usuário.

---

### MELHORIA-003 — Adicionar validação client-side de CPF

| Campo | Valor |
|---|---|
| **Tipo** | Segurança / UX |
| **Impacto** | Alto |

**Situação atual:**  
Os campos de CPF (Presidente e Diretor) não validam o algoritmo Módulo 11 no frontend. CPFs inválidos geram chamadas desnecessárias ao backend.

**Proposta:**  
Implementar validação de CPF (algoritmo Módulo 11) nos campos de CPF do Presidente e Diretor, com feedback imediato ao usuário antes da consulta ao servidor.

---

### MELHORIA-004 — Validação e máscara no campo Número do endereço

| Campo | Valor |
|---|---|
| **Tipo** | UX / Qualidade de Dados |
| **Impacto** | Médio |

**Situação atual:**  
O campo Número aceita qualquer texto, incluindo caracteres especiais e letras. Endereços com números inválidos (ex: `!@#`) podem ser submetidos.

**Proposta:**  
Restringir o campo a dígitos e letras (para casos como "100-A" ou "S/N"), com comprimento máximo razoável (ex: 10 caracteres). Rejeitar campos vazios e valores com apenas caracteres especiais.

---

### MELHORIA-005 — Feedback visual de progresso no formulário multi-seção

| Campo | Valor |
|---|---|
| **Tipo** | UX |
| **Impacto** | Médio |

**Situação atual:**  
O formulário possui múltiplas seções (Dados do Clube, Endereço, Presidente, Diretor, Modalidades) sem qualquer indicador de progresso. O usuário não sabe quantas etapas faltam.

**Proposta:**  
Adicionar uma barra de progresso ou indicador de etapas (ex: "Passo 2 de 5") para orientar o usuário durante o preenchimento.

---

### MELHORIA-006 — Mensagem de sucesso mais informativa após envio

| Campo | Valor |
|---|---|
| **Tipo** | UX |
| **Impacto** | Baixo |

**Situação atual:**  
Após o envio do formulário, a mensagem de sucesso não informa o prazo ou próximos passos do processo de análise pelo CPB.

**Proposta:**  
Incluir na mensagem de sucesso: número de protocolo do cadastro, prazo estimado de análise e canal de contato para dúvidas.
