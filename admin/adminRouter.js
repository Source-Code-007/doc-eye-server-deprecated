const express = require('express');

const adminRouter = express.Router()

adminRouter.get('/', (req, res)=> {
    res.send('This is admin home!')
})
adminRouter.get('/pending-doctors', (req, res)=> {
    res.send('This is pending doctors route!')
})

module.exports = (adminRouter)