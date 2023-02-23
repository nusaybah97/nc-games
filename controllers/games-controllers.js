const {fetchCategories, fetchReviews, fetchReviewById, fetchCommentsByReviewId, insertCommentByReviewId} = require('../models/games-models')

exports.getCategories = (req, res, next) => {
    return fetchCategories()
    .then((categories) => {
        res.status(200).send({categories});
    })
    .catch((err) => {
        next(err);
    })
};

exports.getReviews = (req,res,next) => {
    return fetchReviews()
    .then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch((err) => {
        next(err);
    })
};

exports.getReviewById = (req, res, next) => {
    const {id} = req.params;
    return fetchReviewById(id)
    .then((review) => {
        res.status(200).send({review})
    })
    .catch((err) => {
        next(err)
    })
};

exports.getCommentsByReviewId = (req, res, next) => {
    const {review_id} = req.params;
    const commentsPromise = fetchCommentsByReviewId(review_id)
    const reviewPromise = fetchReviewById(review_id)
    Promise.all([commentsPromise, reviewPromise])
    .then(([comments]) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
};

exports.postCommentByReviewId = (req, res, next) => {
    const {review_id} = req.params;
    const{username, body} = req.body;
    insertCommentByReviewId(username, body, review_id)
    .then((comment) => {
        res.status(201).send({comment});
    })
    .catch((err) => {
        next(err)
    })
};