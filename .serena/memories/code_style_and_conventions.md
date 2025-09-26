# Code Style and Conventions - Naonair

## Language
- Code and comments must always be in English
- French only in user-facing strings and documentation

## TypeScript Conventions
- Strict TypeScript configuration
- Interface definitions in dedicated files (e.g., `poi.ts`)
- Enums for categories (e.g., `POICategory`)
- Proper typing for all API responses and data structures

## File Organization
- **Actions**: Business logic in `actions/` folders (e.g., `poi.ts`, `favorites.ts`)
- **Components**: Atomic Design pattern
  - `atoms/`: Basic components (ARButton, ARMap)
  - `molecules/`: Composed components (ARHeader, ARFilter)
  - `organisms/`: Complex components (ARPollution, ARListItemPOI)
  - `templates/`: Page-level components (ARPOIDetails, NewsTemplate)
- **Types**: Shared interfaces in `types/` folders

## Naming Conventions
- **Components**: PascalCase with AR prefix (ARPOIDetails, ARButton)
- **Files**: Match component names (ARPOIDetails.tsx)
- **Enums**: PascalCase (POICategory)
- **Interfaces**: PascalCase (POI)
- **Functions**: camelCase (getAll, fetchAll)

## React Native Specific
- Use React Navigation for routing
- Paper UI components for styling
- StyleSheet.create for styles
- Functional components with hooks

## Backend (NestJS)
- Modular architecture in `modules/` folder
- Services for business logic
- Controllers for HTTP endpoints
- Entities with MikroORM decorators
- DTOs for data validation

## Git Conventions
- Use B-spot git user on b-spot repository
- Use ssh config for bspot user on b-spot repository
- Semantic commit messages

## Code Quality
- ESLint configuration in `.eslintrc.js`
- Prettier for code formatting
- No explicit comments unless required (as per CLAUDE.md instructions)