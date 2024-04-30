const mongoose = require('mongoose')

const appointmentSchema = mongoose.Schema({
    doctorId: {type: mongoose.Types.ObjectId, ref: 'Doctor'},
    userId: {type: mongoose.Types.ObjectId, ref: 'User'},
    bookedDateTime: {Date}
})


const Appointment = new mongoose.model('Appointment', appointmentSchema)
module.exports = Appointment