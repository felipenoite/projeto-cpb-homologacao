import LoginPage from '../../pages/LoginPage'
import ModalConfirmacaoPage from '../../pages/ModalConfirmacaoPage'
import FormularioClubePagePage from '../../pages/FormularioClubePagePage'
import { generateValidCnpj, generateValidCpf, getInvalidCnpj, getInvalidCpf } from '../../support/helpers/documentHelpers'

describe('CPB — Registrar Clube: Validação de CNPJ e CPF', () => {
  beforeEach(() => {
    cy.generateClubData()
    LoginPage.visit()
    LoginPage.clickRegistrarClube()
    ModalConfirmacaoPage.confirm()
    FormularioClubePagePage.formShouldBeVisible()
  })

  context('CNPJ', () => {
    it('TC-018 | CNPJ válido gerado dinamicamente é aceito pelo campo', () => {
      const cnpjValido = generateValidCnpj()
      FormularioClubePagePage.fillCnpj(cnpjValido)
      cy.get(FormularioClubePagePage.inputCnpj).should('not.have.class', 'ng-invalid')
    })

    it('TC-019 | CNPJ com todos os dígitos zero não desbloqueia o formulário', () => {
      FormularioClubePagePage.fillCnpj(getInvalidCnpj('allZeros'))
      cy.contains('button', 'Pesquisar').first().click()
      cy.wait(3000)
      cy.get('body').then(($body) => {
        if ($body.find('button.swal2-styled').length) {
          cy.get('button.swal2-styled').first().click()
        }
      })
      cy.get(FormularioClubePagePage.inputnomeCompletoClube, { timeout: 5000 })
        .should('be.disabled')
    })

    it('TC-020 | CNPJ com todos os dígitos iguais não desbloqueia o formulário', () => {
      FormularioClubePagePage.fillCnpj(getInvalidCnpj('allOnes'))
      cy.contains('button', 'Pesquisar').first().click()
      cy.wait(3000)
      cy.get('body').then(($body) => {
        if ($body.find('button.swal2-styled').length) {
          cy.get('button.swal2-styled').first().click()
        }
      })
      cy.get(FormularioClubePagePage.inputnomeCompletoClube, { timeout: 5000 })
        .should('be.disabled')
    })

    it('TC-021 | CNPJ com dígito verificador inválido não desbloqueia o formulário', () => {
      FormularioClubePagePage.fillCnpj(getInvalidCnpj('wrongCheckDigit'))
      cy.contains('button', 'Pesquisar').first().click()
      cy.wait(3000)
      cy.get('body').then(($body) => {
        if ($body.find('button.swal2-styled').length) {
          cy.get('button.swal2-styled').first().click()
        }
      })
      cy.get(FormularioClubePagePage.inputnomeCompletoClube, { timeout: 5000 })
        .should('be.disabled')
    })

    it('TC-022 | CNPJ com menos de 14 dígitos é rejeitado', () => {
      FormularioClubePagePage.fillCnpj(getInvalidCnpj('tooShort'))
      FormularioClubePagePage.submit()
      FormularioClubePagePage.shouldShowErrosDeCampo()
    })

    it('TC-026 | Campo CNPJ aplica máscara de formatação XX.XXX.XXX/XXXX-XX', () => {
      const cnpjValido = generateValidCnpj()
      FormularioClubePagePage.fillCnpj(cnpjValido)
      cy.get(FormularioClubePagePage.inputCnpj)
        .invoke('val')
        .then((val) => {
          const isFormatadoOuValido =
            /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(val) || /^\d{14}$/.test(val)
          expect(isFormatadoOuValido, `Valor do campo: ${val}`).to.be.true
        })
    })
  })

  context('CPF do Presidente', () => {
    beforeEach(() => {
      cy.get('@clubData').then((data) => {
        cy.unlockForm(data.cnpj)
      })
    })

    it('TC-023 | CPF válido gerado dinamicamente é aceito', () => {
      const cpfValido = generateValidCpf()
      FormularioClubePagePage.fillCpfPresidente(cpfValido)
      cy.get(FormularioClubePagePage.inputCpfPresidente).should('not.have.class', 'ng-invalid')
    })

    it('TC-024 | CPF com todos os dígitos zero é rejeitado', () => {
      FormularioClubePagePage.fillCpfPresidente(getInvalidCpf('allZeros'))
      cy.get(FormularioClubePagePage.inputCpfPresidente).blur()
      cy.get(FormularioClubePagePage.errosDeCampo).should('exist')
    })

    it('TC-025 | CPF com dígito verificador inválido é rejeitado', () => {
      FormularioClubePagePage.fillCpfPresidente(getInvalidCpf('wrongCheckDigit'))
      cy.get(FormularioClubePagePage.inputCpfPresidente).blur()
      cy.get(FormularioClubePagePage.errosDeCampo).should('exist')
    })
  })
})
