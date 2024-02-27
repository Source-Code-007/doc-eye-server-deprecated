const multer = require("multer")

function notFoundErr(req, res, next) {
    next('Requested URL is not found!')
}

function errorHandle(err, req, res, next) {
    console.log(err, 8);
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send({ errors: { multer: { message: 'There was a file upload related error!' } } })
        } else {
            res.status(500).send({ errors: { common: { message: err } } })
        }
    } else {
        res.status(500).send({ errors: { common: { message: 'There was an error!' } } })
    }
}

module.exports = { notFoundErr, errorHandle }