const express = require('express')
const doctorRouter = express.Router('')
const jwtVerify = require('../../middleware/authGuard/jwtVerify')
const Doctor = require('../models/Doctors')
const { addDoctorValidator, addDoctorValidatorHandler } = require('../../middleware/validator/doctorValidator')


// TODO: Need to optimize doctor route

// insert a doctor
doctorRouter.post('/doctor-register', jwtVerify, addDoctorValidator, addDoctorValidatorHandler, async (req, res) => {
    try {
        console.log(req.body, 'req body');
        const newDoctor = new Doctor({ ...req.body, personalInformation: req.userId })
        // const userId = req.userId
        // const user = await User.findById(userId).select({_id:0, __v:0, createdAt:0, updatedAt:0, password:0, role:0})

        // console.log(user);

        await newDoctor.save()
        res.status(200).send({ message: 'doctor inserted successfully!', newDoctor })
    } catch (e) {
        res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
    }
})


// Get all doctors
doctorRouter.get('/all-doctors', async (req, res) => {
    // const allDoctors = await Doctor.find({}).select({ __v: 0 })
    try {
        const allDoctors = await Doctor.find({}, { __v: 0 }).populate('personalInformation', 'name avatar gender email phone -_id')

        const modifiedDoctors = allDoctors.map(doctor => {
            const docObj = doctor.toObject()
            if(docObj.district){
                docObj.personalInformation?.district = docObj.district
            }
            delete docObj.district
            return docObj
        })

        if (allDoctors) {
            res.status(200).send({
                message: 'Doctors found!',
                data: modifiedDoctors
            })
        } else {
            res.status(500).send({ errors: { common: { msg: 'Doctors not found!' } } })
        }
    }
    catch (e) {
        res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
    }

})


// Get expected doctor 
// TODO: [demo protected route]
doctorRouter.get('/expected-doctor/:id', async (req, res) => {
    try {
        const _id = req.params?.id
        const expectedDoctor = await Doctor.findById(_id).select({ __v: 0 })
        if (expectedDoctor) {
            res.status(200).send({
                message: 'Expected doctor found!',
                data: expectedDoctor
            })
        } else {
            res.status(500).send({ errors: { common: { msg: 'Expected doctor not found!' } } })
        }
    } catch (e) {
        res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
    }

})

// Delete expected doctor
doctorRouter.delete('/delete-doctor/:id', async (req, res) => {
    try {

        const _id = req.params?.id
        const deleteDoctor = await Doctor.findByIdAndDelete(_id)
        // const deleteDoctor = await Doctor.deleteOne({doctorName: 'test'})
        // const deleteDoctors = await Doctor.deleteMany({doctorName: 'test'})
        if (deleteDoctor) {
            res.send(`Deleted doctor: ${deleteDoctor}`)
        } else {
            res.status(500).send({ errors: { common: { msg: 'Doctor not found!' } } })
        }
    } catch (e) {
        res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
    }
})

// Update expected doctor
doctorRouter.patch('/update-doctor/:id', async (req, res) => {
    try {

        const _id = req.params?.id
        const updatedDoctor = await Doctor.findByIdAndUpdate(_id, {
            $set: {
                ...req.body
            }
        })
        if (updatedDoctor) {
            res.send(`Updated doctor: ${updatedDoctor}`)
        } else {
            res.status(500).send({ errors: { common: { msg: 'Doctor not found!' } } })
        }
    } catch (e) {
        res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
    }
})



module.exports = doctorRouter