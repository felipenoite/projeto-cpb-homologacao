const BasePage = require('./BasePage')

class ModalConfirmacaoPage extends BasePage {
  get modal() {
    return '[role="dialog"], .modal, .popup, mat-dialog-container, [class*="modal"]'
  }

  get btnConfirmar() {
    return 'button:contains("Confirmar"), button:contains("Continuar"), button:contains("Ok"), button:contains("Sim"), [data-cy="btn-confirmar"]'
  }

  get btnCancelar() {
    return 'button:contains("Cancelar"), button:contains("Não"), button:contains("Fechar"), [data-cy="btn-cancelar"]'
  }

  get textoAviso() {
    return '[role="dialog"] p, [role="dialog"] span, mat-dialog-container p, .modal-body'
  }

  shouldBeVisible() {
    cy.get(this.modal, { timeout: 10000 }).should('be.visible')
  }

  shouldContainWarningText() {
    cy.get(this.textoAviso, { timeout: 10000 }).should('exist')
  }

  confirm() {
    // Angular precisa de tempo para montar os event handlers do modal antes do clique.
    // Clicar imediatamente faz o handler de fechamento não executar corretamente.
    cy.wait(1500)
    cy.contains('Continuar', { timeout: 15000 }).should('be.visible').click()
    cy.wait(500)
  }

  cancel() {
    cy.contains('Cancelar', { timeout: 15000 }).should('be.visible').click()
    cy.get(this.modal, { timeout: 8000 }).should('not.exist')
  }
}

module.exports = new ModalConfirmacaoPage()
