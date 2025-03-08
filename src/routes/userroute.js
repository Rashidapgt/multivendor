const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserById, updateUser, deleteUser,updateProfile,forgotPassword,resetPassword,deactivateAccount } = require('../controllers/usercontroller');
const { auth, adminOnly } = require('../middlewares/auth');

// Protect routes with authentication middleware
router.post('/', auth, adminOnly, createUser); // Only admin can create a user
router.get('/', auth, adminOnly, getAllUsers); // Only admin can view all users
router.get('/:id', auth, getUserById); // Only admin can view any user or user can view themselves
router.put('/:id', auth, updateUser); // Only user or admin can update user
router.delete('/:id', auth, adminOnly, deleteUser); // Only admin can delete a user
router.put("/profile", auth, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/deactivate-account", auth, deactivateAccount);

module.exports = router;
