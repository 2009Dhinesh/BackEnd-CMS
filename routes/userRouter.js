const express = require('express');

// use the router()
const router = express.Router();

const { userMiddleware } = require('../middleware/userMiddleware');

// Destructure the correct exported function
const { userRegister , userLogin , userDetails , updateUserProfile , userComplaint, forgetPassword ,restPassword} = require('../controllers/userControllers');

// Attach the route
router.post('/signup', userRegister);
router.post('/login', userLogin);
router.put('/update/:id', userMiddleware, updateUserProfile);
router.post('/complaint', userComplaint);
router.post('/forgot-password', forgetPassword);
router.post('/reset-password/:token', restPassword);


module.exports = router;
