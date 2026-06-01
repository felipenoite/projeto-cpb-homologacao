const BasePage = require('./BasePage')

/**
 * O formulário possui 3 etapas de "unlock" via botão Pesquisar:
 * 1. Pesquisar CNPJ → habilita campos do clube + endereço + CPF do Presidente/Diretor
 * 2. Pesquisar CPF Presidente → habilita nome, email, telefone do Presidente
 * 3. Pesquisar CPF Diretor → habilita nome, email, telefone do Diretor
 */
class FormularioClubePagePage extends BasePage {
  // ─── Dados do Clube ───────────────────────────────────────────────────────
  get inputCnpj()              { return '#cnpjClube' }
  get inputnomeCompletoClube() { return '#nomeCompletoClube' }
  get inputSigla()             { return '#siglaClube' }
  get inputEmailClube()        { return '#emailClube' }
  get inputDataFundacao()      { return '#dataFundacaoClube' }
  get inputSite()              { return '#siteClube' }
  get inputTelefoneClube()     { return '#telefoneClube' }

  // Botões Pesquisar por posição (0=CNPJ, 1=CPF Presidente, 2=CPF Diretor)
  get btnsPesquisar()          { return 'button.btn-sm.btn-primary:contains("Pesquisar")' }

  // ─── Presidente ───────────────────────────────────────────────────────────
  get inputCpfPresidente()         { return '#cpfPresidente' }
  get inputNomePresidente()        { return '#nomePresidente' }
  get ngSelectGeneroPresidente()   { return '#generoPresidente ng-select' }
  get inputEmailPresidente()       { return '#emailPresidente' }
  get inputDataNascPresidente()    { return '#dataNascimentoPresidente' }
  get inputTelPresidente()         { return '#telefonePresidente' }
  get inputCelPresidente()         { return '#celularPresidente' }
  get inputDataEleicao()           { return '#dataEleicaoPresidente' }
  get inputDataInicioMandato()     { return '#dataInicioMandatoPresidente' }
  get inputDataTerminoMandato()    { return '#dataTerminoMandatoPresidente' }

  // ─── Diretor ──────────────────────────────────────────────────────────────
  get inputCpfDiretor()         { return '#cpfDiretor' }
  get inputNomeDiretor()        { return '#nomeDiretor' }
  get ngSelectGeneroDiretor()   { return '#generoDiretor ng-select' }
  get inputEmailDiretor()       { return '#emailDiretor' }
  get inputDataNascDiretor()    { return '#dataNascimentoDiretor' }
  get inputTelDiretor()         { return '#telefoneDiretor' }
  get inputCelDiretor()         { return '#celularDiretor' }

  // ─── Feedback ─────────────────────────────────────────────────────────────
  get mensagemSucesso() { return '.alert-success, [class*="success"], snack-bar-container' }
  get mensagemErro()    { return '.alert-danger, .alert-error, [class*="alert"][class*="error"]' }
  get errosDeCampo()    { return '.invalid-feedback, .text-danger, [class*="invalid"]' }

  // ─── Helpers internos ─────────────────────────────────────────────────────

  /**
   * Clica no botão Pesquisar de uma seção específica (por índice: 0=CNPJ, 1=Presidente, 2=Diretor).
   * Após o clique, descarta qualquer SweetAlert2 que o sistema exibir (ex: "CNPJ não cadastrado").
   * Aguarda o campo-sentinela ficar habilitado como confirmação do unlock dos campos.
   */
  _clickPesquisar(index, sentinelSelector) {
    cy.get('button.btn-sm.btn-primary').filter(':contains("Pesquisar")').eq(index).click()
    cy.wait(500)
    cy.get('body').then(($body) => {
      if ($body.find('button.swal2-styled').length > 0) {
        cy.get('button.swal2-styled').first().click()
        cy.get('.swal2-container', { timeout: 5000 }).should('not.exist')
      }
    })
    cy.get(sentinelSelector, { timeout: 20000 }).should('not.be.disabled')
  }

  // ─── Métodos de Preenchimento: Clube ──────────────────────────────────────
  fillCnpj(cnpj)               { this.clearAndType(this.inputCnpj, cnpj) }
  fillNomeCompletoClube(nome)  { this.clearAndType(this.inputnomeCompletoClube, nome) }
  fillSigla(sigla)             { this.clearAndType(this.inputSigla, sigla) }
  fillEmailClube(email)        { this.clearAndType(this.inputEmailClube, email) }
  fillDataFundacao(data)       { this.clearAndType(this.inputDataFundacao, data) }
  fillSite(site)               { this.clearAndType(this.inputSite, site) }
  fillTelefoneClube(tel)       { this.clearAndType(this.inputTelefoneClube, tel) }

