/**
 * Aguarda o valor de um campo estabilizar (parar de mudar).
 * Útil após preenchimento automático de CEP onde pode haver múltiplos re-renders.
 * @param {string} selector
 * @param {number} intervalMs
 */
function waitForValueStable(selector, intervalMs = 400) {
  cy.get(selector).then(($el) => {
    const initial = $el.val()
    cy.wait(intervalMs)
    cy.get(selector).should(($el2) => {
      expect($el2.val()).to.equal(initial)
    })
  })
}

module.exports = { waitForValueStable }
