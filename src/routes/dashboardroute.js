const express = require('express');
const { auth, adminOnly, vendorOnly, buyerOnly } = require('../middlewares/auth');
const User = require('../models/usermodel')
const Order = require('../models/ordermodel')
const Product = require('../models/productmodel')
const Withdrawal=require('../models/withdrawalmodel')

const router = express.Router();

router.get('/admin-dashboard', auth, adminOnly, async (req, res) => {
    try {
        // Fetch data relevant to Admin (e.g., all users, all orders)
        const users = await User.find();  // List all users
        const orders = await Order.find();  // List all orders

        res.json({
            message: "Welcome to the Admin Dashboard",
            data: {
                users,
                orders,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Vendor Dashboard Route (Vendor only)
router.get('/vendor-dashboard', auth, vendorOnly, async (req, res) => {
    try {
        const vendorId = req.user._id;  // Get vendor ID from authenticated user

        // Fetch products, orders related to this vendor
        const products = await Product.find({ vendor: vendorId });
        const orders = await Order.find({ vendor: vendorId });

        // Calculate total revenue from orders
        let totalRevenue = 0;
        orders.forEach(order => {
            totalRevenue += order.totalAmount;  // Assuming each order has a `totalAmount` field
        });

        // Calculate stock updates (total products sold)
        let stockUpdates = products.map(product => {
            const soldQuantity = orders.reduce((total, order) => {
                const productInOrder = order.items.find(item => item.product.toString() === product._id.toString());
                return total + (productInOrder ? productInOrder.quantity : 0);
            }, 0);
            return { productName: product.name, stockLeft: product.stock - soldQuantity };
        });

        res.json({
            message: "Welcome to the Vendor Dashboard",
            data: {
                products,
                orders,
                totalRevenue,
                stockUpdates,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get("/analytics", auth,vendorOnly,async (req,res)=> {
    try {
        const vendorId = req.user.id;

        // Get total revenue and order count
        const orders = await Order.find({ "items.vendorId": vendorId });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const totalOrders = orders.length;

        // Get stock updates
        const products = await Product.find({ vendor: vendorId });
        const lowStock = products.filter(p => p.stock < 10);

        res.json({
            totalRevenue,
            totalOrders,
            lowStock,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Request withdrawal
router.post("/withdraw", auth,vendorOnly,async(req,res)=>{
    try {
        const vendorId = req.user.id;
        const { amount, paymentMethod } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid withdrawal amount" });
        }

        const newWithdrawal = new Withdrawal({
            vendor: vendorId,
            amount,
            paymentMethod,
            status: "Pending",
        });

        await newWithdrawal.save();
        res.json({ message: "Withdrawal request submitted", withdrawal: newWithdrawal });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Get vendor's withdrawal requests
router.get("/withdrawals",auth,vendorOnly,async(req, res) => {
    try {
        const vendorId = req.user.id;
        const withdrawals = await withdrawals.find({vendor:vendorId})

        res.json({ withdrawals });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Buyer Dashboard Route (Buyer only)
router.get('/buyer-dashboard', auth, buyerOnly, async (req, res) => {
    try {
        // Fetch data relevant to Buyer (e.g., orders, wishlist)
        const buyerId = req.user._id;  // Get buyer ID from authenticated user

        const orders = await Order.find({ buyer: buyerId });  // List orders related to this buyer
        const wishlist = await Wishlist.find({ buyer: buyerId });  // List wishlist items related to this buyer (assuming you have a Wishlist model)

        res.json({
            message: "Welcome to the Buyer Dashboard",
            data: {
                orders,
                wishlist,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;