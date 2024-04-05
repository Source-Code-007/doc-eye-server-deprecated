const { check, validationResult } = require("express-validator")
const path = require('path');
const { unlink } = require("fs");
const User = require("../../api/models/Users");
const createHttpError = require("http-errors");

const addUserValidator = [
    check('name').isLength({ min: 1 }).withMessage('Name is required!').isAlpha("en-US", { ignore: " -" }).withMessage('Name must not contain anything other than alphabet').trim(),

    check('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender. Only male, female and other is allowed.'),

    check('password').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 }).withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit'),

    check('email').isEmail().withMessage('Invalid email address!').custom(async (value) => {
        try {
            const isExistUser = await User.findOne({ email: value })
            if (isExistUser) {
                throw createHttpError("Email already is use!")
            }
        } catch (e) {
            throw createHttpError(e.message)
        }
    }),

    check('avatar').custom((value, { req }) => {
        return ['image/jpeg', 'image/jpg', 'image/png'].includes(req.files?.[0]?.mimetype)
        // /\.(jpg|jpeg|png|gif)$/i.test(req.files?.[0]?.mimetype);
    }).withMessage('Please submit JPG, JPEG or PNG image file.'),

    check('phone').isMobilePhone("bn-BD").withMessage('Mobile number must be a valid Bangladeshi mobile number').custom(async (value) => {
        try {
            const isExistPhone = await User.findOne({ phone: value })
            if (isExistPhone) {
                throw createHttpError("Phone already is use!")
            }
        } catch (e) {
            throw createHttpError(e.message)
        }
    }),

    check('role').isIn(['user', 'doctor', 'admin']).withMessage('Invalid role. Only user, doctor and admin is allowed.')
]

const addUserValidatorHandler = (req, res, next) => {
    const errors = validationResult(req)
    const mappedErrors = errors.mapped()

    if (Object.keys(mappedErrors).length === 0) {
        next()
    } else {
        console.log(mappedErrors, 'user error by express validator');

        // Remove the uploaded file
        if (req.files?.length > 0) {
            unlink(path.join(__dirname, `../../upload/avatar/${req.files[0]?.filename}`), err => {
                if (err) console.log(err?.message, 'error from remove file');
            })
        }

        res.status(500).send({errors: mappedErrors})
        // res.status(500).send("There was an validation error")
    }
}

module.exports = { addUserValidator, addUserValidatorHandler }