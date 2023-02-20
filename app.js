const express = require('express');
const {handle500Error} = require('./controllers/error-handling-controllers')
const {getCategories} = require('./controllers/games-controllers')
const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);

app.use(handle500Error)

module.exports = {app};