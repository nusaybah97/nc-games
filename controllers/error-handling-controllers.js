exports.handlePSQL400Errors = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({message: 'That is not a valid request!'});
    } else {
        next(err);
    }
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err === 'Review not found') {
        res.status(404).send({message: 'Sorry Not Found :('})
    } else {
        next(err);
    }
}

exports.handle500Error = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({message: 'server error'});
};