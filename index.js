const express = require('express');
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 4000
require('dotenv').config()



app.get('/', (req, res)=>{
    console.log('homepage');
    res.send('This is homepage')
})


app.listen(port, ()=>{
    console.log(`Doc Eye server is running at ${port}!!`);
})