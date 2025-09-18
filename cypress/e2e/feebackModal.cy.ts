describe('Feedback Modal', () => {
  beforeEach(() => {
    cy.fixture('exams.json').then((examData) => {
      const presentationExam = examData.find(
        (exam) => exam.examType === 'PRESENTATION'
      );
      expect(presentationExam, 'PRESENTATION exam should exist in fixture').to
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
    cy.contains('button', 'benoten').click();

    cy.get('input[placeholder="Punkte eingeben"]').type('10');
    cy.get('textarea[placeholder="Kommentar eingeben"]').type('Good work');

    cy.contains('button', 'Speichern').click();
    cy.contains('button', 'Speichern').should('not.exist');
    cy.contains('button', 'Fertig').should('be.visible');
  });

  it('should handle navigation between students', () => {
    cy.contains('button', 'benoten').click();
    cy.contains('button', 'Zurück').should('be.visible');
  });
});
