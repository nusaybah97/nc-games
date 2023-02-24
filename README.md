# Games API

## Introduction

This Games API allows you to retrive information related to reviews, comments, categories and users.

You can access this API here: [GamesApi](https://games-oizc.onrender.com/)

## Local Setup

### Forking and Cloning


In order to have your own version of this repository you will first need to fork it. You can then clone it down to your machine locally.

```
git clone <paste the link to your repository here>
```

### Dependencies

You will need to already have installed [Node.js](https://nodejs.org/en/download/) v19.3.0 and [PostgreSQL](https://www.postgresql.org/download/) v14.5.

Install the following dependencies:
```
npm i pg
npm i dotenv
npm i express
npm i pg-format
```
Install the following devDependencies:
```
npm i -D supertest
npm i -D jest
npm i -D jest-sorted
```
*Note*: All dependencies can also be installed using a single command as they are already included in the package.json.
```
npm i
```

### Connecting to the Databases

In order to connect to the right databases you will need to create two .env files:

* .env.development 
```
PGDATABASE=nc_games
```
* .env.test
```
PGDATABASE=nc_games_test
```
### Seeding Databases
```
npm run setup-dbs
npm run seed
```
### Tests

Run the following command to run the tests
```
npm test <specific test file>
```
