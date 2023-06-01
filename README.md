# MicroService Project

## Description

---

The project is divided into microservices, each microservice is a separate nodejs application.
- core
- events

And a shared module that contains shared code between microservices (models, constants, utils, etc.)
- shared

## Requirements

---

- [Node.js](https://nodejs.org/en/) >= 12.0.0
- [yarn](https://yarnpkg.com/) >= 1.0.0
- [Docker](https://www.docker.com/) >= 19.0.0
- [Docker Compose](https://docs.docker.com/compose/) >= 1.0.0
- [Git](https://git-scm.com/) >= 2.0.0

## Installation

---
- create .env.core from .env.core.example and .env.events from .env.events.example
- run `./install.sh`


## Usage

---
### Note: The order of the commands is important!

1. run `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build` to start the project
2. Api will be available on port `3000`

When running, the following happens:
- then it build the images for `core` and `events` services
- then it will start all services
  - `core`: core module,
  - `events`: for handling events
  - `mongo`: will be available on port `27017`
  - `redis`: as an adapter for sockets, will be available on port `6379`
  - `rabbitmq`: for communication between services, will be available on port `5672`
  - `nginx`: as a reverse proxy for services routing, will be available on port `3000`

## Project structure

---

- consumers: contains the consumers for rabbitmq,
- controllers: contains the controllers for the routes
- middlewares: contains the middlewares for the routes
- queuesManager: mqManager instance for rabbitmq, used for publishing/consuming messages
- routes: contains the routes
- services: contains the services for the routes
- validations: contains the validations middlewares for the routes

