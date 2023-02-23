const { Promise } = require('../db/connection');
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
        return result.rows
    })
};

exports.fetchReviewById = (id) => {
    return db.query(`
    SELECT * FROM reviews
    WHERE review_id = $1
    `, [id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject('Review not found')
        }
        return result.rows[0]
    })
};

exports.fetchCommentsByReviewId = (id) => {
    return db.query(`
    SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC 
    `, [id])
    .then((result) => {
        return result.rows
    })
}

exports.insertCommentByReviewId = (username, body, id) => {
    const comment = [body, 0, username, id, new Date()]
    return db.query(`
    INSERT into comments (body, votes, author, review_id, created_at)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `, comment)
    .then((result) => {
        return result.rows[0];
    })
};

exports.updateReviewById = (id, votes) => {
    const data = [votes, id]
    return db.query(`
    UPDATE reviews 
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *
    `, data)
    .then((result) => {
        if (result.rows.length === 0) return Promise.reject('Review not found')
        return result.rows[0];
    })
}