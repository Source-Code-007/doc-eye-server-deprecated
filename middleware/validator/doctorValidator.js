const { check, validationResult } = require("express-validator");
const Specialty = require("../../api/models/Specialty");
const createHttpError = require("http-errors");


const addDoctorValidator = [
    check('title').isIn(["Dr.", "Prof. Dr.", "Assoc. Prof. Dr.", "Asst. Prof. Dr."]).withMessage('Invalid title. Only "Dr.", "Prof. Dr.", "Assoc. Prof. Dr." and "Asst. Prof. Dr." is allowed.'),
    check('doctorType').isIn(["Medical", "Dental", "Veterinary"]).withMessage('Invalid doctor type. Only "Medical", "Dental" and "Veterinary" is allowed.'),
    check('bio').isLength({ min: 30 }).withMessage('Bio must be at least 30 characters long'),
    check('medical_specialty').custom(async (value) => {
        try {
            const isExistSpecialty = await Specialty.findOne({ specialtyName: value })
            if (!isExistSpecialty) {
                throw createHttpError(`${value} is unknown medical specialty`);
            }
            return true
        } catch (e) {
            throw createHttpError(e.message);
        }
    }),
    check('total_experience').isLength({ min: 1 }).withMessage('Total experience is required!'),
    check('medical_degree').isLength({ min: 1 }).withMessage('Educational excellent is required!'),
    check('consultationFee').isFloat({min: 100, max:5000}).withMessage('The consultation fee must be a numeric value between 100 and 5000.'),
    check('followupFee').isNumeric().withMessage('The followup fee must be a numeric value.').custom((val, { req }) => {
        const { consultationFee } = req.body
        if (Number(val) >= Number(consultationFee)) {
            throw createHttpError('Followup fee must be less than consultation fee')
        }
        return true
    }),
    check('workingExperiences').optional().isArray(),
    check('dateOfBirth').custom((value, { req }) => {
        // You can customize this function to check if the date of birth is valid according to your requirements
        const dob = new Date(value);
        const currentDate = new Date();
        if (dob >= currentDate) {
            throw createHttpError('Date of birth must be in the past');
        }

        return true;
    }),
    check('current_workplace').isLength({ min: 1 }).withMessage('Current workplace is required!'),
    check('availability').isObject().withMessage('Availability must be an object').custom(value => {
        const missingProperty = ['availabilityDays', 'availabilityTimeStart', 'availabilityTimeEnd'].filter(item => !value.hasOwnProperty(item))
        if (missingProperty.length > 0) {
            throw createHttpError("Availability must be an object with these properties - 'availabilityDays', 'availabilityTimeStart', 'availabilityTimeEnd'")
        }

        return true
    }),
    check('district').isIn([
        "Dhaka",
        "Chittagong",
        "Rajshahi",
        "Khulna",
        "Barishal",
        "Sylhet",
        "Rangpur",
        "Mymensingh",
        "Narayanganj",
        "Comilla",
        "Gazipur",
        "Bogra",
        "Dinajpur",
        "Tangail",
        "Jessore",
        "Faridpur",
        "Jamalpur",
        "Pabna",
        "Noakhali",
        "Feni",
        "Netrokona",
        "Naogaon",
        "Kushtia",
        "Magura",
        "Narsingdi",
        "Lakshmipur",
        "Kishoreganj",
        "Jhenaidah",
        "Sherpur",
        "Thakurgaon",
        "Chuadanga",
        "Natore",
        "Munshiganj",
        "Satkhira",
        "Bagerhat",
        "Sirajganj",
        "Chapai Nawabganj",
        "Joypurhat",
        "Meherpur",
        "Cox's Bazar",
        "Feni",
        "Chandpur",
        "Lalmonirhat",
        "Kurigram",
        "Pirojpur",
        "Panchagarh",
        "Patuakhali",
        "Bhola",
        "Sunamganj",
        "Habiganj",
        "Moulvibazar",
        "Manikganj",
        "Rajbari",
        "Madaripur",
        "Gopalganj",
        "Shariatpur",
        "Chuadanga",
        "Mymensingh",
        "Rangamati",
        "Bandarban",
        "Khagrachari",
        "Cox's Bazar",
        "Munshiganj"
    ]).withMessage('Invalid district. Only Bangladeshi valid district name is allowed.'),
]

const addDoctorValidatorHandler = (req, res, next) => {

    const errors = validationResult(req)
    const mappedErrors = errors.mapped()


    if (Object.keys(mappedErrors).length === 0) {
        next()
    } else {
        res.status(500).send({ errors: mappedErrors })
    }
}

module.exports = { addDoctorValidator, addDoctorValidatorHandler }