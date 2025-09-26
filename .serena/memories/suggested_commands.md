# Suggested Commands for Naonair Development

## Initial Setup
```bash
# Start databases
docker-compose up -d

# Build DTOs first (required)
cd dtos && yarn && yarn build

# Install and link DTOs in each app
cd api && yarn && npm link ../dtos
cd backoffice && yarn && npm link ../dtos  
cd app && yarn && npm link ../dtos

# Setup API environment
cd api && cp .env.example .env
```

## Development Commands

### API (NestJS)
```bash
cd api
yarn start          # Production
yarn start:dev      # Development with hot reload
yarn start:debug    # Debug mode
yarn build          # Build
yarn test           # Unit tests
yarn test:e2e       # E2E tests
yarn lint           # Linting
```

### Mobile App (React Native)
```bash
cd app
yarn start          # Metro server
yarn android        # Run Android
yarn ios           # Run iOS
yarn test           # Tests
yarn lint           # Linting
yarn deploy         # Deploy via Fastlane
```

### Backoffice (React)
```bash
cd backoffice
yarn start          # Development server
yarn build          # Build for production
```

### DTOs
```bash
cd dtos
yarn build          # Build DTOs (run after changes)
```

## Database
```bash
cd api
npx mikro-orm migration:create  # Create migration
yarn mikro-orm:migrate          # Run migrations
```