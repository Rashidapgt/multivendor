const Payment = require('../models/paymentmodel');

// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const { order, paymentMethod, transactionId } = req.body;
        
        const newPayment = new Payment({
            order,
            paymentMethod,
            transactionId,
            paymentStatus: transactionId ? 'Completed' : 'Pending'
        });
        
        await newPayment.save();
        res.status(201).json({ message: 'Payment recorded successfully', payment: newPayment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('order');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('order');
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update payment status
exports.updatePayment = async (req, res) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPayment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json({ message: 'Payment updated successfully', payment: updatedPayment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete payment
exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
