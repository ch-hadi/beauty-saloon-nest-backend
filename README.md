
# Getting started

# Introduction
Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript, is built with and fully supports TypeScript (yet still enables developers to code in pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

Under the hood, Nest makes use of robust HTTP Server frameworks like `Express` (the default) and optionally can be configured to use `Fastify` as well!

## Installation

Clone the repository

    git clone link

Switch to the repo folder

    cd server
    
Install the dependencies
   
1- `npm i -g @nestjs/cli` to install the nest cli to work with nestjs

2- `npm install` to install the  dependencies

Create a .env file in the root directory of the project.

set the environment variable in .env file.

----------

## 3-Tier Architecture
Using Nest.js i follows the 3-Tier Architecture to build the robust application structure,to isolate different parts of an application such that the part that makes sense together lives together.

Considering the flow mentioned below (Layers), we will realize that controllers and servicez layer work together to carry out a logic but are entirely two different things. Controllers essentially deal with the routes of your application. A controller may have few different routes and it all depends on the routing mechanism to control which controller receives what request.

# 3-Tier Architecture Layers

1. Controllers: A controller’s sole purpose is to receive requests for the application and deal with routes.

2. Service Layer: This part of the block should only include business logic. For example, all the CRUD operations and methods to determine how data can be created, stored and updated.

3. Data Access Layer: This layer takes care and provides logic to access data stored in persistent storage of some kind. For example an ODM like Mongoose.

-------------
# Project Structure
The project follows a typical NestJS application structure:

/src
  ├─ /controllers         # Contains the controllers responsible for handling incoming requests
  ├─ /dto                 # Data Transfer Objects used for validation and data transformation
  ├─ /entities            # Database entities or models
  ├─ /common              # Custom middleware,interceptors and custom functions
  ├─ /modules             # Modules that encapsulate related functionality
  ├─ /providers           # Service providers or utility classes
  ├─ /services            # Business logic services
  ├─ /utils               # Utility functions or helper classes
  ├─ main.ts              # Entry point of the application
  └─ app.module.ts        # Root module of the application

## Database and ORM

ORM used  [TypeORM](http://typeorm.io/)
    
The TypeORM is implemented with a Postgresql database.

Create a new postgresql database with the name of your choice

Database Configuration file is in  `src/common/config/db.config`  
    
Set postgresql database settings in db.config file or in .env file that will read them automatically
like this:
### DATABASE_HOST=localhost
### DATABASE_PORT=4000
### DATABASE_USER_NAME=postgres
### DATABASE_PASSWORD=abc
### DATABASE_NAME=databse-name
    
OR

set in config/db.config.ts file hardcoded, which is not recommended.

Start local postgresql server and create new database 'name of database'.

If your using live/cloud  database do the save above and then set the `ssl mode` property true in your config file to enable SSL.

Set `synchronize true` On application start, tables for all entities will be created, or create migrations for all entities to create tables in the database.

----------

##### Migrations
 # Generate migration : `npm run migration:generate -- src/db/migrations/migration-name`
 # create migration : `npm run migration:create`
 # Run migration : `npm run migration:run`
 # Revert migration : `npm run migration:revert`

----------
## NPM scripts
- `npm install` - install dependencies
- `npm start` - Start application
- `npm run start:watch` - Start application in watch mode
- `npm run test` - run Jest test runner 
- `npm run start:prod` - Build application

----------

## Start application

- `npm start`
- Test api with `http://localhost:3000(3001)/api/` in your favourite browser

----------

# Authentication
This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token. Please check the following sources to learn more about JWT.

----------
 
# Swagger API docs
This example repo uses the NestJS swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)        

# Running Tests
Unit tests are an important part of any application's development lifecycle. NestJS provides a testing framework that makes it easy to write and execute tests for your application.

To execute the application's unit tests, use the following command:
`npm run test`

# Contributing
If you want to contribute to this project, follow the steps below:

Fork the repository.
1. Create a new branch for your feature: git checkout -b feature/your-feature-name.
2. Make your changes and commit them: git commit -m 'Add some feature'.
3. Push the changes to your forked repository: git push origin feature/your-feature-name.
4. Submit a pull request to the main repository.

Need help? contact us through email [majidhussaindev@gmail.com].