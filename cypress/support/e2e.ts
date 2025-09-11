// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

beforeEach(() => {
  cy.intercept('GET', 'http://localhost:8080/api/v1/lecturer/exams*', {
    fixture: 'exams.json',
  }).as('getExams');

  cy.intercept('GET', '**/lecturer/**', (req) => {
    console.log('🔍 Lecturer API request:', req.url);
    console.log('🔍 Method:', req.method);
    console.log('🔍 Full URL:', req.url);
  });

  cy.intercept('GET', '**/lecturer/exam/*/data', {
    fixture: 'submission.json',
  }).as('getSubmission');
});
