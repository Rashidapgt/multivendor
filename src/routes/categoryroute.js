const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories, getCategoryById, updateCategory } = require('../controllers/categorycontroller');
const { auth } = require('../middlewares/auth'); // Import the auth middleware

// Create a new category (authentication required)
router.post('/', auth, createCategory);

// Get all categories (authentication is not strictly necessary, but could be secured for admin)
router.get('/', getAllCategories);

// Get category by ID (authentication is not strictly necessary)
router.get('/:id', getCategoryById);

// Update category (authentication required)
router.put('/:id', auth, updateCategory);

module.exports = router;
