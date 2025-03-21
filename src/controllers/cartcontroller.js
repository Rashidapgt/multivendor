const Cart = require("../models/cartmodel");
const Product = require("../models/productmodel"); // Import Product model
const { auth } = require("../middlewares/auth");

// 🛒 Add product to cart


exports.addToCart = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const buyer = req.user?.id;  // Get user ID from authenticated request

        if (!buyer) return res.status(401).json({ message: "Unauthorized: No user found" });

        // Validate quantity
        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        // Ensure product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ userId: buyer });

        if (!cart) {
            cart = new Cart({ userId: buyer, items: [{ productId: product, quantity }] });
        } else {
            const existingProduct = cart.items.find((p) => p.productId.toString() === product);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.items.push({ productId: product, quantity });
            }
        }

        await cart.save();
        res.status(201).json({ message: "Product added to cart", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 🛍 Get cart by buyer ID
exports.getCart = async (req, res) => {
    try {
        const buyer = req.user?.id;
        if (!buyer) return res.status(401).json({ message: "Unauthorized" });

        const cart = await Cart.findOne({ buyer }).populate("products.product", "name price images");
        if (!cart || cart.products.length === 0) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✏️ Update cart (change quantity or remove product)
exports.updateCart = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const buyer = req.user?.id;
        if (!buyer) return res.status(401).json({ message: "Unauthorized" });

        let cart = await Cart.findOne({ buyer });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productIndex = cart.products.findIndex((p) => p.product.toString() === product);
        if (productIndex > -1) {
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1); // Remove product if quantity is 0
            }

            await cart.save();
            return res.status(200).json({ message: "Cart updated successfully", cart });
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🗑 Clear cart
exports.clearCart = async (req, res) => {
    try {
        const buyer = req.user?.id;
        if (!buyer) return res.status(401).json({ message: "Unauthorized" });

        const cart = await Cart.findOneAndDelete({ buyer });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

