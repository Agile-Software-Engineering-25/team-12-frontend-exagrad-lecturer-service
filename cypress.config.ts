// cypress.config.ts or cypress.config.js

import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
  },

  video: true,
  screenshotOnRunFailure: true,

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
