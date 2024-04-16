const multer = require("multer")

function notFoundErr(req, res, next) {
    next('Requested URL is not found!')
}


function errorHandle(err, req, res, next) {
    if (err) {

        if (err instanceof multer.MulterError) {
            res.status(500).send({ errors: { multer: { msg: 'There was a file upload related error!' } } })
            // res.status(500).send({ message: 'There was a file upload related error!' })
        } else {
            res.status(500).send({ errors: { common: { msg: `${err}` } } })
            // res.status(500).send({ message: err })
        }
    } else {
        res.status(500).send({ errors: { common: { msg: 'There was an error!' } } })
        // res.status(500).send({ message: 'There was an error!' })
    }
}

module.exports = { notFoundErr, errorHandle }