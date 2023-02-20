# House of Games API

## Connecting to both Databases

In order to connect to the databases we will need to have two .env files:

.env.development - this will be used for development purposes and should connect to the development database. This file should contain PGDATABASE=nc_games

.env.test - this will be used for testing purposes and should connect to the testing database. This file should contain PGDATABASE=nc_games_test

Both of these files shoud be included in the .gitignore.