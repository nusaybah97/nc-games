const db = require('../db/connection');

exports.fetchCategories = () => {
    return db.query(`
    SELECT * FROM categories
    `)
    .then((result) => {
        return result.rows
        
    })
};

exports.fetchReviews = () => {
    return db.query(`
    SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC
    `)
    .then((result) => {
        console.log(result.rows)
        return result.rows
    })
};