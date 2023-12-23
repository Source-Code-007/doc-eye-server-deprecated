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
    dest: fileUploadDest
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

// upload single files
app.post('/upload-profile', upload.single('profile-picture'), (req, res)=> {
    res.send('testing file uploaded!')
})
// upload multiple files #3 is max file
app.post('/upload-profile', upload.array('profile-pictures', 3), (req, res)=> {
    res.send('testing files uploaded!')
})
// upload multiple files for different files
app.post('/upload-profile', upload.fields([
    {'profile-photo': 4},
    {'medicine-photo': 3}
]), (req, res)=> {
    res.send('testing files uploaded!')
})



// 404 Error handling
app.use((req, res, next)=>{
    res.status(404).send('Requested URL was not found!')
})


// Error handling middleware
app.use((err, req, res, next)=>{
    if(err.message){
        res.status(500).send({message:err.message})
    } else{
        res.status(500).send("There was an error!")
    }
})

app.listen(port, () => {
    console.log(`Doc Eye server is running at ${port}!!`);
})