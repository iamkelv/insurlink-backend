# InsureLink Backend

## Overview
InsureLink Backend is built with NestJS, TypeORM, and PostgreSQL. This guide provides setup instructions for local development and production deployment.

## Setup on Local Environment

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (version 20 or later)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. **Clone the Repository**
   ```sh
   git clone https://github.com/iamkelv/insurlink-backend.git
   cd insurelink
   ```

2. **Install Dependencies**
   ```sh
   pnpm install
   ```

3. **Set Up Environment Variables**
   ```sh
   cp .env.example .env
   ```
   Update the `.env` file with your configuration values.

### Running the Application

1. **Start the Database**
   ```sh
   docker-compose up -d
   ```

2. **Start the Application**
   ```sh
   pnpm run start:dev
   ```

The API will be available at `http://localhost:3000`.

**Note:** In development, database schema syncs automatically. In production, migrations run automatically on startup.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```plaintext
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USER=pg
DATABASE_PASSWORD=insurlink_password
DATABASE_NAME=insurlink

# JWT
JWT_SECRET=your-secret-key-here

# Application
PORT=3000
NODE_ENV=development
```


## Available Scripts

```sh
# Development
pnpm run start:dev      # Start in watch mode

# Production
pnpm run build          # Build the application
pnpm run start:prod     # Run production build
```

## License

This project is [UNLICENSED](LICENSE).
