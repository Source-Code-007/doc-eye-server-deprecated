const mongoose = require('mongoose')

const doctorSchema = mongoose.Schema({
    title: String,
    doctorType: String,
    bio: String,
    medical_specialty: Array,
    total_experience_year: Number,
    medical_degree: String,
    consultationFee: Number,
    followupFee: Number,
    workingExperiences: Array,
    dateOfBirth: String,
    current_workplace: String,
    availability: Object,
    district: String,
    NID: Number,
    BMDC: Number,
    patient_attended: { type: Number, default: 0 },
    status: {type: String, required: true, enum: ['pending', 'approve', 'reject'], default: 'pending'},
    doctor_code: {type:String, default: `DE_${Date.now()}`},
    personalInformation: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })




const Doctor = new mongoose.model('Doctor', doctorSchema)
module.exports = Doctor