// express framework install
const express = require('express');

// cors is check the port and connect to the different origin 
const cors = require('cors');

// import the routes folder
const userRouter = require('./routes/userRouter'); 
const userComplaint = require('./routes/userComplaint'); 
const adminRoutes = require('./routes/adminRoutes');

// assign the express() function in variable app
const app = express();

// app used in the cors and handling request 
app.use(cors());

// save json format and req body
app.use(express.json());

// debug middleware — log incoming request body
app.use((req, res, next) => {
    console.log(`📩 ${req.method} ${req.url}`);
    console.log('📦 Request Body:', req.body);
    next();
});

// secure the data and environment. config is read the env file
require('dotenv').config();

// add the database 
const db = require('./DataBase/db');
// call the database function
db();

// create get method send some response
app.get('/', (req, res) => res.send('Hello World'));

// use the router
app.use('/user', userRouter);
app.use('/complaint', userComplaint);
app.use('/admin', adminRoutes);

// run the server 
app.listen(process.env.PORT || 8081, '0.0.0.0', () => {
    console.log(`✅ Server running at: http://localhost:${process.env.PORT || 8081}`);
});
