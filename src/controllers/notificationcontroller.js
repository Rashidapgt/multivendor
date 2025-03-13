const Order = require("../models/ordermodel");
const User = require("../models/usermodel");
const { sendEmailNotification } = require("../config/email");

// ✅ Notify Vendor About a New Order
exports.notifyVendorOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId).populate("products.product");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (!order.products || order.products.length === 0) {
            return res.status(400).json({ message: "No products found in order" });
        }

        // Fetch the vendor from the first product
        const product = order.products[0].product;
        if (!product || !product.vendor) {
            return res.status(404).json({ message: "Vendor not found for this product" });
        }

        const vendor = await User.findById(product.vendor);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const subject = "New Order Received!";
        const message = `Hello ${vendor.name},\n\nYou have received a new order (Order ID: ${order._id}).\nPlease check your vendor dashboard for details.\n\nThank you.`;

        await sendEmailNotification(vendor.email, subject, message);
        res.json({ message: "📩 Email notification sent to vendor" });
    } catch (error) {
        res.status(500).json({ message: "Error sending email notification", error: error.message });
    }
};


// ✅ Notify Customer About Order Status Change
exports.notifyCustomerOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await Order.findById(orderId).populate("customer");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Get customer details
        const customer = await User.findById(order.customer._id);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const subject = "Order Status Updated";
        const message = `Hello ${customer.name},\n\nYour order (Order ID: ${order._id}) status has been updated to: ${status}.\n\nThank you for shopping with us!`;

        await sendEmailNotification(customer.email, subject, message);
        res.json({ message: "📩 Email notification sent to customer" });
    } catch (error) {
        res.status(500).json({ message: "Error sending email notification", error: error.message });
    }
};

// ✅ Notify Admin About a New Vendor Signup
exports.notifyAdminVendorSignup = async (req, res) => {
    try {
        const { vendorId } = req.body;
        const vendor = await User.findById(vendorId);

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const adminEmail = "admin-email@gmail.com"; // Change this to your actual admin email
        const subject = "New Vendor Signup Request";
        const message = `Hello Admin,\n\nA new vendor (${vendor.name}, Email: ${vendor.email}) has signed up and is awaiting approval.\n\nPlease review the request in the admin dashboard.\n\nBest regards.`;

        await sendEmailNotification(adminEmail, subject, message);
        res.json({ message: "📩 Email notification sent to admin" });
    } catch (error) {
        res.status(500).json({ message: "Error sending email notification", error: error.message });
    }
};
