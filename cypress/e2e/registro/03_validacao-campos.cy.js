import LoginPage from '../../pages/LoginPage'
import ModalConfirmacaoPage from '../../pages/ModalConfirmacaoPage'
import FormularioClubePagePage from '../../pages/FormularioClubePagePage'

describe('CPB — Registrar Clube: Validação de Campos Obrigatórios', () => {
  beforeEach(() => {
    cy.generateClubData()
    LoginPage.visit()
    LoginPage.clickRegistrarClube()
    ModalConfirmacaoPage.confirm()
    FormularioClubePagePage.formShouldBeVisible()
    cy.get('@clubData').then((data) => {
      cy.unlockForm(data.cnpj)
    })
  })

  it('TC-011 | Envio de formulário vazio exibe mensagens de erro em campos obrigatórios', () => {
    FormularioClubePagePage.submit()
    FormularioClubePagePage.shouldShowErrosDeCampo()
  })

  it('TC-012 | Nome do clube com mais de 255 caracteres é rejeitado ou truncado', () => {
    const nomeExcessivo = 'A'.repeat(256)
    FormularioClubePagePage.fillNomeCompletoClube(nomeExcessivo)
    FormularioClubePagePage.submit()
    cy.get(FormularioClubePagePage.inputnomeCompletoClube).then(($el) => {
      const valorAtual = $el.val()
      const erroVisivelOuTruncado =
        valorAtual.length < 256 ||
        Cypress.$('.invalid-feedback, .text-danger').length > 0
      expect(erroVisivelOuTruncado).to.be.true
    })
  })

  it('TC-013 | E-mail do clube com formato inválido é rejeitado', () => {
    FormularioClubePagePage.fillEmailClube('email-invalido-sem-arroba')
    FormularioClubePagePage.submit()
    FormularioClubePagePage.shouldShowErrosDeCampo()
  })

  it('TC-014 | Telefone do clube preenchido com letras exibe erro de validação', () => {
    FormularioClubePagePage.fillTelefoneClube('abcdefghij')
    FormularioClubePagePage.submit()
    FormularioClubePagePage.shouldShowErrosDeCampo()
  })

  it('TC-015 | Cancelar o modal de aviso retorna à tela de login', () => {
    cy.visit('/')
    LoginPage.clickRegistrarClube()
    ModalConfirmacaoPage.shouldBeVisible()
    ModalConfirmacaoPage.cancel()
    cy.contains('Registrar Clube', { timeout: 10000 }).should('be.visible')
  })

  it('TC-016 | Campo e-mail não aceita espaços em branco', () => {
    FormularioClubePagePage.fillEmailClube('email com espaco@teste.com')
    FormularioClubePagePage.submit()
    FormularioClubePagePage.shouldShowErrosDeCampo()
  })

  it('TC-017 | Envio com apenas nome do clube preenchido exibe erros nos demais campos', function () {
    FormularioClubePagePage.fillNomeCompletoClube(this.clubData.nomeCompletoClube)
    FormularioClubePagePage.submit()
    FormularioClubePagePage.shouldShowErrosDeCampo()
  })
})
