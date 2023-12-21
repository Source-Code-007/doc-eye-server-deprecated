const express = require('express');
const cors = require('cors')
const app = express()
const adminRouter = require('./admin/adminRouter')

app.use(cors())
app.use(express.json())
app.use('/admin', adminRouter) // using sub app for admin router

const port = process.env.PORT || 4000
require('dotenv').config()





app.enable('case sensitive routing');

app.get('/', (req, res) => {
    console.log('homepage');
    res.send('This is homepage')
})
app.get('/test', (req, res) => {
    console.log('homepage test');
    res.send('This is test')
})


app.listen(port, () => {
    console.log(`Doc Eye server is running at ${port}!!`);
})