const express = require('express');
const adminRouter = express.Router()

const jwtVerify = require('../../middleware/authGuard/jwtVerify')

// Model
const { addSpecialtyValidator, addSpecialtyValidatorHandler, updateSpecialtyValidator } = require('../../middleware/validator/specialtyValidator');
const specialtyUpload = require('../../middleware/multer/specialtyUpload');
const { addSpecialtyController, getSpecialtiesController, updateSpecialtyController, deleteSpecialtyController } = require('../controllers/adminController');

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
adminRouter.post('/add-specialty', jwtVerify, specialtyUpload, addSpecialtyValidator, addSpecialtyValidatorHandler, addSpecialtyController)


// Get specialties
adminRouter.get('/specialties', getSpecialtiesController)

// Update specialties
adminRouter.patch('/update-specialty/:id', specialtyUpload, updateSpecialtyValidator, addSpecialtyValidatorHandler, updateSpecialtyController)

// Delete specialties
adminRouter.delete('/delete-specialty/:id', deleteSpecialtyController)

adminRouter.get('/pending-doctors', (req, res) => {
    res.send('This is pending doctors route!')
})


module.exports = adminRouter