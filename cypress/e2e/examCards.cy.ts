describe('Exam Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait('@getExams');
    cy.fixture('exams.json').as('examData');
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
              .should('contain.text', exam.displayTime);
            cy.contains('Abgaben:')
              .next()
              .should('contain.text', exam.assignedStudents.length);
            cy.contains('Prüfungstyp:')
              .next()
              .should('contain.text', exam.examDisplay);
            cy.get('[class*="Chip"]').should('exist').and('be.visible');
          });
      });
    });
  });

  context('Filter functionality', function () {
    it('should filter by module', function () {
      // Open module filter dropdown
      cy.contains('Module');
      cy.contains('Module auswählen').parent().click();
      cy.get('ul[role="listbox"] > li').first().click();

      // Assert only exams with that module are visible
      cy.get('.MuiCard-root.MuiCard-vertical').within(() => {
        cy.contains('Module:').next().should('contain.text', 'Mathematics I');
      });
    });

    it('should filter by time', function () {
      // Open module filter dropdown
      cy.contains('Zeiten');
      cy.contains('Zeiten auswählen').parent().click();
      cy.get('ul[role="listbox"]:visible')
        .should('be.visible')
        .find('li')
        .first()
        .click();

      cy.get('.MuiCard-root.MuiCard-vertical')
        .should('have.length', 6)
        .first()
        .within(() => {
          cy.contains('Zeit in min:').parent().should('contain.text', '90');
        });
    });

    it('should filter by type', function () {
      cy.contains('Prüfungstypen');
      cy.contains('Prüfungstypen auswählen').parent().click();
      cy.get('ul[role="listbox"]:visible')
        .should('be.visible')
        .find('li')
        .first()
        .click();

      cy.get('.MuiCard-root.MuiCard-vertical')
        .should('have.length', 2)
        .first()
        .within(() => {
          cy.contains('Zeit in min:').parent().should('contain.text', '90');
        });
    });

    it('should filter by status', function () {
      cy.contains('Benotungs Status');
      cy.contains('Benotungs Status auswählen').parent().click();
      cy.get('ul[role="listbox"]:visible')
        .should('be.visible')
        .find('li')
        .last()
        .click();

      cy.get('.MuiCard-root.MuiCard-vertical')
        .should('have.length', 6)
        .first()
        .within(() => {
          cy.get('.MuiChip-label').should('contain.text', 'Unbenotet');
        });
    });
  });
});
