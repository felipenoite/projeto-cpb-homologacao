import './commands'

// Suprime erros de JS da SPA Angular para não interferir nos testes E2E
Cypress.on('uncaught:exception', () => false)