  // ─── Métodos de Preenchimento: Presidente ─────────────────────────────────
  fillCpfPresidente(cpf)       { this.clearAndType(this.inputCpfPresidente, cpf) }
  fillNomePresidente(nome)     { this.clearAndType(this.inputNomePresidente, nome) }
  fillEmailPresidente(email)   { this.clearAndType(this.inputEmailPresidente, email) }
  fillDataNascPresidente(data) { this.clearAndType(this.inputDataNascPresidente, data) }
  fillTelPresidente(tel)       { this.clearAndType(this.inputTelPresidente, tel) }
  fillCelPresidente(cel)       { this.clearAndType(this.inputCelPresidente, cel) }
  fillDataEleicao(data)        { this.clearAndType(this.inputDataEleicao, data) }
  fillDataInicioMandato(data)  { this.clearAndType(this.inputDataInicioMandato, data) }
  fillDataTerminoMandato(data) { this.clearAndType(this.inputDataTerminoMandato, data) }

  fillGeneroPresidente(genero) {
    this.selectNgOption(this.ngSelectGeneroPresidente, genero)
  }

  // ─── Métodos de Preenchimento: Diretor ────────────────────────────────────
  fillCpfDiretor(cpf)          { this.clearAndType(this.inputCpfDiretor, cpf) }
  fillNomeDiretor(nome)        { this.clearAndType(this.inputNomeDiretor, nome) }
  fillEmailDiretor(email)      { this.clearAndType(this.inputEmailDiretor, email) }
  fillDataNascDiretor(data)    { this.clearAndType(this.inputDataNascDiretor, data) }
  fillTelDiretor(tel)          { this.clearAndType(this.inputTelDiretor, tel) }
  fillCelDiretor(cel)          { this.clearAndType(this.inputCelDiretor, cel) }

  fillGeneroDiretor(genero) {
    this.selectNgOption(this.ngSelectGeneroDiretor, genero)
  }

  // ─── Fluxos Completos por Seção ───────────────────────────────────────────

  /**
   * Preenche a seção Dados do Clube:
   * 1. Insere CNPJ → clica Pesquisar → aguarda unlock dos demais campos
   * 2. Preenche os campos habilitados
   */
  fillDadosClube(data) {
    this.fillCnpj(data.cnpj)
    this._clickPesquisar(0, this.inputnomeCompletoClube)
    this.fillNomeCompletoClube(data.nomeCompletoClube)
    this.fillSigla(data.siglaClube)
    this.fillEmailClube(data.emailClube)
    this.fillDataFundacao(data.dataFundacao)
    if (data.site) this.fillSite(data.site)
    this.fillTelefoneClube(data.telefoneClube)
  }

  /**
   * Preenche a seção Presidente:
   * 1. Insere CPF → clica Pesquisar → aguarda unlock de nome/email/telefone
   * 2. Preenche os campos habilitados
   */
  fillPresidente(data) {
    this.fillCpfPresidente(data.cpfPresidente)
    this._clickPesquisar(1, this.inputNomePresidente)
    this.fillNomePresidente(data.nomePresidente)
    this.fillGeneroPresidente(data.generoPresidente)
    this.fillEmailPresidente(data.emailPresidente)
    this.fillDataNascPresidente(data.dataNascPresidente)
    this.fillTelPresidente(data.telefonePresidente)
    this.fillCelPresidente(data.celularPresidente)
    this.fillDataEleicao(data.dataEleicao)
    this.fillDataInicioMandato(data.dataInicioMandato)
    this.fillDataTerminoMandato(data.dataTerminoMandato)
  }

  /**
   * Preenche a seção Diretor:
   * 1. Insere CPF → clica Pesquisar → aguarda unlock de nome/email/telefone
   * 2. Preenche os campos habilitados
   */
  fillDiretor(data) {
    this.fillCpfDiretor(data.cpfDiretor)
    this._clickPesquisar(2, this.inputNomeDiretor)
    this.fillNomeDiretor(data.nomeDiretor)
    this.fillGeneroDiretor(data.generoDiretor)
    this.fillEmailDiretor(data.emailDiretor)
    this.fillDataNascDiretor(data.dataNascDiretor)
    this.fillTelDiretor(data.telefoneDiretor)
    this.fillCelDiretor(data.celularDiretor)
  }

  /** Alias para compatibilidade com testes anteriores. */
  fillIdentificacao(data) {
    this.fillDadosClube(data)
  }

  submit() {
    cy.contains('button', 'Salvar', { timeout: 10000 }).should('be.visible').click()
  }

  shouldShowSucesso() {
    cy.get(this.mensagemSucesso, { timeout: 20000 }).should('be.visible')
  }

  shouldShowErro() {
    cy.get(this.mensagemErro, { timeout: 10000 }).should('be.visible')
  }

  shouldShowErrosDeCampo() {
    cy.get(this.errosDeCampo, { timeout: 10000 }).should('have.length.greaterThan', 0)
  }

  formShouldBeVisible() {
    cy.get(this.inputCnpj, { timeout: 20000 }).should('be.visible')
  }
}

module.exports = new FormularioClubePagePage()
