const express = require('express');
const router = express.Router();
const { applyCoupon } = require('../controllers/couponcontroller')
const { auth } = require('../middlewares/auth');

// Define the route to apply coupon
router.post('/apply', auth, applyCoupon);

module.exports = router;
