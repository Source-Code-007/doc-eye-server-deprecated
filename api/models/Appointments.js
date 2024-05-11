const mongoose = require('mongoose')

const appointmentSchema = mongoose.Schema({
    doctorInfo: {type: mongoose.Types.ObjectId, ref: 'Doctor'},
    doctorUserInfo: {type: mongoose.Types.ObjectId, ref: 'User'},
    patientUserInfo: {type: mongoose.Types.ObjectId, ref: 'User'},
    bookedDateTime: Date
})


const Appointment = new mongoose.model('Appointment', appointmentSchema)
module.exports = Appointment