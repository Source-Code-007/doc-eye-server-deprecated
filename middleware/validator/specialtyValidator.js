const { check, validationResult } = require("express-validator");

const addSpecialtyValidator = [
    check('specialtyName').isLength({ min: 1 }).withMessage('Specialty name is required!'),
    check('specialtyDescription').isLength({ min: 1, max: 110 }).withMessage('Specialty description must be between 1 and 110 characters long!'),
    check('specialtyLogo').custom((value, { req }) => {
        return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(req.files?.[0]?.mimetype)
        // /\.(jpg|jpeg|png|gif)$/i.test(req.files?.[0]?.mimetype);
    }).withMessage('Please submit only JPG, JPEG, PNG, or GIF image file.'),
]

const addSpecialtyValidatorHandler = (req, res, next) => {
    const errors = validationResult(req)
    const mappedErrors = errors.mapped()
    if (Object.keys(mappedErrors).length === 0) {
        next()
    } else {
        // Remove the uploaded file
        if (req.files?.length > 0) {
            unlink(path.join(__dirname, `../../upload/specialty/${req.files[0]?.filename}`), err => {
                if (err) console.log(err?.message, 'error from remove file');
            })
        }
        res.status(500).send({errors: mappedErrors})
    }
}

module.exports = {addSpecialtyValidator, addSpecialtyValidatorHandler}