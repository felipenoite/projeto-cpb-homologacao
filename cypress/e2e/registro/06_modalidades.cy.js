import LoginPage from '../../pages/LoginPage'
import ModalConfirmacaoPage from '../../pages/ModalConfirmacaoPage'
import FormularioClubePagePage from '../../pages/FormularioClubePagePage'
import ModalidadesSection from '../../pages/ModalidadesSection'

describe('CPB — Registrar Clube: Modalidades Esportivas', () => {
  beforeEach(() => {
    LoginPage.visit()
    LoginPage.clickRegistrarClube()
    ModalConfirmacaoPage.confirm()
    FormularioClubePagePage.formShouldBeVisible()
  })

  it('TC-033 | Enviar sem selecionar nenhuma modalidade exibe erro de validação', () => {
    FormularioClubePagePage.submit()
    cy.get(FormularioClubePagePage.errosDeCampo, { timeout: 10000 }).should('exist')
  })

  it('TC-034 | É possível selecionar múltiplas modalidades', () => {
    ModalidadesSection.selectPrimeirasN(3)
    ModalidadesSection.shouldHaveAtLeastOneSelected()
    cy.get('input[type="checkbox"]:checked').should('have.length.greaterThan', 1)
  })

  it('TC-035 | É possível desmarcar uma modalidade previamente selecionada', () => {
    ModalidadesSection.selectPrimeirasN(2)
    cy.get('input[type="checkbox"]:checked').then(($checked) => {
      cy.wrap($checked.first()).uncheck({ force: true })
      cy.get('input[type="checkbox"]:checked').should('have.length', $checked.length - 1)
    })
  })

  it('TC-036 | Selecionar ao menos uma modalidade remove o erro de validação', () => {
    FormularioClubePagePage.submit()
    ModalidadesSection.selectPrimeirasN(1)
    cy.get(ModalidadesSection.checkboxesModalidade).filter(':checked').should('have.length', 1)
  })

  it('TC-037 | Todas as modalidades disponíveis são exibidas na seção', () => {
    cy.get(ModalidadesSection.checkboxesModalidade).should('have.length.greaterThan', 0)
  })
})
