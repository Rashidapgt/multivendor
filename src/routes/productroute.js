const express = require("express");
const router = express.Router();
const { auth, vendorOnly, adminOnly } = require("../middlewares/auth");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productcontroller");

// Routes
router.post("/", auth, vendorOnly, createProduct); // Vendor can create product
router.get("/", getAllProducts); // Public: Get all products
router.get("/:id", getProductById); // Public: Get product by ID
router.put("/:id", auth, vendorOnly, updateProduct); // Vendor/Admin can update
router.delete("/:id", auth, adminOnly, deleteProduct); // Admin can delete

module.exports = router;
