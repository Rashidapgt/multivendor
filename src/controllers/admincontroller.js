const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/usermodel');

exports.register = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password, role,storeName } = req.body;

        // Ensure the role is one of the allowed values
        const allowedRoles = ['buyer', 'vendor', 'admin'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const userExists = await User.findOne({ name });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role ,storeName});

        await user.save();
        return res.status(200).json({ message: 'User registered', data: user });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.login = async (req, res) => {
    try {
        console.log(req.body);
        const { name, password } = req.body;

        const user = await User.findOne({ name });
        if (!user) return res.status(404).json({ message: 'No user found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

        // Generate JWT token with role included
        const token = jwt.sign(
            { id: user._id, name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set token as HttpOnly cookie
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.logout = async (req, res) => {
    try {
        res.cookie('token', '', { 
            httpOnly: true, 
            expires: new Date(0) // Expire the cookie immediately
        });
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
