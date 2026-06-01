import { fakerPT_BR as faker } from '@faker-js/faker'
import { generateValidCnpj, generateValidCpf } from './helpers/documentHelpers'

/**
 * Gera conjunto completo de dados dinâmicos mapeados para os campos reais do formulário.
 * Nomes das propriedades espelham os atributos name/id dos inputs descobertos via inspeção.
 */
Cypress.Commands.add('generateClubData', () => {
  const data = {
    // ─── Dados do Clube ──────────────────────────────────────────────────────
    cnpj: generateValidCnpj(),
    nomeCompletoClube: `Clube ${faker.company.name()} ${faker.number.int({ min: 1, max: 999 })}`,
    siglaClube: faker.string.alpha({ length: { min: 2, max: 5 }, casing: 'upper' }),
    emailClube: faker.internet.email({ provider: 'clubeteste.org.br' }).toLowerCase(),
    dataFundacao: faker.date
      .past({ years: 20, refDate: '2020-01-01' })
      .toLocaleDateString('pt-BR'),  // formato DD/MM/AAAA
    site: '',
    telefoneClube: faker.phone.number('(##) ####-####'),

    // ─── Endereço ────────────────────────────────────────────────────────────
    cep: '01310100',
    logradouro: 'Avenida Paulista',
    numero: faker.number.int({ min: 1, max: 9999 }).toString(),
    complemento: `Sala ${faker.number.int({ min: 1, max: 99 })}`,
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',

    // ─── Presidente ──────────────────────────────────────────────────────────
    cpfPresidente: generateValidCpf(),
    nomePresidente: faker.person.fullName({ sex: 'male' }),
    generoPresidente: 'Masculino',
    emailPresidente: faker.internet.email({ provider: 'gmail.com' }).toLowerCase(),
    dataNascPresidente: faker.date
      .birthdate({ min: 25, max: 70, mode: 'age' })
      .toLocaleDateString('pt-BR'),
    telefonePresidente: faker.phone.number('(##) ####-####'),
    celularPresidente: faker.phone.number('(##) #####-####'),
    dataEleicao: '01/01/2024',
    dataInicioMandato: '01/03/2024',
    dataTerminoMandato: '01/03/2028',

    // ─── Diretor ─────────────────────────────────────────────────────────────
    cpfDiretor: generateValidCpf(),
    nomeDiretor: faker.person.fullName({ sex: 'female' }),
    generoDiretor: 'Feminino',
    emailDiretor: faker.internet.email({ provider: 'hotmail.com' }).toLowerCase(),
    dataNascDiretor: faker.date
      .birthdate({ min: 25, max: 70, mode: 'age' })
      .toLocaleDateString('pt-BR'),
    telefoneDiretor: faker.phone.number('(##) ####-####'),
    celularDiretor: faker.phone.number('(##) #####-####'),
  }
  cy.wrap(data).as('clubData')
  return cy.wrap(data)
})

/**
 * Aguarda a rede estabilizar após interações no formulário.
 */
Cypress.Commands.add('waitForNetworkIdle', () => {
  cy.wait(300)
})

/**
 * Desbloqueia o formulário pesquisando um CNPJ e aguardando os campos serem habilitados.
 *
 * @param {string} [cnpj='11222333000181'] CNPJ a pesquisar.
 *   - Sem argumento: usa o CNPJ de homologação fixo (já existe no banco, útil nos
 *     testes que não se importam com o CNPJ específico).
 *   - Com argumento: usa o CNPJ passado (ex: dado dinâmico gerado por generateClubData).
 *     Neste caso o banco retorna 404 (CNPJ novo) → SweetAlert de "não encontrado" → ao
 *     confirmar, o formulário é liberado para o novo cadastro.
 */
Cypress.Commands.add('unlockForm', (cnpj = '11222333000181') => {
  cy.get('#cnpjClube', { timeout: 15000 }).should('be.visible').should('not.be.disabled')
    .clear().type(cnpj, { delay: 30 })
  cy.contains('button', 'Pesquisar').first().click()
  cy.wait(500)
  cy.get('body').then(($body) => {
    if ($body.find('button.swal2-styled').length > 0) {
      cy.get('button.swal2-styled').first().click()
      cy.get('.swal2-container', { timeout: 5000 }).should('not.exist')
    }
  })
  cy.get('#nomeCompletoClube', { timeout: 20000 }).should('not.be.disabled')
})
