# Code Style and Conventions for Naonair

## General Rules
- Code and code comments must always be in English
- Always use gitmoji for commits (https://gitmoji.dev/)
  - ✨ for feature commits
  - 🐛 for bug commits  
  - 🚀 for deploy commits
  - 💄 for UI commits
  - 📝 for documentation commits

## TypeScript/JavaScript
- Uses ESLint with TypeScript parser
- Prettier for code formatting with `endOfLine: 'auto'`
- No explicit function return types required
- No explicit module boundary types required
- `any` type allowed when needed

## File Structure
- DTOs are shared between all applications via npm link
- Must rebuild DTOs with `yarn build` after changes
- API uses MikroORM entities for database models
- React Native app uses Paper UI components
- Backoffice uses Material-UI components

## Naming Conventions
- Follow existing patterns in each project
- Use descriptive names for components and functions
- POI = Point of Interest (consistent terminology)

## Testing
- Jest for unit testing
- E2E tests for critical paths
- Coverage reports available

## Git Workflow
- Main branch: `main`
- Development branch: `develop` (usually used for PRs)
- Use semantic versioning for tags (vX.Y.Z)
- Automatic deployment to Render on main branch push

## Environment Management
- Multiple environments: local, preprod, prod
- Check baseUrl in api/config.json for current environment
- Local: http://localhost:3001/
- Preprod: https://naonair-api-preprod.onrender.com/  
- Prod: https://naonair-api-staging.onrender.com/