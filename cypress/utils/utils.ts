export const answerQuestions = () => {
  cy.get(':nth-child(2) > .fluid > :nth-child(3)').click();
  cy.get('.top-nav > .ui > :nth-child(3)').click();
  cy.get('.column > :nth-child(2) > .fluid > :nth-child(1)').click();
  cy.get('.top-nav > .ui > :nth-child(3)').click();
  cy.get('.fluid > :nth-child(5)').click();
  cy.get('.header > div').should('contain', 3);
};

export const loadQuestions = () => {
  cy.contains('5').click();
  cy.contains('Start!').click();
  cy.url().should('include', '/quiz');
  cy.get('.top-nav > .ui > .header', { timeout: 10000 }).should('contain', 5);
};
