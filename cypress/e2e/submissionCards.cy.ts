describe('Exam Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait('@getExams');
  });

  it('should open submission page when clicking presentation exam card', () => {
    cy.fixture('exams.json').then((examData) => {
      const presentationExam = examData.find(
        (exam) => exam.examType === 'PRESENTATION'
      );

      expect(presentationExam).to.exist;

      cy.url().then((url) => cy.log('🔍 Initial URL:', url));

      cy.get('.MuiCard-root.MuiCard-vertical')
        .contains('Presentation')
        .closest('.MuiCard-root')
        .as('presentationCard');

      cy.get('@presentationCard').click();

      cy.url().should('include', `/submissions/${presentationExam.uuid}`);

      cy.wait('@getSubmission');

      cy.contains('Erreichte Punkte').should('exist');
      cy.get('.MuiCard-root').should('have.length', 5);
    });
  });
});
