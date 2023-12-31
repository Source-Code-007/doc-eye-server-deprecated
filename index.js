const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const adminRouter = require('./admin/adminRouter')
const multer = require('multer')
const path = require('path')

const port = process.env.PORT || 4000
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use('/admin', adminRouter) // using sub app for admin router


// ---- prepare the final multer upload object ----
const fileUploadDest = './upload'
// define storage 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, fileUploadDest)
    },
    filename: (req, file, cb) => {
        // const modifiedFileNameArr = file.originalname.split('.');
        // const fileExt = modifiedFileNameArr.at(-1)
        const fileExt = path.extname(file.originalname)
        const modifiedName = `${file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-')}-${Date.now()}${fileExt}`
        console.log(modifiedName);
        cb(null, modifiedName)
    }
})
// file upload config and operation
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 // 1MB - By bytes
    },
    fileFilter: (req, file, callback) => {
        console.log(file);
        if (file.fieldname === 'medicine-photos') {
            if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
                callback(null, true) // first param - error null, second param - permit true
            } else {
                callback(new Error('Only .jpg, .jpeg and .png format allowed!'))
            }
        } else if (file.fieldname === 'doctor-documents') {
            if (file.mimetype === 'application/pdf') {
                callback(null, true) // first param - error null, second param - permit true
            } else {
                callback(new Error('Only .pdf format allowed!'))
            }
        } else {
            callback(new Error('File upload err!!!'))
        }
    }
})



// database connection with mongoose
mongoose.connect('mongodb://localhost/doceye')
    .then(() => console.log('connection successful'))
    .catch((e) => console.log('connection lost for err!', e))

app.get('/', (req, res) => {
    console.log('homepage');
    res.send('This is homepage')
})
app.get('/test', (req, res) => {
    console.log('homepage test');
    res.send('This is test')
})



// ----upload files----
// upload single files 
// app.post('/upload-profile', upload.single('profile-picture'), (req, res)=> {
// console.log(req.file);
//     res.send('testing file uploaded!')
// })
// // upload multiple files #3 is max file
// app.post('/upload-profile', upload.array('profile-pictures', 3), (req, res)=> {
// console.log(req.files);
//     res.send('testing files uploaded!')
// })
// // upload multiple files for different files
app.post('/upload-profile', upload.fields([
    { name: 'profile-photos', maxCount: 4 },
    { name: 'doctor-documents', maxCount: 3 },
    { name: 'medicine-photos', maxCount: 3 },
]), (req, res) => {
    console.log(req.files);
    res.send('testing files uploaded!')
})



// ----404 Error handling----
app.use((req, res, next) => {
    res.status(404).send('Requested URL was not found!')
})


// Error handling middleware
app.use((err, req, res, next) => {
    if (err.message) {
        if (err instanceof multer.MulterError) {
            res.status(500).send({ message: 'There was an file upload related error!' })
        } else {
            res.status(500).send({ message: err.message })
        }
    } else {
        res.status(500).send("There was an error!")
    }
})

app.listen(port, () => {
    console.log(`Doc Eye server is running at ${port}!!`);
})
