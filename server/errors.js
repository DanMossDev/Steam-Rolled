exports.badEndpoint = (req, res) => {
    res.status(400).send({msg: "Endpoint doesn't exist, please view documentation for valid endpoints"})
}

exports.customError = (err, req, res, next) => {
    if (err.statusCode && err.msg) {
        res.status(err.statusCode).send({msg: err.msg})
    }
    next(err)
}

exports.psqlError = (err, req, res, next) => {
    switch (err.code) {
        case '22P02':
            res.status(400).send({msg: "URL appID parametric entry of wrong type (expected integer, recieved string)"})
        case '23503': //POST to a valid but nonexistent location
            res.status(404).send({msg: err.detail})
            default:
            next(err)
            break;
    }
}