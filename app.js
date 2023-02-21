const express = require('express');
const {handle500Error, handlePSQL400Errors, handleCustomErrors} = require('./controllers/error-handling-controllers')
const {getCategories, getReviews, getReviewById} = require('./controllers/games-controllers')
const app = express();

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:id', getReviewById);

app.use(handlePSQL400Errors)
app.use(handleCustomErrors)
app.use(handle500Error)


module.exports = {app};