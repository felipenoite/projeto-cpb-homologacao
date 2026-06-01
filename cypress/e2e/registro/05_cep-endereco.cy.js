import LoginPage from '../../pages/LoginPage'
import ModalConfirmacaoPage from '../../pages/ModalConfirmacaoPage'
import FormularioClubePagePage from '../../pages/FormularioClubePagePage'
import EnderecoSection from '../../pages/EnderecoSection'

/**
 * NOTA DE ANÁLISE — Seção de Endereço
 *
 * Esta suíte cobre dois tipos de cenário:
 *
 * 1. COMPORTAMENTO REAL (TC-027, TC-030, TC-031, TC-032)
 *    Verificam o que o sistema faz hoje: preenchimento manual dos campos.
 *    Estes testes passam e refletem comportamento correto.
 *
 * 2. DOCUMENTAÇÃO DE LACUNAS (TC-028, TC-029)
 *    Verificam ausências identificadas durante a exploração.
 *    Passam porque o sistema simplesmente não possui a funcionalidade —
 *    não porque o comportamento está correto.
 *    Ver: MELHORIA-001 e BUG-003 em bugs-e-melhorias.md
 */
describe('CPB — Registrar Clube: Endereço (Comportamento Atual + Lacunas Documentadas)', () => {
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

  // ─── Comportamento real ───────────────────────────────────────────────────

  it('TC-027 | Todos os campos de endereço podem ser preenchidos manualmente', () => {
    EnderecoSection.fillCep('01310100')
    EnderecoSection.fillLogradouro('Avenida Paulista')
    EnderecoSection.fillNumero('1578')
    EnderecoSection.fillComplemento('Sala 12')
    EnderecoSection.fillBairro('Bela Vista')
    EnderecoSection.fillEstado('SP')
    EnderecoSection.fillCidade('São Paulo')

    cy.get(EnderecoSection.inputLogradouro).invoke('val').should('eq', 'Avenida Paulista')
    cy.get(EnderecoSection.inputNumero).invoke('val').should('eq', '1578')
    cy.get(EnderecoSection.inputBairro).invoke('val').should('eq', 'Bela Vista')
  })

  it('TC-030 | Campos de endereço são editáveis após preencher o CEP', () => {
    EnderecoSection.fillCep('01310100')
    cy.get(EnderecoSection.inputLogradouro).should('not.be.disabled').should('not.have.attr', 'readonly')
    cy.get(EnderecoSection.inputBairro).should('not.be.disabled').should('not.have.attr', 'readonly')
  })

  it('TC-031 | Campo número pode ser preenchido após o CEP', () => {
    EnderecoSection.fillCep('01310100')
    EnderecoSection.fillNumero('999')
    cy.get(EnderecoSection.inputNumero).invoke('val').should('include', '999')
  })

  it('TC-032 | Endereço pode ser corrigido após preenchimento inicial', () => {
    EnderecoSection.fillLogradouro('Rua Errada')
    EnderecoSection.fillLogradouro('Avenida Paulista')
    cy.get(EnderecoSection.inputLogradouro).invoke('val').should('eq', 'Avenida Paulista')
  })

  // ─── Documentação de lacunas ──────────────────────────────────────────────

  it('TC-028 | [LACUNA] CEP não aciona preenchimento automático de endereço', () => {
    cy.log('MELHORIA-001: integração com ViaCEP não implementada.')
    cy.log('Este teste PASSA porque o sistema não possui a funcionalidade — não porque o comportamento é correto.')

    EnderecoSection.fillCep('01310100')

    cy.get(EnderecoSection.inputLogradouro)
      .invoke('val')
      .should('be.empty', 'Logradouro deveria ser preenchido automaticamente via ViaCEP, mas permanece vazio.')

    cy.get(EnderecoSection.inputBairro)
      .invoke('val')
      .should('be.empty', 'Bairro deveria ser preenchido automaticamente via ViaCEP, mas permanece vazio.')
  })

  it('TC-029 | [LACUNA] Campo CEP aceita valores sem validação de formato', () => {
    cy.log('BUG-003: o campo CEP não valida formato nem comprimento mínimo.')
    cy.log('Este teste PASSA porque não há validação — não porque o comportamento é correto.')

    cy.get(EnderecoSection.inputCep)
      .clear()
      .type('abc')
      .blur()

    cy.get('[class*="error"], [class*="invalid"], .mat-error', { timeout: 3000 })
      .should('not.exist', 'Deveria exibir erro de formato, mas nenhuma validação foi acionada.')
  })
})
