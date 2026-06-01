class BasePage {
  /**
   * Digita em um campo com delay realista entre teclas para evitar detecção anti-bot.
   */
  slowType(selector, text, options = {}) {
    const delay = Cypress.env('testSlowdown') || 80
    cy.get(selector, { timeout: 15000 })
      .should('be.visible')
      .click()
      .type(text, { delay, ...options })
  }

  clearAndType(selector, text) {
    const delay = Cypress.env('testSlowdown') || 80
    cy.get(selector, { timeout: 15000 })
      .should('be.visible')
      .clear()
      .type(text, { delay })
  }

  /**
   * Aguarda spinners/overlays de carregamento desaparecerem.
   * Ajustar seletor conforme o que o sistema usar de fato.
   */
  waitForPageReady() {
    cy.get('body').should('not.have.class', 'loading')
    cy.get('[class*="spinner"], [class*="loading"]', { timeout: 20000 }).should('not.exist')
  }

  selectOption(selector, value) {
    cy.get(selector, { timeout: 10000 }).should('be.visible').select(value)
  }

  /**
   * Seleciona um valor em componente ng-select do Angular.
   * Fluxo: abre o dropdown clicando no container → aguarda opções → clica na opção.
   * @param {string} selector - seletor que aponta para o elemento <ng-select>
   * @param {string} optionText - texto exato ou parcial da opção desejada
   */
  selectNgOption(selector, optionText) {
    cy.get(selector, { timeout: 10000 })
      .should('not.have.class', 'ng-select-disabled')
      .click()
      .find('.ng-input input')
      .type(optionText, { delay: 50 })
    cy.get('.ng-dropdown-panel .ng-option', { timeout: 10000 })
      .contains(new RegExp(optionText, 'i'))
      .click()
  }
}

module.exports = BasePage
