const express = require('express') 
const mongoose = require('mongoose') 
const userRouter = express.Router()
const userSchema = require('../schemas/userSchema')
const User = new mongoose.model('user', userSchema)


userRouter.post('/sign-up', (req, res)=> {
    res.send('Signup route triggered')
})


module.exports = userRouter