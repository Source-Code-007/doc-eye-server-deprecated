const { check, validationResult } = require("express-validator");
const Appointment = require("../../api/models/Appointments");
const createHttpError = require("http-errors");

const appointmentValidator = [
    check('doctorInfo').isLength({min:1}),
    check('doctorUserInfo').isLength({min:1}),
    check('patientUserInfo').isLength({min:1}),
    check('bookedDateTime').isString().custom(async(value)=>{
        try{
            const isExistSchedule = await Appointment.findOne({bookedDateTime: value})
            if(isExistSchedule){
                throw createHttpError(`${value} this slot is already booked!`)
            }
            return true
        }catch{
            throw createHttpError(e.message);
        }
    }),
] 

const appointmentValidatorHandler = async(req, res, next)=> {

    const errors = validationResult(req)
    const mappedErrors = errors.mapped()

    if(Object.keys(mappedErrors)?.length === 0){
        next ()
    } else{
        res.status(500).send({ errors: mappedErrors })
    }

}


module.exports = {appointmentValidator, appointmentValidatorHandler}