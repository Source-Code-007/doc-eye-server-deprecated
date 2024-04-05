const { check, validationResult } = require("express-validator");
const Specialty = require("../../api/models/Specialty");
const createHttpError = require("http-errors");


const addDoctorValidator = [
    check('title').isIn(["Dr.", "Prof. Dr.", "Assoc. Prof. Dr.", "Asst. Prof. Dr."]).withMessage('Invalid title. Only "Dr.", "Prof. Dr.", "Assoc. Prof. Dr." and "Asst. Prof. Dr." is allowed.'),
    check('doctorType').isIn(["Medical", "Dental", "Veterinary"]).withMessage('Invalid title. Only "Medical", "Dental" and "Veterinary" is allowed.'),
    check('bio').isLength({ min: 30 }).withMessage('Bio must be at least 30 characters long'),
    check('medical_specialty').custom(async (value) => {
        try {
            const isExistSpecialty = await Specialty.findOne({ specialtyName: value })
            if (!isExistSpecialty) {
                throw createHttpError(`${value} Unknown medical specialty`);
            }
        } catch (e) {
            throw createHttpError(e.message);
        }
    }),
    check('total_experience').isLength({ min: 1 }).withMessage('Total experience is required!'),
    check('educationalExcellent').isLength({ min: 1 }).withMessage('Educational excellent is required!'),
    check('consultationFee').isNumeric({ min: 1 }).withMessage('Consultation fee is must be numeric number'),
    check('followupFee').isNumeric({ min: 1 }).withMessage('Followup fee is must be numeric number'),
    check('workingExperiences').isArray(),
    check('dateOfBirth').custom((value, { req }) => {
        // You can customize this function to check if the date of birth is valid according to your requirements
        const dob = new Date(value);
        const currentDate = new Date();
        if (dob >= currentDate) {
          throw new Error('Date of birth must be in the past');
        }
        return true;
      }),
    check('current_workplace').isLength({ min: 1 }).withMessage('Current workplace is required!'),
    check('availability').isObject()
]

const addDoctorValidatorHandler = (req, res, next)=> {
    const errors = validationResult()
    const mappedErrors = errors.mapped()

    if(Object.keys(mappedErrors).length === 0){
        next()
    } else{
        console.log(mappedErrors, 'mappedErrors from add doctor validator handler');
        res.status(500).send({errors: mappedErrors})
    }
}

module.exports = {addDoctorValidator, addDoctorValidatorHandler}