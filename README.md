# An Arnie App

A sample web application built with [Node.js](https://nodejs.org) and [React](https://react.dev).

## Prerequisites

- [Docker](https://docs.docker.com)
- [Docker Compose plugin](https://docs.docker.com/compose/)

## Getting started

Configure the PostgreSQL database, user and password in `variables.env`.

Start the containers and wait for the `npm` packages to install.
```
docker compose up
```

Create the database tables and populate them with some sample data.
```
docker exec -i aaa-api ash -c "yarn migrate up"
```

Go to `http://localhost:5173` in your browser.

## Development notes

This application defines an [OpenAPI](https://openapis.org) schema and is
suitable for a contract-first development approach. Adding a new route, for
example, would involve the following:
1. Edit `api/openapi/v1.yml` to add the desired `path` and `components`
2. Validate the schema by running `yarn lint:schema` in the `aaa-api` container
3. Write a handler function with the same name as the new route's `operationId`
   and export it from `api/src/handlers/index.js`
4. Regenerate the API client by running `yarn generate-api` in the
   `aaa-showtime` container
