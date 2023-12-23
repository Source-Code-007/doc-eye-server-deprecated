const express = require('express');

const adminRouter = express.Router()

// Testing middleware
const adminLogger = (req, res, next)=>{
    console.log('admin router fired!');
    next()
}


// Both are same for use application level middleware
// adminRouter.use(adminLogger)
adminRouter.all('*', adminLogger)


adminRouter.get('/', (req, res)=> {
    // res.send('This is admin home!')
    // throw new Error('error happened')
    res.send(a)
})
adminRouter.get('/pending-doctors', (req, res)=> {
    res.send('This is pending doctors route!')
})



module.exports = adminRouter