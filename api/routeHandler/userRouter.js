const express = require('express')
const userRouter = express.Router()
const avatarUpload = require('../../middleware/multer/avatarUpload')
const jwtVerify = require('../../middleware/authGuard/jwtVerify')
const { addUserValidator, addUserValidatorHandler } = require('../../middleware/validator/userValidator')
const adminVerify = require('../../middleware/authGuard/adminVerify')
const { createUserController, signinUserController, getAllUsersController, getOwnProfileController, deleteUserByIdController,  } = require('../controllers/userController')



userRouter.post('/signup', avatarUpload, addUserValidator, addUserValidatorHandler, createUserController)

userRouter.post('/signin', signinUserController)

// All users
userRouter.get('/all-users', getAllUsersController)

// Get profile 
userRouter.get('/user-profile', jwtVerify, getOwnProfileController)

// Delete user by id
userRouter.delete('/delete-user/:id', jwtVerify, adminVerify, deleteUserByIdController)


module.exports = userRouter