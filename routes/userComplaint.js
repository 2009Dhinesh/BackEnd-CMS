const express = require('express');

// use the router()
const router = express.Router();


const { userMiddleware } = require('../middleware/userMiddleware');

// Destructure the correct exported function
const {userComplaint} = require('../controllers/userControllers');

// Attach the route
router.post('/apply', userComplaint);


module.exports = router;
