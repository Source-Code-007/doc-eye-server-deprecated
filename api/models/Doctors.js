const mongoose = require('mongoose')

const doctorSchema = mongoose.Schema({
    title: String,
    doctorType: String,
    bio: String,
    medical_specialty: Array,
    total_experience: String,
    medical_degree: String,
    consultationFee: Number,
    followupFee: Number,
    workingExperiences: Array,
    dateOfBirth: String,
    current_workplace: String,
    availability: Object,
    personalInformation: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


const Doctor = new mongoose.model('Doctor', doctorSchema)
module.exports = Doctor