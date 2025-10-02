# Naonair - Air Pays de la Loire 🎉

## Purpose
Naonair is an air quality monitoring application for the Pays de la Loire region, developed by Lonestone Studio. It consists of multiple components for tracking and displaying air quality data, points of interest (POIs), and navigation features.

## Tech Stack
- **API**: NestJS with PostgreSQL database, MikroORM for database management, JWT authentication
- **Mobile App**: React Native with Paper UI components
- **Backoffice**: React admin interface built with Vite and Material-UI
- **Shared DTOs**: TypeScript DTOs used across all applications

## Architecture
```
NAONAIR/
├── api/         # NestJS API
├── app/         # React-Native + Paper
├── backoffice/  # React + Vite + Material-UI
├── dtos/        # DTOs used for type safety between API and frontend apps
```

## Key Features
- Air quality monitoring and display
- POI (Points of Interest) management
- Navigation and route planning
- QR Code generation for POIs (recently added)
- Real-time notifications
- User location tracking

## Database
- PostgreSQL database running at localhost:5432
- Uses Docker for development environment
- MikroORM for migrations and ORM

## Authentication
- JWT token-based authentication
- 24-hour token expiration
- Login endpoint `/login` requires payload `{ pass: <secretKey> }`

## Development Environment
- Node.js >= 16.20.1 < 19.0.0 for API
- Node.js >= 18 for mobile app
- Docker for database services
- Uses npm link for DTOs package sharing