/**
 * Answers 3 questions
 */
export const answerQuestions = () => {
  cy.contains('button', 'A.').click();
  cy.get('.top-nav > .ui > :nth-child(3)').click();
  cy.contains('button', 'B.').click();
  cy.get('.top-nav > .ui > :nth-child(3)').click();
  cy.contains('button', 'C.').click();
  cy.get('.header > div').should('contain', 3);
};

export const loadQuestions = () => {
  cy.contains('5').click();
  cy.contains('Start!').click();
  cy.url().should('include', '/quiz');
  cy.get('.top-nav > .ui > .header', { timeout: 10000 }).should('not.contain', 0);
};
