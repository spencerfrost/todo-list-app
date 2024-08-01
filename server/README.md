# Database Naming Convention Guide

## General Rules
- Use snake_case for table and column names
- Use all lowercase letters
- Use full words rather than abbreviations where possible
- Be descriptive but concise

## Examples
- Good: user_accounts, first_name, last_login_date
- Avoid: userAccounts, firstName, lastlogindate

## Steps to Implement

1. Database Schema:
   - Rename columns: 
     - energyLevel -> energy_level
     - estimatedTime -> estimated_time
     - dueDate -> due_date

2. Knex Migration (if using Knex.js):
   ```javascript
   exports.up = function(knex) {
     return knex.schema.alterTable('tasks', function(table) {
       table.renameColumn('energyLevel', 'energy_level');
       table.renameColumn('estimatedTime', 'estimated_time');
       table.renameColumn('dueDate', 'due_date');
     });
   };

   exports.down = function(knex) {
     return knex.schema.alterTable('tasks', function(table) {
       table.renameColumn('energy_level', 'energyLevel');
       table.renameColumn('estimated_time', 'estimatedTime');
       table.renameColumn('due_date', 'dueDate');
     });
   };
   ```

3. Backend (Node.js/Express):
   - Update queries to use snake_case column names
   - If using an ORM, update model definitions

4. Frontend (React):
   - Update the Task interface in your API service file:
     ```typescript
     export interface Task {
       id: number;
       title: string;
       description: string;
       priority: "Low" | "Medium" | "High";
       estimated_time: number;
       due_date: string;
       category: string;
       location: string;
       energy_level: "Low" | "Medium" | "High";
     }
     ```
   - Update all references in your React components to use the new snake_case property names

5. API Layer:
   - If you have a separate API layer or service, update it to transform between snake_case (for database interactions) and camelCase (for frontend interactions) if necessary.

Remember to test thoroughly after making these changes, as they affect multiple layers of your application.