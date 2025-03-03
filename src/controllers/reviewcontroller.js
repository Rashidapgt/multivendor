const jwt = require('jsonwebtoken');
const Review = require('../models/reviewmodel');
const { auth } = require('../middlewares/auth'); // Import auth middleware

// Create a new review (only authenticated buyers can create a review)
exports.createReview = async (req, res) => {
    try {
        const { product, rating, comment } = req.body;
        const buyer = req.user._id; // The buyer is the authenticated user

        const newReview = new Review({
            buyer,
            product,
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('buyer', 'name email').populate('product', 'name');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get review by ID
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('buyer', 'name email').populate('product', 'name');
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update review (only the buyer who created the review or admin can update the review)
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Ensure that only the buyer who created the review or an admin can update it
        if (review.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this review' });
        }

        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete review (only the buyer who created the review or admin can delete the review)
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Ensure that only the buyer who created the review or an admin can delete it
        if (review.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this review' });
        }

        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
