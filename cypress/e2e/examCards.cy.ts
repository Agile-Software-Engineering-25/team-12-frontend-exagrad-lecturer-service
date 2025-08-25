describe('Exam Page', () => {
  it('should load the exam page', () => {
    cy.visit('/');
  });

  it('should display exams', () => {
    cy.visit('/');
    cy.wait('@getExams');

    cy.fixture('exams.json').then((examData) => {
      cy.get('.MuiCard-root.MuiCard-vertical').should(
        'have.length',
        examData.length
      );
    });

    it('should validate each exam card', () => {
      cy.fixture('exams.json').then((examData) => {
        examData.forEach((exam, index) => {
          cy.get('.MuiCard-root.MuiCard-vertical')
            .eq(index)
            .within(() => {
              cy.contains(exam.name).should('exist');
              cy.contains('Module:').next().should('contain.text', exam.module);
              cy.contains('Deadline:').next().should('contain.text', exam.date);
              cy.contains('Zeit in min:')
                .next()
                .should('contain.text', exam.time);
              cy.contains('Abgaben:')
                .next()
                .should('contain.text', exam.submissions);
            });
        });
      });
    });
  });
});
