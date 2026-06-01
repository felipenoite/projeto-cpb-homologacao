const BasePage = require('./BasePage')

class EnderecoSection extends BasePage {
  get inputCep()        { return '#cepClube' }
  get inputLogradouro() { return '#enderecoClube' }
  get inputNumero()     { return '#numeroClube' }
  get inputComplemento(){ return '#complementoClube' }
  get inputBairro()     { return '#bairroClube' }

  get ngSelectEstado()  { return '#estadoClube ng-select' }
  get ngSelectCidade()  { return '#cidadeClube ng-select' }

  get selectEstado()    { return this.ngSelectEstado }
  get inputCidade()     { return this.ngSelectCidade }

  fillCep(cep) {
    const cepLimpo = cep.replace(/\D/g, '')
    cy.get(this.inputCep, { timeout: 10000 })
      .should('be.visible')
      .should('not.be.disabled')
      .click()
      .clear()
      .type(cepLimpo, { delay: 80 })
      .blur()
  }

  fillLogradouro(logradouro) {
    this.clearAndType(this.inputLogradouro, logradouro)
  }

  fillNumero(numero) {
    this.clearAndType(this.inputNumero, numero)
  }

  fillComplemento(complemento) {
    this.clearAndType(this.inputComplemento, complemento)
  }

  fillBairro(bairro) {
    this.clearAndType(this.inputBairro, bairro)
  }

  fillEstado(estado) {
    this.selectNgOption(this.ngSelectEstado, estado)
  }

  fillCidade(cidade) {
    cy.get(this.ngSelectCidade, { timeout: 10000 })
      .should('not.have.class', 'ng-select-disabled')
      .click()
    cy.get('.ng-dropdown-panel .ng-option', { timeout: 10000 })
      .first()
      .click()
  }

  fillEndereco(data) {
    this.fillCep(data.cep)
    this.fillLogradouro(data.logradouro)
    this.fillNumero(data.numero)
    if (data.complemento) {
      this.fillComplemento(data.complemento)
    }
    this.fillBairro(data.bairro)
    this.fillEstado(data.estado)
    this.fillCidade(data.cidade)
  }
}

module.exports = new EnderecoSection()
