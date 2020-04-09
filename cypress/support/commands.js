// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  cy.contains('Log ind').click();
  cy.url().should('include', '/login');
  cy.get('Input[placeholder=Brugernavn]').type('example');
  cy.get('Input[placeholder=Kodeord]').type('Password1');
  cy.contains('button', 'Log ind').click();
  cy.url().should('not.include', 'login');
  cy.getCookie('user').should('be.ok');
});

Cypress.Commands.add('loginOther', () => {
  cy.contains('Log ind').click();
  cy.url().should('include', '/login');
  cy.get('Input[placeholder=Brugernavn]').type('example2');
  cy.get('Input[placeholder=Kodeord]').type('Password2');
  cy.contains('button', 'Log ind').click();
  cy.url().should('not.include', 'login');
  cy.getCookie('user').should('be.ok');
});

Cypress.Commands.add('logout', () => {
  cy.contains('button', 'Log ud').click();
  cy.getCookie('user').should('not.be.ok');
});

Cypress.Commands.add('frontpage', () => {
  cy.get('header > div > a').click();
});
