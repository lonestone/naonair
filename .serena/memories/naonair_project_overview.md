# Naonair Project Overview

## Purpose
Naonair is an air quality monitoring mobile application for the Pays de la Loire region. It provides real-time air quality information for Points of Interest (POI) and allows users to find clean air routes for outdoor activities.

## Tech Stack
- **Mobile App**: React Native with TypeScript, React Navigation, React Native Paper UI
- **API**: NestJS with TypeScript, PostgreSQL, MikroORM 
- **Admin Interface**: React with Vite, Material-UI
- **Shared Types**: DTOs package with TypeScript
- **Data Source**: GeoServer for POI data (`aireel:poi_data`)
- **Maps**: MapLibre GL JS
- **Monitoring**: Sentry, Firebase Analytics

## Architecture
- **Monorepo** with 4 main components:
  - `api/`: NestJS backend
  - `app/`: React Native mobile app 
  - `backoffice/`: React admin interface
  - `dtos/`: Shared TypeScript DTOs

## POI Data Flow
- POI data comes from GeoServer via `aireel:poi_data` 
- Interface defined in `app/src/actions/poi.ts` with `poi_id`, `name`, `address`, `geolocation`
- Navigation to POI details via `POIDetails` screen
- No existing API endpoints for POI management - data is fetched directly from GeoServer