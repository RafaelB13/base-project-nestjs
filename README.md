# NestJS Template

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NestJS](https://img.shields.io/badge/Framework-NestJS-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)

A robust and feature-rich starter template for building scalable server-side applications with NestJS. This template provides a solid foundation with a complete authentication system, database integration, file uploads, and a ready-to-use Docker environment.

## 🚀 Core Features

-   **Authentication**: Secure, token-based authentication using JWT and Passport.js.
-   **Two-Factor Authentication (2FA)**: Enhance security with time-based one-time passwords (TOTP) via authenticator apps.
-   **Authorization**: Role-based access control (RBAC) using Guards.
-   **Database Integration**: Pre-configured with TypeORM for PostgreSQL.
-   **Database Migrations**: Manage your database schema with TypeORM migrations.
-   **File Uploads**: Ready-to-use module for uploading files to cloud storage (e.g., AWS S3).
-   **Email Service**: Integrated email sending for notifications, 2FA setup, and more.
-   **Dockerized Environment**: Includes a multi-container Docker setup with hot-reloading for seamless development.
-   **Configuration Management**: Centralized and environment-aware configuration.
-   **Data Validation**: Automatic request payload validation using `class-validator` and `class-transformer`.
-   **Comprehensive Testing**: Setup for unit and end-to-end (E2E) tests with Jest.

## 🛠️ Technologies Used

-   **Framework**: NestJS
-   **Language**: TypeScript
-   **Database**: PostgreSQL
-   **ORM**: TypeORM
-   **Authentication**: Passport.js (JWT, Local strategies)
-   **Containerization**: Docker, Docker Compose
-   **Caching**: Redis
-   **Validation**: `class-validator`, `class-transformer`
-   **Testing**: Jest, Supertest

## Prerequisites

-   Node.js (v18 or higher)
-   Yarn or npm
-   Docker and Docker Compose

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install Dependencies

```bash
yarn install
# or
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and update it with your credentials.

```bash
cp .env.example .env
```
> **Note**: You will need to fill in your database credentials, JWT secrets, email server (SMTP) details, and AWS S3 credentials.

## 🏃 How to Run

### Local Development

1.  **Run Database Migrations**:
    ```bash
    yarn migration:run
    ```
2.  **Start the Application**:
    ```bash
    yarn start:dev
    ```
The API will be available at `http://localhost:3000`.

### Docker Development

The Docker environment includes the NestJS app, PostgreSQL, Redis, and PgAdmin.

1.  **Start the Docker containers**:
    ```bash
    npm run docker:dev
    ```
-   **API**: `http://localhost:3000`
-   **PgAdmin**: `http://localhost:8080`

For more details on the Docker setup, see the `DOCKER_README.md`.

## 📁 Project Structure

```
/
├── src/
│   ├── auth/             # Authentication, 2FA, Guards, Strategies
│   ├── users/            # User management (CRUD)
│   ├── database/         # TypeORM config, migrations, and seeding
│   ├── email/            # Email service module
│   ├── core/             # Core modules, interceptors, filters
│   └── main.ts           # Application entry point
├── test/                 # E2E and unit tests
├── scripts/              # Utility and setup scripts
├── docs/                 # API documentation (e.g., Postman)
├── .env.example          # Environment variables template
├── docker-compose.yml    # Docker configuration for development
└── Dockerfile            # Docker build instructions
```

## ✅ Testing

-   **Run all unit tests**:
    ```bash
    yarn test
    ```
-   **Run end-to-end (E2E) tests**:
    ```bash
    yarn test:e2e
    ```
-   **Generate test coverage report**:
    ```bash
    yarn test:cov
    ```

## 📄 License

This project is distributed under the MIT License. See `LICENSE` for more information.