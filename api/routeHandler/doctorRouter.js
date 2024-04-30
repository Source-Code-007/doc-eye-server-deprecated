const express = require('express')
const doctorRouter = express.Router('')
const jwtVerify = require('../../middleware/authGuard/jwtVerify')
const { addDoctorValidator, addDoctorValidatorHandler } = require('../../middleware/validator/doctorValidator')
const adminVerify = require('../../middleware/authGuard/adminVerify')
const { createDoctorController, getExpectedDoctorByIdController, deleteDoctorByIdController, approveDoctorByIdController, rejectDoctorByIdController, updateDoctorByIdController, bookAppointmentController, getAllDoctorsController } = require('../controllers/doctorController')
const { appointmentValidator, appointmentValidatorHandler } = require('../../middleware/validator/appointmentValidator')
const doctorVerify = require('../../middleware/authGuard/doctorVerify')


// TODO: Need to optimize doctor route

// insert a doctor
doctorRouter.post('/doctor-register', jwtVerify, addDoctorValidator, addDoctorValidatorHandler, createDoctorController)


// Get all doctors
doctorRouter.get('/all-doctors', getAllDoctorsController)


// Get expected doctor 
// TODO: [demo protected route]
doctorRouter.get('/expected-doctor/:id', getExpectedDoctorByIdController)

// Delete expected doctor
doctorRouter.delete('/delete-doctor/:id', jwtVerify, adminVerify, deleteDoctorByIdController)

// Approve doctor
doctorRouter.patch('/approve-doctor/:id', jwtVerify, adminVerify, approveDoctorByIdController)
// Approve doctor
doctorRouter.patch('/reject-doctor/:id', jwtVerify, adminVerify, rejectDoctorByIdController)

// Update expected doctor -- On progress
doctorRouter.patch('/update-doctor/:id', updateDoctorByIdController)


// Book appointment
// book appointment API
doctorRouter.post('/book-appointment', appointmentValidator, appointmentValidatorHandler, bookAppointmentController)


module.exports = doctorRouter