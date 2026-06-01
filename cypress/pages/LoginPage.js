const BasePage = require('./BasePage')

class LoginPage extends BasePage {
  // Seletores — ajustar após inspecionar DOM real com `cypress open`
  get btnRegistrarClube() {
    return 'button:contains("Registrar Clube"), a:contains("Registrar Clube"), [data-cy="btn-registrar-clube"]'
  }

  visit() {
    cy.visit('/')
  }

  clickRegistrarClube() {
    cy.contains('Registrar Clube', { timeout: 15000 }).should('be.visible').click()
  }
}

module.exports = new LoginPage()
