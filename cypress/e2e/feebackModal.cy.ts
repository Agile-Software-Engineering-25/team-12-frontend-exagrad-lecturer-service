describe('Feedback Modal', () => {
  beforeEach(() => {
    cy.fixture('exams.json').then((examData) => {
      const presentationExam = examData.find(
        (exam) => exam.examType === 'PRAESENTATION'
      );
      expect(presentationExam, 'PRAESENTATION exam should exist in fixture').to
        .exist;

      cy.visit(`/submissions/${presentationExam.uuid}`);
      cy.get('button', { timeout: 10000 }).should('be.visible');
    });
  });

  it('should open feedback modal with correct content', () => {
    cy.contains('button', 'benoten').click();

    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('Usability Presentation').should('be.visible');

    cy.contains('Matrikelnummer').next().should('contain.text', '991122');
  });

  it('should calculate grade correctly when points are entered', () => {
    cy.contains('button', 'benoten').click();

    cy.get('input[placeholder="Punkte eingeben"]').type('10');
    cy.get('label').contains('Note').next().should('contain', '5');
  });

  it('should save feedback successfully', () => {
    cy.fixture('feedback.json').then((feedbackResponse) => {
      cy.intercept('POST', '**/api/v1/feedback', {
        statusCode: 201,
        body: feedbackResponse,
      }).as('saveFeedback');
    });

    cy.contains('button', 'benoten').click();
    cy.get('input[placeholder="Punkte eingeben"]').type('10');
    cy.get('textarea[placeholder="Kommentar eingeben"]').type('Good work');
    cy.contains('button', 'Speichern').click();

    cy.wait('@saveFeedback').then((interception) => {
      expect(interception.response).to.exist;
      expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
    });

    cy.contains('button', 'Fertig').should('be.visible');
    cy.contains('button', 'Zurück').should('be.visible');
    cy.contains('button', 'Speichern').should('not.exist');
  });
});
