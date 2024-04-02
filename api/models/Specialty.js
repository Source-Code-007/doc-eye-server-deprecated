const mongoose = require('mongoose')


const specialtySchema = mongoose.Schema({
    specialtyName: {type:String, required: true},
    specialtyDescription: {type:String, required: true},
    specialtyLogo: {
        type: String,
        required: true
    },
    admin: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})


const Specialty = new mongoose.model('Specialty', specialtySchema)
module.exports = Specialty