const express = require('express');
const {handle500Error, handlePSQL400Errors, handleCustomErrors, handleNonExistingPaths} = require('./controllers/error-handling-controllers')
const {getCategories, getReviews, getReviewById, getCommentsByReviewId, postCommentByReviewId} = require('./controllers/games-controllers')
const app = express();

app.use(express.json())

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:id', getReviewById);
app.get('/api/reviews/:review_id/comments', getCommentsByReviewId)
app.post('/api/reviews/:review_id/comments', postCommentByReviewId)

app.use(handleNonExistingPaths)

app.use(handlePSQL400Errors)
app.use(handleCustomErrors)
app.use(handle500Error)


module.exports = {app};