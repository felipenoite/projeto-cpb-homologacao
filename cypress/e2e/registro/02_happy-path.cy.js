import LoginPage from '../../pages/LoginPage'
import ModalConfirmacaoPage from '../../pages/ModalConfirmacaoPage'
import FormularioClubePagePage from '../../pages/FormularioClubePagePage'
import EnderecoSection from '../../pages/EnderecoSection'
import ModalidadesSection from '../../pages/ModalidadesSection'

describe('CPB — Registrar Clube: Fluxo Principal', () => {
  beforeEach(() => {
    cy.generateClubData()
    LoginPage.visit()
  })

  it('TC-006 | Clicar em "Registrar Clube" exibe o modal de aviso', () => {
    LoginPage.clickRegistrarClube()
    ModalConfirmacaoPage.shouldBeVisible()
    ModalConfirmacaoPage.shouldContainWarningText()
  })

  it('TC-007 | Confirmar o modal de aviso exibe o formulário de cadastro', () => {
    LoginPage.clickRegistrarClube()
    ModalConfirmacaoPage.shouldBeVisible()
    ModalConfirmacaoPage.confirm()
    FormularioClubePagePage.formShouldBeVisible()
  })

  it('TC-008 | URL muda após confirmar modal e abrir formulário', () => {
    LoginPage.clickRegistrarClube()
    ModalConfirmacaoPage.confirm()
    FormularioClubePagePage.formShouldBeVisible()
    cy.url().should('not.eq', Cypress.config('baseUrl'))
  })

  it('TC-009 | Cadastro completo com dados gerados dinamicamente', function () {
    cy.intercept('POST', '**/homologcadastroweb.cpb.org.br/**', {
      statusCode: 200,
      body: { success: true, id: 1, mensagem: 'Cadastro realizado com sucesso' },
    }).as('postCadastro')

    LoginPage.clickRegistrarClube()
    ModalConfirmacaoPage.confirm()
    FormularioClubePagePage.formShouldBeVisible()

    cy.unlockForm(this.clubData.cnpj)
    FormularioClubePagePage.fillNomeCompletoClube(this.clubData.nomeCompletoClube)
    FormularioClubePagePage.fillSigla(this.clubData.siglaClube)
    FormularioClubePagePage.fillEmailClube(this.clubData.emailClube)
    FormularioClubePagePage.fillDataFundacao(this.clubData.dataFundacao)
    FormularioClubePagePage.fillTelefoneClube(this.clubData.telefoneClube)

    EnderecoSection.fillEndereco(this.clubData)

    FormularioClubePagePage.fillPresidente(this.clubData)
    FormularioClubePagePage.fillDiretor(this.clubData)

    ModalidadesSection.selectPrimeirasN(1)

    FormularioClubePagePage.submit()
    FormularioClubePagePage.shouldShowSucesso()
  })

  it('TC-010 | Campo Nome do Clube é editável antes do envio', function () {
    LoginPage.clickRegistrarClube()
    ModalConfirmacaoPage.confirm()
    FormularioClubePagePage.formShouldBeVisible()
    cy.unlockForm(this.clubData.cnpj)

    FormularioClubePagePage.fillNomeCompletoClube(this.clubData.nomeCompletoClube)
    FormularioClubePagePage.fillNomeCompletoClube('Clube Editado Após Preenchimento')
    cy.get(FormularioClubePagePage.inputnomeCompletoClube)
      .invoke('val')
      .then((val) => expect(val.toLowerCase()).to.include('editado'))
  })
})
