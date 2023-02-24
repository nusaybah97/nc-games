exports.handleNonExistingPaths = (req, res, next) => {
    res.status(404).send({message: 'Invalid Path!'})
}

exports.handlePSQL400Errors = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({message: 'That is not a valid request!'});
    } else if (err.code === '23502') {
        res.status(400).send({message: 'That is not a valid request!'});
    } else if (err.code === '23503') {
        res.status(404).send({message: 'Sorry Not Found :('});
    } else {
        next(err);
    }
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err === 'Review not found' || err === 'category not found' || err === 'comment not found') {
        res.status(404).send({message: 'Sorry Not Found :('})
    } else if (err === 'invalid query') {
        res.status(400).send({message: 'That is not a valid request!'})
    }else {
        next(err);
    }
}

exports.handle500Error = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({message: 'server error'});
};