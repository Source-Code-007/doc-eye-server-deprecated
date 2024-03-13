const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userRouter = express.Router()
const User = require('../models/Users')
const avatarUpload = require('../middleware/multer/avatarUpload')
const { unlink } = require('fs')
const path = require('path');
const jwtVerify = require('../middleware/authGuard/jwtVerify')
const { addUserValidator, addUserValidatorHandler } = require('../middleware/validator/userValidator')
const createError = require('http-errors')
const adminVerify = require('../middleware/authGuard/adminVerify')



userRouter.post('/signup', avatarUpload, addUserValidator, addUserValidatorHandler, async (req, res) => {

    try {
        const { name, email, gender, phone, password, role, avatar } = req.body
        const hashPass = await bcrypt.hash(password, 10) //Password encrypted using bcrypt
        const existUser = await User.findOne({ email: email })

        if (!existUser) {
            let newUser;
            if (req.files?.length > 0) {
                if (req?.files[0]?.filename) {
                    newUser = new User({ ...req.body, avatar: `${process.env.SERVER_BASE_URL}/avatar/${req?.files[0]?.filename}`, password: hashPass })
                }
            } else {
                newUser = new User({ ...req.body, password: hashPass })
            }
            await newUser.save()
            if (newUser) {
                res.status(200).send({ message: 'User created successfully' })
            } else {
                // Remove the uploaded file
                if (req.files?.length > 0) {
                    unlink(path.join(__dirname, `../upload/avatar/${req.files[0]?.filename}`), err => {
                        if (err) console.log(err?.message, 'error from remove file');
                    })
                }
                throw createError('There was a server side error')
            }
        } else {
            // Remove the uploaded file
            if (req.files?.length > 0) {
                unlink(path.join(__dirname, `../upload/avatar/${req.files[0]?.filename}`), err => {
                    if (err) console.log(err?.message, 'error from remove file');
                })
            }
            throw createError('There was a server side error')
        }

    } catch (e) {
        // Remove the uploaded file
        if (req.files?.length > 0) {
            unlink(path.join(__dirname, `../upload/avatar/${req.files[0]?.filename}`), err => {
                if (err) console.log(err?.message, 'error from remove file');
            })
        }

        if (e?.message) {
            res.status(500).send({ errors: { common: { msg: e?.message } } })
        } else {
            res.status(500).send({ errors: { common: { msg: `There was a server side error` } } })
        }
    }
})

userRouter.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({
            $or: [{ email: username }, { phone: username }]
        })


        if (user) {
            const isValidPass = await bcrypt.compare(password, user?.password) //Password decrypted using bcrypt
            if (isValidPass) {
                const jwtToken = jwt.sign({ username, _id: user?._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })
                res.status(200).send({ message: 'Login successfully', token: jwtToken })
            } else {
                throw createError('Authentication failed!')
            }
        }
        else {
            throw createError('Authentication failed!')
        }
    } catch (e) {
        if (e?.message) {
            res.status(500).send({ errors: { common: { msg: e?.message } } })
        } else {
            res.status(500).send({ errors: { common: { msg: 'Authentication failed!' } } })
        }
    }
})

// All users
userRouter.get('/all-users', async (req, res) => {
    try {
        const users = await User.find({}, { __v: 0 })
        if (users) {
            res.status(200).send({
                message: 'Users found!',
                data: users
            })
        } else {
            throw createError('Users not found!')
        }
    } catch (e) {
        if (e?.message) {
            res.status(500).send({ errors: { common: { msg: e?.message } } })
        } else {
            res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
        }
    }
})

// Get profile 
userRouter.get('/user-profile', jwtVerify, async (req, res) => {
    try {
        const username = req.username
        const user = await User.findOne({ $or: [{ email: username }, { phone: username }] }, { __v: 0 })
        if (user) {
            res.status(200).send({
                message: 'User found!',
                data: user
            })
        } else {
            throw createError('User not found!')
        }
    } catch (e) {
        if (e?.message) {
            res.status(500).send({ errors: { common: { msg: e?.message } } })
        } else {
            res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
        }
    }
})

// TODO: remove avatar after remove user
userRouter.delete('/delete-user/:id', jwtVerify, adminVerify, async (req, res) => {
    const id = req?.params.id
    try {
        const deletedUser = await User.findByIdAndDelete(id)
        if (deletedUser) {
            // Remove the uploaded file
            if(deletedUser?.avatar){
                unlink(path.join(__dirname, `../upload/avatar/${deletedUser?.avatar}`), err => {
                    if (err) console.log(err?.message, 'error from remove file');
                })
            }
            res.status(200).send({
                message: 'User deleted successfully!',
            })
        } else {
            throw createError('User not found to delete')
        }
    } catch (e) {
        if (e?.message) {
            res.status(500).send({ errors: { common: { msg: e?.message } } })
        } else {
            res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
        }
    }


    // Delete avatar after remove user
    // if(user.avatar){
    //     unlink(path.join(__dirname, `upload/avatar/${user.avatar}`), err=> {
    //         if(err) console.log(err?.message);
    //     })
    // }

})


module.exports = userRouter