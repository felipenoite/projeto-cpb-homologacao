const BasePage = require('./BasePage')

class ModalidadesSection extends BasePage {
  // IDs reais descobertos via inspeção: modalidade-0 até modalidade-27 (28 opções)
  get checkboxesModalidade() {
    return 'input[id^="modalidade-"]'
  }

  /**
   * Seleciona modalidades pelo texto do label associado.
   * @param {string[]} modalidades - ex: ['Atletismo', 'Natação']
   */
  selectModalidades(modalidades) {
    modalidades.forEach((modalidade) => {
      cy.contains('label', new RegExp(modalidade, 'i'))
        .invoke('attr', 'for')
        .then((forAttr) => {
          cy.get(`#${forAttr}`).check({ force: true })
        })
    })
  }

  /**
   * Seleciona os primeiros N checkboxes de modalidade disponíveis.
   */
  selectPrimeirasN(n = 1) {
    cy.get(this.checkboxesModalidade)
      .should('have.length.greaterThan', 0)
      .then(($boxes) => {
        const total = Math.min(n, $boxes.length)
        for (let i = 0; i < total; i++) {
          cy.wrap($boxes[i]).check({ force: true })
        }
      })
  }

  shouldHaveAtLeastOneSelected() {
    cy.get(`${this.checkboxesModalidade}:checked`).should('have.length.greaterThan', 0)
  }

  getTotalModalidades() {
    return cy.get(this.checkboxesModalidade)
  }
}

module.exports = new ModalidadesSection()
