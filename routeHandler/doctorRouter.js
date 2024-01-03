const express = require('express')
const mongoose = require('mongoose')
const doctorRouter = express.Router('')
const doctorSchema = require('../schemas/doctorSchema')
const Doctor = new mongoose.model('Doctor', doctorSchema)


// insert a doctor
doctorRouter.post('/insert-doctor', async (req, res) => {
    try {
        const newDoctor = new Doctor(req.body)
        await newDoctor.save()
        res.status(200).send({ message: 'doctor inserted successfully!', _id: newDoctor?._id })
    } catch (e) {
        res.status(500).send({ message: 'There was a server side error!' })
    }
})

// Get all doctors
doctorRouter.get('/all-doctors', async(req, res) => {
    const allDoctors = await Doctor.find({})
    if(allDoctors){
        res.send(allDoctors)
    } else{
        res.send('Doctors not found!')
    }
})

// Get expected doctor
doctorRouter.get('/expected-doctor/:id', async(req, res) => {
    const _id = req.params?.id
    const expectedDoctor = await Doctor.findById(_id)
    if(expectedDoctor){
        res.send(expectedDoctor)
    } else{
        res.send('Expected doctor not found!')
    }
})

// Delete expected doctor
doctorRouter.delete('/delete-doctor/:id', async(req, res) => {
    const _id = req.params?.id
    const deleteDoctor = await Doctor.findByIdAndDelete(_id)
    if(deleteDoctor){
        res.send(`Deleted doctor: ${deleteDoctor}`)
    }else {
        res.send('Doctor not found!')
    }
})



module.exports = doctorRouter