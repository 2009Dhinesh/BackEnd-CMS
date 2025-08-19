const mongoose = require('mongoose');

require('dotenv').config();

const URL = process.env.MONGODB;

const mongooseDb = ()=> mongoose.connect( URL)
    .then(()=>console.log("DataBase Connect Successfully..."))
    .catch(err=>{
        console.log(err)
    })

module.exports = mongooseDb ;
