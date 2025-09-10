describe('Exam Page for Submission Page', () => {
  let examData;

  beforeEach(() => {
    cy.fixture('exams.json').then((data) => {
      examData = data;
    });
    cy.visit('/');
    cy.wait('@getExams');
  });

  it('should validate exam cards content', () => {
    examData.forEach((exam, index) => {
      cy.get('.MuiCard-root.MuiCard-vertical')
        .eq(index)
        .within(() => {
          cy.contains(exam.name).should('exist');
          cy.contains('Module:').next().should('contain.text', exam.module);
          cy.contains('Deadline:').next().should('contain.text', exam.date);
          cy.contains('Zeit in min:').next().should('contain.text', exam.time);
          cy.contains('Abgaben:')
            .next()
            .should('contain.text', exam.submissionsCount);
          cy.contains('Type:').next().should('contain.text', exam.examType);
        });
    });
  });

  it('should open submission page when clicking exam card', () => {
    const firstExam = examData[0];
    cy.contains(firstExam.name).click();
    cy.url().should('include', `/submissions/${firstExam.uuid}`);
    cy.wait('@getSubmission');
    cy.contains('Erreichte Punkte').should('exist');
  });
});
