const express = require('express');
const {handle500Error, handlePSQL400Errors, handleCustomErrors, handleNonExistingPaths} = require('./controllers/error-handling-controllers')
const {getCategories, getReviews, getReviewById, getCommentsByReviewId, postCommentByReviewId, patchReviewById, getUsers, eraseCommentById, getApis} = require('./controllers/games-controllers')
const app = express();
const cors = require('cors');

app.use(express.json())

app.use(cors());

app.get('/api', getApis);
app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:id', getReviewById);
app.get('/api/reviews/:review_id/comments', getCommentsByReviewId);
app.post('/api/reviews/:review_id/comments', postCommentByReviewId);
app.patch('/api/reviews/:review_id', patchReviewById);
app.get('/api/users', getUsers);
app.delete('/api/comments/:comment_id', eraseCommentById);


app.use(handleNonExistingPaths);

app.use(handlePSQL400Errors);
app.use(handleCustomErrors);
app.use(handle500Error);


module.exports = {app};
