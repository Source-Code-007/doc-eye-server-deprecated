const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userRouter = express.Router()
const User = require('../models/Users')


userRouter.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        const hashPass = await bcrypt.hash(password, 10) //Password encrypted using bcrypt
        const existUser = await User.findOne({ email: email })

        if (!existUser) {
            const newUser = new User({ name, email, password: hashPass, role })
            await newUser.save()
            if (newUser) {
                res.status(200).send({ message: 'User created successfully' })
            } else {
                res.status(500).send({ message: 'There was a server side error' })
            }
        } else {
            res.status(500).send({ message: 'This email has already been registered!' })
        }

    } catch (e) {
        if (e?.message) {
            res.status(500).send({ message: e?.message })
        } else {
            res.status(500).send({ message: `There was a server side error` })
        }
    }
})

userRouter.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email }, { __v: 0 })
        if (user) {
            const isValidPass = await bcrypt.compare(password, user?.password) //Password encrypted using bcrypt
            if (isValidPass) {
                const jwtToken = jwt.sign({ email, _id: user?._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
                res.status(200).send({ message: 'Login successfully', token: jwtToken })
            } else {
                res.status(500).send({ message: 'Authentication failed!' })
            }
        }
        else {
            res.status(500).send({ message: 'Authentication failed!' })
        }
    } catch (e) {
        if (e?.message) {
            res.status(500).send({ message: e?.message })
        } else {
            res.status(500).send({ message: `Authentication failed!` })
        }
    }
})


module.exports = userRouter