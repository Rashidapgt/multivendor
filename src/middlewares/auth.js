const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/usermodel');

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Authentication error: Token missing" });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Authentication error: Invalid or expired token" });
        }
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};


exports.vendorOnly = (req, res, next) => {
    if (req.user.role !== 'vendor') {
        return res.status(403).json({ message: "Access denied: Vendors only" });
    }
    next();
};
exports.buyerOnly = (req, res, next) => {
    if (req.user.role !== 'buyer') {
        return res.status(403).json({ message: "Access denied: Buyers only" });
    }
    next();
};