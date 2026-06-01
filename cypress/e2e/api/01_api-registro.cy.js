import LoginPage from '../../pages/LoginPage'
import ModalConfirmacaoPage from '../../pages/ModalConfirmacaoPage'
import FormularioClubePagePage from '../../pages/FormularioClubePagePage'

// Endpoints reais descobertos via análise do bundle Angular (chunk ClubeExternoModule)
const API_CNPJ  = '**/public/clubes/cnpj/**'
const API_CPF   = '**/public/clubes/gestor/**'
const API_MODAL = '**/public/clubes/modalidades**'

function abrirFormulario() {
  LoginPage.visit()
  LoginPage.clickRegistrarClube()
  ModalConfirmacaoPage.confirm()
  FormularioClubePagePage.formShouldBeVisible()
}

describe('API — Integrações HTTP: Endpoints do Registro de Clube', () => {

  // ─── GET /public/clubes/modalidades ─────────────────────────────────────────
  // Intercept configurado ANTES da navegação para capturar a chamada que ocorre
  // no onInit do componente Angular.

  context('GET /public/clubes/modalidades', () => {
    it('TC-001 | Formulário carrega lista de modalidades via GET ao ser aberto (200 OK)', () => {
      cy.intercept('GET', API_MODAL).as('getModalidades')

      LoginPage.visit()
      LoginPage.clickRegistrarClube()
      ModalConfirmacaoPage.confirm()

      cy.wait('@getModalidades').its('response.statusCode').should('eq', 200)
      cy.get('[id^="modalidade-"]').should('have.length.greaterThan', 0)
    })
  })

  // ─── GET /public/clubes/cnpj/{cnpj} ─────────────────────────────────────────

  context('GET /public/clubes/cnpj/{cnpj}', () => {
    beforeEach(abrirFormulario)

    it('TC-002 | Clicar em Pesquisar dispara GET com o CNPJ digitado na URL', () => {
      cy.intercept('GET', API_CNPJ).as('getCnpj')

      FormularioClubePagePage.fillCnpj('11222333000181')
      cy.contains('button', 'Pesquisar').first().click()

      cy.wait('@getCnpj')
        .its('request.url')
        .should('include', '11222333000181')
    })

    it('TC-003 | CNPJ não encontrado (404) exibe popup SweetAlert2 ao usuário', () => {
      cy.intercept('GET', API_CNPJ, { statusCode: 404, body: {} }).as('cnpjNaoEncontrado')

      FormularioClubePagePage.fillCnpj('11222333000181')
      cy.contains('button', 'Pesquisar').first().click()
      cy.wait('@cnpjNaoEncontrado')

      cy.get('.swal2-popup', { timeout: 8000 }).should('be.visible')
    })

    it('TC-004 | Erro de servidor (500) no lookup do CNPJ exibe popup de erro', () => {
      cy.intercept('GET', API_CNPJ, {
        statusCode: 500,
        body: { message: 'Internal Server Error' },
      }).as('erroCnpj')

      FormularioClubePagePage.fillCnpj('11222333000181')
      cy.contains('button', 'Pesquisar').first().click()
      cy.wait('@erroCnpj')

      cy.get('.swal2-popup', { timeout: 8000 }).should('be.visible')
    })
  })

  // ─── GET /public/clubes/gestor/{cpf} ────────────────────────────────────────
  // cpfPresidente só é habilitado após o formulário ser desbloqueado via CNPJ.
  // O setup usa cy.unlockForm() com CNPJ dinâmico (chamada real ao servidor).
  // O que está sendo testado aqui é o endpoint do CPF, não o do CNPJ.

  context('GET /public/clubes/gestor/{cpf}', () => {
    beforeEach(() => {
      abrirFormulario()
      cy.generateClubData().then((data) => {
        cy.unlockForm(data.cnpj)
      })
      cy.get(FormularioClubePagePage.inputCpfPresidente, { timeout: 15000 })
        .should('not.be.disabled')
    })

    it('TC-005 | CPF do Presidente não encontrado (404) exibe popup SweetAlert2', () => {
      cy.intercept('GET', API_CPF, { statusCode: 404, body: {} }).as('cpfNaoEncontrado')

      FormularioClubePagePage.fillCpfPresidente('11144477735')
      cy.get('button.btn-sm.btn-primary').filter(':contains("Pesquisar")').eq(1).click()
      cy.wait('@cpfNaoEncontrado')

      cy.get('.swal2-popup', { timeout: 8000 }).should('be.visible')
    })
  })
})
