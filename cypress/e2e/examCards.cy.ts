describe('Exam Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait('@getExams');
  });

  it('should load the exam page', () => {
    cy.url().should('include', '/');
  });

  it('should display correct number of exams', () => {
    cy.fixture('exams.json').then((examData) => {
      cy.get('.MuiCard-root.MuiCard-vertical').should(
        'have.length',
        examData.length
      );
    });
  });

  it('should validate each exam card content', () => {
    cy.fixture('exams.json').then((examData) => {
      examData.forEach((exam, index) => {
        cy.get('.MuiCard-root.MuiCard-vertical')
          .eq(index)
          .within(() => {
            cy.contains(exam.name).should('exist');
            cy.contains('Module:').next().should('contain.text', exam.module);
            cy.contains('Deadline:')
              .next()
              .should('contain.text', exam.displayDate);
            cy.contains('Zeit in min:')
              .next()
              .should('contain.text', exam.time);
            cy.contains('Abgaben:')
              .next()
              .should('contain.text', exam.submissionsCount);
            cy.contains('Type:').next().should('contain.text', exam.examType);
          });
      });
    });
  });
});
