import { loadQuestions, answerQuestions } from '../utils/utils';

describe('profile', () => {
  before(() => {
    cy.frontpage();
  });

  it('should load the profile page', () => {
    cy.login();
    loadQuestions();
    answerQuestions();
    cy.frontpage();
    cy.contains('a', 'bruger', { matchCase: false }).click();
    cy.url().should('contain', 'profil');
  });

  it('should have saved answered questions', () => {
    cy.get('div[class="ui statistic"]').should('not.contain', '0');
  });

  it('should be able to change semesters', () => {
    cy.contains('a', '7. semester', { matchCase: false }).click();
    cy.contains('a', '7. semester', { matchCase: false }).should('have.class', 'active');
    cy.contains('p', 'besvarede spørgsmål', { matchCase: false }).should('exist');
    cy.contains('a', '8. semester', { matchCase: false }).click();
    cy.contains('a', '7. semester', { matchCase: false }).should('not.have.class', 'active');
  });

  describe('answerDetails', () => {
    it('should open answerDetails', () => {
      cy.contains('button', 'detaljer', { matchCase: false }).first().click();
      cy.contains('th', 'spørgsmål', { matchCase: false }).should('exist');
    });

    it('should be able to sort the answerDetails table by correct', () => {
      cy.contains('button', 'altid rigtige', { matchCase: false }).click();
      cy.contains('span', '50%').should('not.exist');
      cy.contains('span', ' 0%').should('not.exist');
    });

    it('should be able to sort the answerDetails table by incorrect', () => {
      cy.contains('button', 'altid forkerte', { matchCase: false }).click();
      cy.contains('span', '100%').should('not.exist');
      cy.contains('span', '50%').should('not.exist');
    });

    it('should be able to sort the answerDetails table by mixed', () => {
      cy.contains('button', 'blandede', { matchCase: false }).click();
      cy.contains('span', '100%').should('not.exist');
      cy.contains('span', ' 0%').should('not.exist');
    });

    it('should be able to sort the answerDetails table by all', () => {
      cy.contains('button', 'vis alle', { matchCase: false }).click();
    });

    it('should be able to search the answerDetails table', () => {
      cy.get('input[placeholder="Søg..."]').type('search');
    });

    it('should close answerDetails', () => {
      cy.contains('button', 'detaljer', { matchCase: false }).first().click();
      cy.contains('th', 'spørgsmål', { matchCase: false }).should('not.exist');
    });
  });

  describe('tagDetails', () => {
    it('should be able to open tagDetails', () => {
      cy.contains('button', 'tag detaljer', { matchCase: false }).first().click();
      cy.contains('th', 'tag', { matchCase: false }).should('exist');
    });

    it('should be able to close tagDetails', () => {
      cy.contains('button', 'tag detaljer', { matchCase: false }).first().click();
      cy.contains('th', 'tag', { matchCase: false }).should('not.exist');
    });
  });

  describe('comments', () => {
    it('should be able to open public comments', () => {
      cy.get('div[class=title]').contains('offentlig', { matchCase: false }).click();
      cy.contains('th', 'kommentar', { matchCase: false }).should('exist');
    });

    it('should be able to close public comments', () => {
      cy.get('div[class="active title"]').contains('offentlig', { matchCase: false }).click();
      cy.contains('th', 'kommentar', { matchCase: false }).should('not.exist');
    });

    it('should be able to open private comments', () => {
      cy.get('div[class=title]').contains('privat', { matchCase: false }).click();
      cy.contains('th', 'kommentar', { matchCase: false }).should('exist');
    });

    it('should be able to close private comments', () => {
      cy.get('div[class="active title"]').contains('privat', { matchCase: false }).click();
      cy.contains('th', 'kommentar', { matchCase: false }).should('not.exist');
    });
  });

  describe('bookmarks', () => {
    it('should be able to open bookmarked questions', () => {
      cy.contains('p', 'bogmærk', { matchCase: false }).click();
    });

    it('should be able to close bookmarked questions', () => {
      cy.contains('p', 'bogmærk', { matchCase: false }).click();
    });
  });
});
