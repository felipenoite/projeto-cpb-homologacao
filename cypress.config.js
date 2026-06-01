const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://homologcadastroweb.cpb.org.br/cadastro-geral-web/',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/reports/screenshots',
    videosFolder: 'cypress/reports/videos',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
    requestTimeout: 20000,
    responseTimeout: 30000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
      timestamp: 'mmddyyyy_HHMMss',
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)
      if (config.env.baseUrl) {
        config.baseUrl = config.env.baseUrl
      }
      return config
    },
  },
  env: {
    homologUrl: 'https://homologcadastroweb.cpb.org.br/cadastro-geral-web/',
    testSlowdown: 30,
  },
})
