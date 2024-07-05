// External imports
const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const app = express()



// Internal imports
const adminRouter = require('./api/routeHandler/adminRouter');
const doctorRouter = require('./api/routeHandler/doctorRouter');
const userRouter = require('./api/routeHandler/userRouter');
const {notFoundErr, errorHandle} = require('./middleware/common/errorHandler');

const port = process.env.PORT || 5000
require('dotenv').config()



app.use(cors())
app.use(express.json())
app.use('/', userRouter)
app.use('/admin', adminRouter) // using sub app for admin router
app.use('/doctor', doctorRouter) // using sub app for doctor router
app.use('/', express.static(path.join(__dirname, './upload/avatar'))) // set avatar to static file 
app.use('/', express.static(path.join(__dirname, './upload/specialty'))) // set specialty to static file 


// database connection with mongoose
const mongoURL = `mongodb+srv://${process.env.mongoUsername}:${process.env.mongoPass}@cluster0.iw4kl2c.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoURL, { dbName: 'docEye' })
    .then(() => console.log('Database connection successful'))
    .catch((e) => console.log('Database connection lost for this err: ', e.message))

app.get('/', (req, res) => {
    console.log('homepage');
    res.send('This is homepage')
})
app.get('/test', (req, res) => {
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
// app.post('/upload-profile', upload.fields([
//     { name: 'profile-photos', maxCount: 4 },
//     { name: 'doctor-documents', maxCount: 3 },
//     { name: 'medicine-photos', maxCount: 3 },
// ]), (req, res) => {
//     console.log(req.files);
//     res.send('testing files uploaded!')
// })




// ----404 Error handling----
app.use(notFoundErr)

// Error handling middleware
app.use(errorHandle)

app.listen(port, () => {
    console.log(`Doc Eye server is running at ${port}!!`);
})
