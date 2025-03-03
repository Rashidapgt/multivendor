const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/usermodel');
const { auth, adminOnly } = require('../middlewares/auth'); // Import auth middleware

// Create a new user (admin only)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, storeName, address } = req.body;

        // Only admin can create users
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can create users' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            storeName: role === 'vendor' ? storeName : undefined,
            address
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        // Only admin can get all users
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can access all users' });
        }

        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user by ID (authenticated user or admin)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Admin can access any user, user can access their own profile
        if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to access this user' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user (only the user themselves or admin)
exports.updateUser = async (req, res) => {
    try {
        const { name, email, password, role, storeName, address } = req.body;
        const updatedFields = { name, email, role, storeName, address };

        // Admin can update any user, user can only update themselves
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this user' });
        }

        if (password) {
            updatedFields.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        // Only admin can delete a user
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete users' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
