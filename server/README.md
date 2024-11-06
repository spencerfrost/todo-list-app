# Todo List App - Server

This project is the backend part of the Todo List App, built with Node.js, TypeScript, and Express. It provides the server-side logic, APIs, and database interactions for the application.

## Features

- **Node.js**: Built using Node.js for server-side JavaScript execution.
- **TypeScript**: Strong typing for better development experience.
- **Express**: Web framework for building APIs and handling HTTP requests.
- **Database**: Uses Knex.js for database migrations and PostgreSQL for data storage.
- **Authentication**: Implements JWT for user authentication.
- **Environment Configuration**: Uses dotenv for managing environment variables.

## Prerequisites

- Node.js
- npm (Node Package Manager)
- PostgreSQL

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/spencerfrost/todo-list-app.git
   cd todo-list-app/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `server` directory and add your environment variables:
   ```env
    DB_HOST=
    DB_USER=
    DB_PASSWORD=
    DB_NAME=

    JWT_SECRET=
    PORT=3221
    ALLOWED_ORIGINS=http://localhost:3000
   ```

## Available Scripts

In the project directory, you can run:

- `npm start`: Starts the server in production mode.
- `npm run dev`: Starts the server in development mode with hot reloading using nodemon.
- `npm run build`: Compiles the TypeScript code into JavaScript.
- `npm run migrate`: Runs the latest database migrations.
- `npm run migrate:make`: Creates a new migration file.
- `npm run knex`: Runs Knex.js commands.
- `npm test`: Runs the test suite with Jest.

## Learn More

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express Documentation](https://expressjs.com/)
- [Knex.js Documentation](http://knexjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## License

This project is licensed under the ISC License. For more details, refer to the [LICENSE](../LICENSE) file.