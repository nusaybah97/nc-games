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

exports.fetchReviews = (category, sortBy, orderBy) => {
    return db.query(`SELECT slug FROM categories`)
    .then((result) => {
        const catArr = result.rows
        const categories = catArr.map((cat) => {
            return cat.slug
        })
        return categories
    })
    .then((validCat) => {
        const validSortBy = ['created_at', 'votes']
        const validOrder = ['asc', 'desc']
        
        if (sortBy && !validSortBy.includes(sortBy)) {
            return Promise.reject('invalid query')
        }
        if (category && !validCat.includes(category)) {
            return Promise.reject('category not found')
        }
        if (orderBy && !validOrder.includes(orderBy)) {
            return Promise.reject('invalid query')
        }

        let queryStr = 'SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id ';
        const cat = category;
        const sort = sortBy || 'created_at'
        const order = orderBy || 'desc'
        const queryInputs = []
        if (category) {
            queryInputs.push(cat)
            queryStr += `WHERE reviews.category = $1`
        }
        queryStr += ` GROUP BY reviews.review_id ORDER BY reviews.${sort} ${order};`
        return db.query(queryStr, queryInputs)
    })
    .then((result) => {
        return result.rows
    })
};

exports.fetchReviewById = (id) => {
    return db.query(`
    SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id
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
};

exports.fetchUsers = () => {
    return db.query(`
    SELECT * FROM users
    `)
    .then((result) => {
        return result.rows
    })
};

exports.removeCommentById = (id) => {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    `, [id])
    .then((results) => {
        if (results.rowCount === 0) return Promise.reject('comment not found')
    })
}