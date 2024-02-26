function notFoundErr(req, res, next){
    next('Requested URL is not found!')
}

function errorHandle(err, req, res, next){
    if (err.message) {
        if (err instanceof multer.MulterError) {
            res.status(500).send({ message: 'There was an file upload related error!' })
        } else {
            res.status(500).send({ message: err.message })
        }
    } else {
            res.status(500).send({message: "There was an error!"})  
    }
}

module.exports = {notFoundErr, errorHandle}