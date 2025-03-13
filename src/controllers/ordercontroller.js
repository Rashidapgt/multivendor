const Order=require('../models/ordermodel')
require('dotenv')

exports.createOrder = async (req, res) => {
    try {
        const { buyer, products, totalAmount } = req.body;

        // Ensure products and other fields are valid
        if (!buyer || !products || products.length === 0 || !totalAmount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create the new order object
        const newOrder = new Order({
            buyer,
            products,
            totalAmount
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
};

// Get all orders with population
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('buyer', 'name email')
            .populate('products.product', 'name price')
            .exec(); // Ensure population happens after exec
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Get order by ID with population
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('buyer', 'name email')
            .populate('products.product', 'name price')
            .exec(); // Ensure population happens after exec
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
};
// Update order (status or payment status)
exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
