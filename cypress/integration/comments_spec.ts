import { loadQuestions, answerQuestions } from '../utils/utils';

const commentText = 'Dette er en kommentar';
const commentText2 = 'Dette er også en kommentar';

describe('comments', () => {
  before(() => {
    cy.login();
    cy.frontpage();
  });

  after(() => {
    cy.logout();
  });

  describe('write comments', () => {
    it('should navigate to quiz', () => {
      loadQuestions();
      answerQuestions();
    });

    it('should be able to open public comments', () => {
      cy.contains('a', 'offentlig').click();
    });

    it('should be able to write a public comments', () => {
      cy.get('textarea[name=comment]').type(commentText);
      cy.contains('button', 'Kommentér').click();
      cy.contains('p', commentText).should('exist');
      cy.get('textarea[name=comment]').type(commentText2);
      cy.contains('button', 'Kommentér').click();
      cy.contains('p', commentText2).should('exist');
    });

    it('should not be able to like own comment', () => {
      cy.get(':nth-child(1) > .content > .metadata > :nth-child(1) > .thumbs').should(
        'have.class',
        'disabled'
      );
    });

    it('should be able to delete a public comment', () => {
      cy.get('.comments > :nth-child(1)')
        .contains('a', 'Slet')
        .click();
      cy.contains('a', 'Ja').click();
      cy.contains('p', commentText).should('not.exist');
    });

    it('should be able to open private comments', () => {
      cy.contains('a', 'privat').click();
    });

    it('should be able to write a private comments', () => {
      cy.get('textarea[name=comment]').type(commentText);
      cy.contains('button', 'Kommentér').click();
      cy.contains('p', commentText).should('exist');
      cy.get('textarea[name=comment]').type(commentText2);
      cy.contains('button', 'Kommentér').click();
      cy.contains('p', commentText2).should('exist');
    });

    it('should be able to delete a private comment', () => {
      cy.get('.comments > :nth-child(1)')
        .contains('a', 'Slet')
        .click();
      cy.contains('a', 'Ja').click();
      cy.contains('p', commentText).should('not.exist');
    });
  });

  describe('user permissions on comments', () => {
    it('should be able to login other user', () => {
      cy.logout();
      cy.loginOther();
      cy.contains('button', 'fortsæt', { matchCase: false }).click();
    });

    it('should be able to open public comments', () => {
      cy.contains('a', 'offentlig').click();
    });

    it('should not be able to delete a public comment that is not owned', () => {
      cy.get('.comments > :nth-child(1)')
        .contains('a', 'Slet')
        .should('not.exist');
      cy.contains('a', 'Ja').should('not.exist');
      cy.contains('p', commentText2).should('exist');
    });

    it('should not be able to like others comment', () => {
      cy.get(':nth-child(1) > .content > .metadata > :nth-child(1) > .thumbs')
        .should('not.have.class', 'disabled')
        .click();
      cy.get('.metadata > :nth-child(1) > span').should('have.text', '1');
    });
  });
});
