const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/usermodel');

exports.register = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password, role, storeName } = req.body;

        // Ensure the role is one of the allowed values
        const allowedRoles = ['buyer', 'vendor', 'admin'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            storeName,
            isApproved: role === 'vendor' ? false : true, // Set isApproved to false for vendors initially
        });

        // Save the new user to the database
        await user.save();

        // If the user is a vendor, notify them that approval is pending
        let message = 'User registered';
        if (role === 'vendor') {
            message = 'Vendor registered successfully, awaiting admin approval.';
        }

        return res.status(200).json({ message, data: user });
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
exports.approveVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;

        // Find the vendor by ID
        const vendor = await User.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Ensure the vendor is not already approved
        if (vendor.isApproved) {
            return res.status(400).json({ message: 'Vendor is already approved' });
        }

        // Approve the vendor
        vendor.isApproved = true;
        await vendor.save();

        return res.status(200).json({ message: 'Vendor approved successfully', vendor });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};