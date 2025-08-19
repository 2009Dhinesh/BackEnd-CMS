const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();


// import routes

const userRouter = require('./routes/userRouter')

app.use(cors);
app.use(express.json());


// add routes 

app.get('/user' , userRouter);


app.listen(process.env.PORT || 8081 , (req , res)=>{
    try {
        console.log(`Server run on the port  http://localhost:/${process.env.PORT || 8081}`)
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
})