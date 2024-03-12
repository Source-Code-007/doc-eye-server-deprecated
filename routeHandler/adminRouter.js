const express = require('express');
const adminRouter = express.Router()
const jwtVerify = require('../middleware/authGuard/jwtVerify');
const specialtyUpload = require('../middleware/multer/specialtyUpload');

// Model
const Specialty = require('../models/Specialty');
const { addSpecialtyValidator, addSpecialtyValidatorHandler } = require('../middleware/validator/specialtyValidator');
const adminVerify = require('../middleware/authGuard/adminVerify');

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
adminRouter.post('/add-specialty', jwtVerify, adminVerify, specialtyUpload, addSpecialtyValidator, addSpecialtyValidatorHandler, async(req, res) => {
    try{
        const newSpecialty = new Specialty({...req.body, admin:req.userId})
        await newSpecialty.save()
        if(newSpecialty){
            res.status(200).send({msg: `Specialty inserted successfully!`, _id: newSpecialty?._id})
        }else {
         // Remove the uploaded file
         if (req.files?.length > 0) {
            unlink(path.join(__dirname, `../../upload/specialty/${req.files[0]?.filename}`), err => {
                if (err) console.log(err?.message, 'error from remove file');
            })
        }
            res.status(500).send({ errors: { common: { msg: 'There was a server side error' } } })
        }
    }catch(e){
          // Remove the uploaded file
          if (req.files?.length > 0) {
            unlink(path.join(__dirname, `../../upload/specialty/${req.files[0]?.filename}`), err => {
                if (err) console.log(err?.message, 'error from remove file');
            })
        }
        if(e?.message){
            return res.status(500).send({ errors: { common: { msg: e?.message } } })
          } 
          return res.status(500).send({ errors: { common: { msg: "There was a server side error!" } } })
    }
})

// Get specialties
adminRouter.get('/specialties', async(req, res)=> {
    try{
        const specialties = await Specialty.find({}, {__v:0}).populate("admin", "name email -_id")
        if(specialties){
          return res.status(200).send(specialties)
        } 
        res.status(500).send({ msg: 'Specialties not found!' })
    }catch(e){
        if(e?.message){
          return res.status(500).send({ errors: { common: { msg: e?.message } } })
        } 
        return res.status(500).send({ errors: { common: { msg: "There was a server side error!" } } })
    }
})

adminRouter.get('/pending-doctors', (req, res) => {
    res.send('This is pending doctors route!')
})



module.exports = adminRouter