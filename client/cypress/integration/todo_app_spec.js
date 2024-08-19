import cy from 'cypress';

describe('Todo App', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
  
    it('allows users to add, complete, and delete tasks', () => {
      // Add a new task
      cy.contains('Add Task').click();
      cy.get('input[name="title"]').type('New E2E Task');
      cy.get('textarea[name="description"]').type('E2E Test Description');
      cy.contains('Save').click();
  
      // Verify the new task is added
      cy.contains('New E2E Task').should('be.visible');
  
      // Complete the task
      cy.get('input[type="checkbox"]').first().click();
  
      // Delete the task
      cy.contains('New E2E Task').parent().find('button[aria-label="Delete"]').click();
  
      // Verify the task is removed
      cy.contains('New E2E Task').should('not.exist');
    });
  });