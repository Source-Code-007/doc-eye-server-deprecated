const { check, validationResult } = require("express-validator")
const createError = require("http-errors")
const User = require('../../models/Users')
const path = require('path');
const { unlink } = require("fs");

const addUserValidator = [
    check('name').isLength({ min: 1 }).withMessage('Name is required!').isAlpha("en-US", { ignore: " -" }).withMessage('Name must not contain anything other than alphabet').trim(),

    check('password').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 }).withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit'),

    check('email').isEmail().withMessage('Invalid email address!').custom(async (value) => {
        try {
            const isExistUser = await User.findOne({ email: value })
            if (isExistUser) {
                throw createError("Email already is use!")
            }
        } catch (e) {
            throw createError(e.message)
        }
    }),

    check('phone').isMobilePhone("bn-BD").withMessage('Mobile number must be a valid Bangladeshi mobile number').custom(async (value) => {
        try {
            const isExistPhone = await User.findOne({ phone: value })
            if (isExistPhone) {
                throw createError("Phone already is use!")
            }
        } catch (e) {
            throw createError(e.message)
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