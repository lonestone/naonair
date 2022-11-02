# Naonair - Air Pays de la Loire 🎉

A repository for all Naonair components

# Projects & Architecture

## Projects

```
AIREAL/
├── api/         # NestJS API
├── app/         # React-Native + Paper
├── backoffice/  # CRA + React  + Material-Ui
├── dtos/        # DTOs used for type between API and fronts app
```

## Deployment & Tags

A new version is automatically deployed on Render when a commit is pushed on main branch.

Mobile apps must be manually deployed.

When a new version is deployed, please tag last main branch commit with :

```bash
git tag -a vX.Y.Z. -m "Small message to describe updates"
git push origin vX.Y.Z

# with :
# X : breaking change(s)
# Y : add new feature(s)
# Z : minor fix(s)
```

## Docker

Docker is used in dev to start databases :

- aireal-postgres
- aireal-postgres-tests

## Database

We using a PostgreSQL database in order to store main data of apps. Running at `localhost:5432`

### Migrations

Update your entities and use `npx mikro-orm migration:create ` to create migration.

# 🚀 Getting started

## Install dependencies and build dtos

For, you need to build your dtos :

```
$ cd dtos
$ yarn
$ yarn build
```

Next, go in `api`, `app` and `backoffice` and run these commands :

```
$ yarn
$ npm link ../dtos # use dto package as dependency, see DTOs chapiter below
```

For nest, you need to install `@nestjs/cli` in global (or locally, as you want)

## Run Database

You need docker, and run `docker-compose up -d` for running database

## Configure environment

```
# go in api folder
$ cd api

# copy example to right file (don't commit it!)
$ cp .env.example .env

```

Then, fill right properties

## Start projects

```
# API
$ yarn start // or start:dev to hot reload

# Backoffice
$ yarn start

# Mobile app - Metro server
$ yarn start

# Mobile app - Run on android
$ yarn android

# Mobile app - Run on ios
$ yarn ios
```

# Other considerations

## API Authentication

You have to log into API with /login, with payload { pass : <i>secretKey</i> }. This secret key must be configurated in .env.

This API will return a JWT token, which expire after 24 hours.

Don't forget to fill .env :

```
PASS_KEY : Token used to be connected on backoffice
JWT_KEY : Key to jwt token generation (Keep it secret)
```

## DTOs

DTOs, as (Data Transfer Object), are defined in /dtos. It permits typing between api and front app.

This projet is considered as package, and used as dependenbcy with `npm link`

You must build all dtos with `yarn build` in dtos packages in order to use it in front apss

⚠️ Unfortunately, ESBuild (builder embedded in Vite), does not support importing types or enums from built dtos.
We then need to copy the DTOs into types.ts and import them. However, the typing will be checked between our local enum
and the enum scoped in the DTO)

## Mobile developpement

Fast refresh is enabled by default. If not actived:

- shake your phone
- select "Enable fast Refresh"

To enable debug mode :

- shake your phone
- select "Debug" item (warning, logs will appear not in browser console (see below))
- go to http://localhost:8081/debugger-ui/

# Who build this ?

Build with lot of love ❤, by Lonestone
