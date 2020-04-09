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

  it('should close the new version popup', () => {
    cy.get('.close').click();
    cy.get('.close').should('not.exist');
  });

  it('should be able to pick semester', () => {
    cy.get('.selection').click();
    cy.get('.selection > .visible > :nth-child(2)').should('contain', 'semester');
    cy.get('.selection > .visible > :nth-child(2)').click();
    cy.get('div.text').should('contain', 'Abdomen');
    cy.get('div.text').should('not.contain', 'Inflammation');
  });
});

describe('authentication', () => {
  before(() => {
    cy.frontpage();
  });

  describe('create first user', () => {
    it('should be able to visit loginpage', () => {
      cy.contains('Log ind').click();
      cy.url().should('include', '/login');
    });

    it('should be able to visit register page', () => {
      cy.contains('Opret bruger').click();
      cy.url().should('include', '/opret');
    });

    it('should be able to register', () => {
      cy.get('Input[placeholder=Brugernavn]').type('example');
      cy.get('Input[placeholder=Email]').type('example@example.com');
      cy.get('Input[placeholder=Kodeord]').type('Password1');
      cy.get('Input[placeholder="Gentag kodeord"]').type('Password1');
      cy.wait(5000); // Username and email is being checked
      cy.contains('button', 'Opret').click();
      cy.wait(5000); // User is being registered
      cy.url().should('not.include', 'opret');
      cy.getCookie('user').should('be.ok');
    });

    it('should be able to logout', () => {
      cy.logout();
    });

    it('should be able to login', () => {
      cy.login();
      cy.logout();
    });
  });

  describe('create second user', () => {
    it('should be able to visit loginpage', () => {
      cy.contains('Log ind').click();
      cy.url().should('include', '/login');
    });

    it('should be able to visit register page', () => {
      cy.contains('Opret bruger').click();
      cy.url().should('include', '/opret');
    });

    it('should be able to register a second user', () => {
      cy.get('Input[placeholder=Brugernavn]').type('example2');
      cy.get('Input[placeholder=Email]').type('example2@example.com');
      cy.get('Input[placeholder=Kodeord]').type('Password2');
      cy.get('Input[placeholder="Gentag kodeord"]').type('Password2');
      cy.wait(5000); // Username and email is being checked
      cy.contains('button', 'Opret').click();
      cy.wait(5000); // User is being registered
      cy.url().should('not.include', 'opret');
      cy.getCookie('user').should('be.ok');
      cy.logout();
    });
  });
});
