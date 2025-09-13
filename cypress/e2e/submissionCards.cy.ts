describe('Exam Page Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait('@getExams');
  });

  it('should navigate to submissions page when clicking navigable exam cards', () => {
    cy.fixture('exams.json').then((examData) => {
      examData.forEach((exam, index) => {
        const navigableTypes = ['PRESENTATION', 'EXAM', 'ORAL'];

        if (navigableTypes.includes(exam.examType)) {
          cy.get('.MuiCard-root.MuiCard-vertical').eq(index).click();

          cy.url().should('include', `/submissions/${exam.uuid}`);

          cy.go('back');
        }
      });
    });
  });

  it('should not navigate when clicking non-navigable exam cards', () => {
    cy.fixture('exams.json').then((examData) => {
      examData.forEach((exam, index) => {
        const nonNavigableTypes = ['QUIZ', 'ASSIGNMENT'];

        if (nonNavigableTypes.includes(exam.examType)) {
          const currentUrl = cy.url();

          cy.get('.MuiCard-root.MuiCard-vertical').eq(index).click();

          cy.url().should('eq', currentUrl);
        }
      });
    });
  });

  it('should navigate to correct exam submission page', () => {
    cy.fixture('exams.json').then((examData) => {
      const presentationExam = examData.find(
        (exam) => exam.examType === 'PRESENTATION'
      );

      if (presentationExam) {
        cy.get('.MuiCard-root.MuiCard-vertical')
          .contains(presentationExam.name)
          .parent()
          .click();

        cy.url().should('include', `/submissions/${presentationExam.uuid}`);
      } else {
        cy.log(
          'No PRESENTATION exam found in fixture - skipping navigation test'
        );
      }
    });
  });
});
