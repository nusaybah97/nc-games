const {fetchCategories, fetchReviews, fetchReviewById, fetchCommentsByReviewId, insertCommentByReviewId, updateReviewById, fetchUsers, removeCommentById} = require('../models/games-models')
const endpoints = require('../endpoints.json')

exports.getApis = (req, res, next) => {
    res.status(200).send({endpoints})
}


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
    const {category} = req.query
    const {sort_by} = req.query
    const {order} = req.query
    return fetchReviews(category, sort_by, order)
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

exports.patchReviewById = (req, res, next) => {
    const {review_id} = req.params;
    const {inc_votes} = req.body
    updateReviewById(review_id, inc_votes)
    .then((review) => {
        res.status(200).send({review})
    })
    .catch((err) => {
        next(err)
    })
};

exports.getUsers = (req,res,next) => {
    return fetchUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err);
    })
};

exports.eraseCommentById = (req, res, next) => {
    const {comment_id} = req.params
    return removeCommentById(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}