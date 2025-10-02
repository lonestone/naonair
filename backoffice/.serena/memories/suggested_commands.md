# Suggested Commands for Naonair Development

## Initial Setup
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

## Running Applications
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

## Build Commands
```bash
# API
cd api && yarn build

# Backoffice
cd backoffice && yarn build

# DTOs (rebuild when changed)
cd dtos && yarn build
```

## Testing
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

## Linting
```bash
# API
cd api && yarn lint

# Mobile App  
cd app && yarn lint
```

## Database Management
```bash
# Create migration
cd api && npx mikro-orm migration:create

# Run migrations
cd api && yarn mikro-orm:migrate
```

## Deployment
```bash
# Mobile apps deployment
cd app && yarn deploy

# Tag releases
git tag -a vX.Y.Z -m "Description"
git push origin vX.Y.Z
```