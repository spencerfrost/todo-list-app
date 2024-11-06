# Todo List App

## Overview
The Todo List App is a full-stack application designed to help users manage their tasks efficiently. The project is built using TypeScript with a React frontend and a Node.js/Express backend. It follows specific best practices for database naming conventions and offers a structured approach for managing tasks.

## Features
- **Frontend**: Developed with Create React App, featuring hot reloading, a built-in test runner, and production build optimizations.
- **Backend**: Built with Node.js and Express, following a clear guide for database naming conventions and schema migrations using Knex.js.
- **Database**: Implements a consistent naming convention for tables and columns, ensuring clarity and maintainability.
- **API Layer**: Provides a seamless interface between the frontend and backend, handling data transformation between database and client formats.

## Getting Started

### Prerequisites
- Node.js
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/spencerfrost/todo-list-app.git
   cd todo-list-app
   ```

2. Install dependencies for both client and server:
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

### Running the Application

#### Client
In the `client` directory, you can run:
- `npm start`: Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### Server
In the `server` directory, you can run:
- `npm start`: Starts the server on [http://localhost:3221](http://localhost:3221).

### Available Scripts

#### Client
In the `client` directory, you can run:
- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner in interactive watch mode.
- `npm run build`: Builds the app for production.
- `npm run eject`: Ejects the Create React App configuration for customization.

#### Server
- `npm start`: Starts the server.

## Database Naming Conventions
- Use snake_case for table and column names.
- Use all lowercase letters and full words rather than abbreviations.

### Migration Example (using Knex.js)
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

## Learn More
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)

## License
This project is licensed under the MIT License. 

For more details, please refer to the [LICENSE](LICENSE) file.