# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a monorepo containing the Naonair Air Quality application with four main components:

- **api/**: NestJS API with PostgreSQL database, authentication, and MikroORM
- **app/**: React Native mobile app with Paper UI components
- **backoffice/**: React admin interface built with Vite and Material-UI
- **dtos/**: Shared TypeScript DTOs used across all applications

## Development Commands

### Initial Setup
```bash
# Start databases (PostgreSQL on localhost:5432)
docker-compose up -d

# Build DTOs first (required for all other apps)
cd dtos && yarn && yarn build

# Install dependencies and link DTOs in each app
cd api && yarn && npm link ../dtos
cd backoffice && yarn && npm link ../dtos
cd app && yarn && npm link ../dtos

# Configure API environment
cd api && cp .env.example .env
# Then fill in the required properties
```

### Running Applications
```bash
# API (NestJS)
cd api
yarn start          # Production mode
yarn start:dev      # Development with hot reload
yarn start:debug    # Debug mode

# Mobile App (React Native)
cd app
yarn start          # Start Metro server
yarn android        # Run on Android
yarn ios           # Run on iOS

# Backoffice (React + Vite)
cd backoffice
yarn start          # Development server
```

### Build Commands
```bash
# API
cd api && yarn build

# Backoffice
cd backoffice && yarn build

# DTOs (rebuild when changed)
cd dtos && yarn build
```

### Testing
```bash
# API
cd api
yarn test           # Unit tests
yarn test:watch     # Watch mode
yarn test:cov       # With coverage
yarn test:e2e       # End-to-end tests

# Mobile App
cd app && yarn test
```

### Linting
```bash
# API
cd api && yarn lint

# Mobile App
cd app && yarn lint
```

## Database Management

- Uses PostgreSQL via Docker (localhost:5432)
- MikroORM for database management
- Create migrations: `cd api && npx mikro-orm migration:create`
- Run migrations: `cd api && yarn mikro-orm:migrate`

## Environment Configuration

The project supports multiple environments:
- Production: baseUrl points to https://naonair-api-staging.onrender.com/
- Preprod: baseUrl points to https://naonair-api-preprod.onrender.com/
- Local: baseUrl points to http://localhost:3001/

Check `api/config.json` and `.env` files for current environment settings.

## Authentication

API uses JWT authentication with 24-hour token expiration. Login endpoint `/login` requires payload `{ pass: <secretKey> }`.

## DTOs System

The DTOs package is built and linked as a local dependency to share types between API and frontend apps. Always rebuild DTOs after changes: `cd dtos && yarn build`.

## Deployment

- Automatic deployment to Render when pushing to main branch
- Mobile apps require manual deployment via Fastlane: `cd app && yarn deploy`
- Tag releases with semantic versioning: `git tag -a vX.Y.Z -m "Description"`

## Node Version

- API requires Node.js >= 16.20.1 < 19.0.0
- App requires Node.js >= 18