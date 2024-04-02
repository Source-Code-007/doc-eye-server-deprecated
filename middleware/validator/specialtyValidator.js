const { check, validationResult } = require("express-validator");
const path = require('path')

const addSpecialtyValidator = [
    check('specialtyName').isLength({ min: 1 }).withMessage('Specialty name is required!'),
    check('specialtyDescription').isLength({ min: 1, max: 110 }).withMessage('Specialty description must be between 1 and 110 characters long!'),
    check('specialtyLogo').custom((value, { req }) => {
        const fileExt = path.extname(value)
        return ['image/jpeg', 'image/jpg', 'image/png'].includes(req.files?.[0]?.mimetype || `image/${fileExt?.split('.')?.[1]}`)
    }).withMessage('Please submit JPG, JPEG or PNG image file.'),
]
const updateSpecialtyValidator = [
    check('specialtyName').optional().isLength({ min: 1 }).withMessage('Specialty name is required!'),
    check('specialtyDescription').optional().isLength({ min: 1, max: 110 }).withMessage('Specialty description must be between 1 and 110 characters long!'),
    check('specialtyLogo').optional().custom((value, { req }) => {

        if (!value) {
            // No file provided, so it's optional
            return true;
        }

        const fileExt = path.extname(value)
        return ['image/jpeg', 'image/jpg', 'image/png'].includes(req.files?.[0]?.mimetype || `image/${fileExt?.split('.')?.[1]}`)
    }).withMessage('Please submit JPG, JPEG or PNG image file.'),
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

module.exports = {addSpecialtyValidator, updateSpecialtyValidator, addSpecialtyValidatorHandler}