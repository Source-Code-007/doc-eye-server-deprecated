const express = require('express')
const mongoose = require('mongoose')
const doctorRouter = express.Router('')
const doctorSchema = require('../schemas/doctorSchema')
const doctor = new mongoose.model('doctor', doctorSchema)

// Get all doctors
doctorRouter.get('/all-doctors', (req, res) => {
    console.log('Get all doctors');
    res.send('All doctors')
})

// insert a doctor
doctorRouter.post('/insert-doctor', async (req, res) => {
    const newDoctor = new doctor(req.body)

    await newDoctor.save(err => {
        if (err) {
            res.status(500).send({ message: 'There was a server side error!' })
        } else {
            res.status(200).send({ message: 'doctor inserted successfully!' })
        }
    })
})

module.exports = doctorRouter