# Task Completion Checklist

## Before Marking Task Complete

### Code Quality
1. Run linting in affected projects:
   - `cd api && yarn lint`
   - `cd app && yarn lint`
   - `cd backoffice && yarn lint`

2. Run tests for affected areas:
   - `cd api && yarn test`
   - `cd app && yarn test`

3. Build DTOs if modified:
   - `cd dtos && yarn build`

### Environment Checks
1. Verify environment configuration:
   - Check `.env` files are properly configured
   - Verify `baseUrl` in `api/config.json` matches intended environment

2. Database considerations:
   - Run migrations if schema changed: `cd api && yarn mikro-orm:migrate`
   - Verify Docker containers are running: `docker-compose up -d`

### Git Workflow
1. Use appropriate gitmoji in commit messages
2. Commit only when explicitly asked by user
3. Use semantic versioning for tags when deploying
4. Consider which branch to use (main for prod, develop for features)

### Documentation
1. Update CLAUDE.md if new commands or processes are added
2. Update relevant memory files if architecture changes
3. Don't create documentation files unless explicitly requested

### Mobile App Specific
1. Test on both iOS and Android if UI changes were made
2. Verify deep linking functionality if modified
3. Check that QR code scanning works properly

### API Specific  
1. Verify all endpoints return expected responses
2. Check authentication still works
3. Verify database connections and queries