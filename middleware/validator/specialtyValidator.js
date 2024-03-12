const { check, validationResult } = require("express-validator");

const addSpecialtyValidator = [
    check('specialtyName').isLength({ min: 1 }).withMessage('Specialty name is required!'),
    check('specialtyDescription').isLength({ min: 1 }).withMessage('Specialty description is required!'),
    check('specialtyLogo').custom((value, { req }) => {
        return /\.(jpg|jpeg|png|gif)$/i.test(value);
    }).withMessage('Please only submit pdf documents.'),
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