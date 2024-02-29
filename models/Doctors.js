const mongoose = require('mongoose')


const doctorSchema = mongoose.Schema({
    doctorName: String,
    age: Number,
    title: String,
}, {timestamps: true})


const Doctor = new mongoose.model('Doctor', doctorSchema)
module.exports = Doctor