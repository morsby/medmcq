// ***********************************************************
// This example support/index.js is processed and
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

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.Cookies.defaults({
  whitelist: 'user'
});

describe('setup', () => {
  it('should reset the database', () => {
    cy.exec('npm run db:reset');
  });

  it('should open the frontpage', () => {
    cy.visit('/');
  });

  it('should close the welcome popup', () => {
    cy.get('.Toastify__close-button').click();
    cy.get('.Toastify__close-button').should('not.exist');
  });

  it('should be able to pick semester', () => {
    cy.get('.selection').click();
    cy.get('.selection > .visible > :nth-child(2)').should('contain', 'semester');
    cy.get('.selection > .visible > :nth-child(2)').click();
    cy.get('div.text').should('contain', 'Abdomen');
    cy.get('div.text').should('not.contain', 'Inflammation');
  });
});
