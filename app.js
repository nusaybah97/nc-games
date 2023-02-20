const express = require('express');
const {handle500Error} = require('./controllers/error-handling-controllers')
const {getCategories, getReviews} = require('./controllers/games-controllers')
const app = express();

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);

app.use(handle500Error)


module.exports = {app};