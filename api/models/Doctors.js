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
    district: String,
    NID: Number,
    BMDC: Number,
    patient_attended: { type: Number, default: 0 },
    status: {type: String, required: true, enum: ['pending', 'approve', 'reject'], default: 'pending'},
    doctor_code: String,
    personalInformation: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


// Set doctor code based on doctor counting using pre middleware from mongoose
doctorSchema.pre('save', async function(next) {
    try {
        if (!this.doctor_code) {
            const count = await this.constructor.countDocuments();
            this.doctor_code = `DE${count + 1}`;
        }
        next();
    } catch (error) {
        next(error);
    }
});


const Doctor = new mongoose.model('Doctor', doctorSchema)
module.exports = Doctor