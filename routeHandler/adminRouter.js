const express = require('express');
const mongoose = require('mongoose')
const adminRouter = express.Router()

// Schema model
const specialtySchema = require('../schemas/specialtySchema')
const Specialty = new mongoose.model('Specialty', specialtySchema)

// Testing middleware
const adminLogger = (req, res, next) => {
    console.log('admin router fired!');
    next()
}


// Both are same for use application level middleware
// adminRouter.use(adminLogger)
adminRouter.all('*', adminLogger)


adminRouter.get('/', (req, res) => {
    // res.send('This is admin home!')
    // throw new Error('error happened')
    res.send('This is admin home!')
})

// Insert specialty
adminRouter.post('/add-specialty', async(req, res) => {
    try{
        const newSpecialty = new Specialty(req.body)
        await newSpecialty.save()
        res.status(200).send({message: `Specialty inserted successfully!`, _id: newSpecialty?._id})
    }catch(e){
        res.status(500).send({message: "There was a server side error!"})
    }
})

adminRouter.get('/pending-doctors', (req, res) => {
    res.send('This is pending doctors route!')
})



module.exports = adminRouter