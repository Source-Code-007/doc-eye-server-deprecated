const express = require('express');
const cors = require('cors')
const app = express()
const adminRouter = require('./admin/adminRouter')
const multer = require('multer')

const port = process.env.PORT || 4000
require('dotenv').config()


app.use(cors())
app.use(express.json())
app.use('/admin', adminRouter) // using sub app for admin router

// prepare the final multer upload object
const fileUploadDest = './upload'
const upload = multer({
    dest: fileUploadDest,
    limits: {
        fileSize: 1000000 // 1MB - By bytes
    }, 
    fileFilter: (req, file, callback)=>{
        console.log(file);
        if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
            callback(null, true) // first param - error null, second param - permit true
        } else{
            callback(new Error('Only .jpg, .jpeg and .png format allowed!'))
        }
    }
})

app.enable('case sensitive routing');

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
app.post('/upload-profile', upload.single('profile-picture'), (req, res)=> {
    res.send('testing file uploaded!')
})
// // upload multiple files #3 is max file
// app.post('/upload-profile', upload.array('profile-pictures', 3), (req, res)=> {
//     res.send('testing files uploaded!')
// })
// // upload multiple files for different files
// app.post('/upload-profile', upload.fields([
//     {name: 'profile-photo', maxCount: 4},
//     {name: 'medicine-photo', maxCount: 3}
// ]), (req, res)=> {
//     res.send('testing files uploaded!')
// })



// ----404 Error handling----
app.use((req, res, next)=>{
    res.status(404).send('Requested URL was not found!')
})


// Error handling middleware
app.use((err, req, res, next)=>{
    if(err.message){
        if(err instanceof multer.MulterError){
            res.status(500).send({message: 'There was an file upload related error!'})
        } else{
            res.status(500).send({message:err.message})
        }
    } else{
        res.status(500).send("There was an error!")
    }
})

app.listen(port, () => {
    console.log(`Doc Eye server is running at ${port}!!`);
})
