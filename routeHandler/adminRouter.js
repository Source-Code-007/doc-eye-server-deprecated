const express = require('express');
const adminRouter = express.Router()
const jwtVerify = require('../middleware/authGuard/jwtVerify');
const createError = require('http-errors')
const { unlink } = require('fs')
const path = require('path')

// Model
const Specialty = require('../models/Specialty');
const { addSpecialtyValidator, addSpecialtyValidatorHandler } = require('../middleware/validator/specialtyValidator');
const adminVerify = require('../middleware/authGuard/adminVerify');
const specialtyUpload = require('../middleware/multer/specialtyUpload');

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
adminRouter.post('/add-specialty', specialtyUpload, addSpecialtyValidator, addSpecialtyValidatorHandler, async (req, res) => {

    try {
        const { specialtyName, specialtyDescription, specialtyLogo } = req.body
        let newSpecialty
        if (req?.files?.length > 0) {
            newSpecialty = new Specialty({ specialtyName, specialtyDescription, specialtyLogo: `${process.env.SERVER_BASE_URL}/${req?.files[0]?.filename}`, admin: req.userId })
        } else {
            newSpecialty = new Specialty({ ...req.body })
        }
        await newSpecialty.save()
        if (newSpecialty) {
            res.status(200).send({ msg: `Specialty inserted successfully!`, _id: newSpecialty?._id })
        } else {
            // Remove the uploaded file
            if (req.files?.length > 0) {
                unlink(path.join(__dirname, `../upload/specialty/${req.files[0]?.filename}`), err => {
                    if (err) console.log(err?.message, 'error from specialty remove file');
                })
            }
            throw createError('There was a server side error')
        }
    } catch (e) {

        console.log(e, 'err form  add specialty');
        // Remove the uploaded file
        if (req.files?.length > 0) {
            unlink(path.join(__dirname, `../upload/specialty/${req.files[0]?.filename}`), err => {
                if (err) console.log(err?.message, 'error from remove file');
            })
        }
        if (e) {
            return res.status(500).send({ errors: { common: { msg: e } } })
        } else {
            return res.status(500).send({ errors: { common: { msg: "There was a server side error!" } } })
        }
    }
})


// Get specialties
adminRouter.get('/specialties', async (req, res) => {
    try {
        const specialties = await Specialty.find({}, { __v: 0 }).populate("admin", "name email -_id")
        if (specialties) {
            return res.status(200).send(specialties)
        }
        return res.status(500).send({ errors: { common: { msg: 'Specialties not found!' } } })
    } catch (e) {
        if (e?.message) {
            return res.status(500).send({ errors: { common: { msg: e?.message } } })
        }
        return res.status(500).send({ errors: { common: { msg: "There was a server side error!" } } })
    }
})

// Update specialties
adminRouter.patch('/update-specialty/:id', specialtyUpload, addSpecialtyValidator, addSpecialtyValidatorHandler, async (req, res) => {
    const id = req.params?.id
    const receivedData = req.body
    let updatedData

    try {
        if (req.files?.length > 0) {
            updatedData = { ...receivedData, specialtyLogo: `${process.env.SERVER_BASE_URL}/${req.files?.[0]?.filename}` }
        } else {
            updatedData = { ...receivedData }
        }
        const updatedSpecialty = await Specialty.findByIdAndUpdate(id, updatedData)
        if (updatedSpecialty) {

            // Deleted prev file from server
            if (updatedSpecialty?.specialtyLogo && req.files?.length > 0) {
                const fileName = updatedSpecialty?.specialtyLogo.split('/').at(-1)
                unlink(path.join(__dirname, `../upload/specialty/${fileName}`), err => {
                    if (err) console.log(err?.message, 'error from remove file');
                })
            }
            res.status(200).send({ message: 'Specialty updated', id: updatedSpecialty?._id })
        } else {
            throw createError('Specialty not found to update')
        }
    } catch (e) {
        if (e?.message) {
            res.status(500).send({ errors: { common: { msg: e?.message } } })
        } else {
            res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
        }
    }

})

// Delete specialties
adminRouter.delete('/delete-specialty/:id', async (req, res) => {
    const id = req.params?.id
    try {
        const deleteSpecialty = await Specialty.findByIdAndDelete(id)
        if (deleteSpecialty) {
            // Remove the uploaded file
            if (deleteSpecialty?.specialtyLogo) {
                const fileName = deleteSpecialty?.specialtyLogo.split('/').at(-1)
                unlink(path.join(__dirname, `../upload/specialty/${fileName}`), err => {
                    if (err) console.log(err?.message, 'error from remove file');
                })
            }
            res.status(200).send({
                message: 'Specialty deleted successfully'
            })
        } else {
            throw createError('Specialty not found to delete')
        }
    } catch (e) {
        if (e?.message) {
            res.status(500).send({ errors: { common: { msg: e?.message } } })
        } else {
            res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
        }
    }

})

adminRouter.get('/pending-doctors', (req, res) => {
    res.send('This is pending doctors route!')
})



module.exports = adminRouter