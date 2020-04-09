declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(): Chainable<Function>;
    logout(): Chainable<Function>;
    frontpage(): Chainable<Function>;
    loginOther(): Chainable<Function>;
  }
}
