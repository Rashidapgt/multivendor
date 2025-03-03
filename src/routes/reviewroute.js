const express = require('express');
const router = express.Router();
const { createReview, getAllReviews, getReviewById, updateReview, deleteReview } = require('../controllers/reviewcontroller');
const { auth } = require('../middlewares/auth');

// Protect routes with authentication middleware
router.post('/', auth, createReview); // Only authenticated buyers can create a review
router.get('/', getAllReviews); // Anyone can view all reviews
router.get('/:id', getReviewById); // Anyone can view a review by ID
router.put('/:id', auth, updateReview); // Only the buyer or admin can update the review
router.delete('/:id', auth, deleteReview); // Only the buyer or admin can delete the review

module.exports = router;

