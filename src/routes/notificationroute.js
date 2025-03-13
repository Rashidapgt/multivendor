const express = require("express");
const router = express.Router();
const { notifyVendorOrder, notifyCustomerOrderStatus, notifyAdminVendorSignup } = require("../controllers/notificationcontroller");
const { auth, adminOnly } = require("../middlewares/auth");

// Route: Notify Vendor About a New Order
router.post("/vendor/order", auth, notifyVendorOrder);

// Route: Notify Customer About Order Status Change
router.post("/customer/order-status", auth, notifyCustomerOrderStatus);

// Route: Notify Admin About a New Vendor Signup
router.post("/admin/vendor-signup", adminOnly, notifyAdminVendorSignup);

module.exports = router;
