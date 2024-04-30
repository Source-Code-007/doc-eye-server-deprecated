const { check, validationResult } = require("express-validator");

const appointmentValidator = [
    check('doctorId').isLength({min:1}),
    check('userId').isLength({min:1}),
    check('bookedDateTime').isDate(),
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