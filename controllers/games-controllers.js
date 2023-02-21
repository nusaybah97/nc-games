const {fetchCategories, fetchReviews, fetchReviewById} = require('../models/games-models')

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
}