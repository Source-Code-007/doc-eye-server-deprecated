const singleUploader = require("../../utilities/singleUploader");

function avatarUpload(req, res, next) {
    const upload = singleUploader('./upload/specialty', ['image/png', 'image/jpg', 'image/jpeg'], 'Only .jpg, .jpeg and .png format allowed!')

    // Call the middleware function
    upload.any()(req, res, err => {
        if (err) {
            console.log(err);
            res.status(500).send({ errors: { multer: { message: err.message } } })
            // res.status(500).send({ message: err.message })
        } else {
            next()
        }
    })
}

module.exports = avatarUpload