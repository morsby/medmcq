import { loadQuestions, answerQuestions } from '../utils/utils';

describe('quiz', () => {
  after(() => {
    cy.frontpage();
  });

  it('should load 5 questions', () => {
    loadQuestions();
  });

  it('should answer questions', () => {
    answerQuestions();
  });

  it('should be able to open public comments', () => {
    cy.contains('offentlig').click();
    cy.contains('Skjul').should('exist');
    cy.contains('privat').should('not.exist');
  });

  it('should not be able to vote for tags, when not logged in', () => {
    cy.get('.ui > Icon > .up').should('not.exist');
    cy.get('.ui > Icon > .down').should('not.exist');
  });
});
