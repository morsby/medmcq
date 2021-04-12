describe('authentication', () => {
  before(() => {
    cy.frontpage();
  });

  describe('create user with email', () => {
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
      cy.contains('button', 'Opret', { matchCase: false }).should('not.have.class', 'disabled');
      cy.contains('button', 'Opret', { matchCase: false }).click();
      cy.url().should('not.include', 'opret');
      cy.getCookie('user').should('be.ok');
    });

    it('should be able to logout', () => {
      cy.logout();
    });
  });

  describe('create user without email', () => {
    it('should be able to visit loginpage', () => {
      cy.contains('Log ind').click();
      cy.url().should('include', '/login');
    });

    it('should be able to visit register page', () => {
      cy.contains('Opret bruger').click();
      cy.url().should('include', '/opret');
    });

    it('should be able to register without using email', () => {
      cy.get('Input[placeholder=Brugernavn]').type('withoutEmail');
      cy.get('Input[placeholder=Kodeord]').type('Password1');
      cy.get('Input[placeholder="Gentag kodeord"]').type('Password1');
      cy.contains('button', 'Opret', { matchCase: false }).should('not.have.class', 'disabled');
      cy.contains('button', 'Opret', { matchCase: false }).click();
      cy.url().should('not.include', 'opret');
      cy.getCookie('user').should('be.ok');
    });

    it('should be able to logout', () => {
      cy.logout();
    });
  });
});
