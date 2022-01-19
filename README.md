# AIREAL - Air Pays de la Loire 🎉

A repository for all Aireal components

# Projects & Architecture

### Projects

```
AIREAL/
├── api/         # NestJS API
├── app/         # React-Native + Paper
├── backoffice/  # CRA + React  + Material-Ui
```

### Docker

Docker is used in dev to start database; but too in staging and production

### Database

We using a PostgreSQL database in order to store main data of apps. Running at `localhost:5433`

# Getting started

## Install dependencies

Go in each project and run `yarn` command

## Run Database

You need docker, and run `docker-compose up -d` for running database

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

## Mobile developpement

Fast refresh is enabled by default. If not actived:

- shake your phone
- select "Enable fast Refresh"

To enable debug mode :

- shake your phone
- select "Debug" item (warning, logs will appear not in browser console (see below))
- go to http://localhost:8081/debugger-ui/

# Who build this ?

Build with Love ❤ by Lonestone
