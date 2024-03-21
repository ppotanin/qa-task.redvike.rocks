const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseURL: 'https://qa-task.redvike.rocks',
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
  },
});
