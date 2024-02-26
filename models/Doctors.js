const mongoose = require('mongoose')


const doctorSchema = mongoose.Schema({
    doctorName: String,
    age: Number,
    title: String,
    joined_docEye: {
        type: Date,
        default: new Date()
    }
}, {timestamps: true})


const Doctor = new mongoose.model('Doctor', doctorSchema)
module.exports = Doctor