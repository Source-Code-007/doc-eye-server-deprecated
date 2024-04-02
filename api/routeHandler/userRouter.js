const express = require('express')
const userRouter = express.Router()
const avatarUpload = require('../../middleware/multer/avatarUpload')
const jwtVerify = require('../../middleware/authGuard/jwtVerify')
const { addUserValidator, addUserValidatorHandler } = require('../../middleware/validator/userValidator')
const adminVerify = require('../../middleware/authGuard/adminVerify')
const { createUserController, signinUserController, getAllUsersController, getOwnProfileController, deleteUserController } = require('../controllers/userController')



userRouter.post('/signup', avatarUpload, addUserValidator, addUserValidatorHandler, createUserController)

userRouter.post('/signin', signinUserController)

// All users
userRouter.get('/all-users', getAllUsersController)

// Get profile 
userRouter.get('/user-profile', jwtVerify, getOwnProfileController)

// TODO: remove avatar after remove user
userRouter.delete('/delete-user/:id', jwtVerify, adminVerify, deleteUserController)


module.exports = userRouter