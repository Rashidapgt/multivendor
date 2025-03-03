const Cart=require('../models/cartmodel')

// Add product to cart
const { auth } = require('../middlewares/auth');  // Import the auth middleware

exports.addToCart = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const buyer = req.user.id;  // Assuming the buyer is the authenticated user

        let cart = await Cart.findOne({ buyer });
        
        if (!cart) {
            cart = new Cart({ buyer, products: [{ product, quantity }] });
        } else {
            const existingProduct = cart.products.find(p => p.product.toString() === product);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product, quantity });
            }
        }
        
        await cart.save();
        res.status(201).json({ message: 'Product added to cart', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get cart by buyer ID
exports.getCart = async (req, res) => {
    try {
        const buyer = req.user.id;  // Assuming the buyer is the authenticated user
        const cart = await Cart.findOne({ buyer }).populate('products.product', 'name price');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update cart (change quantity or remove product)
exports.updateCart = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const buyer = req.user.id;  // Assuming the buyer is the authenticated user
        let cart = await Cart.findOne({ buyer });
        
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        
        const productIndex = cart.products.findIndex(p => p.product.toString() === product);
        if (productIndex > -1) {
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1);
            }
        }
        
        await cart.save();
        res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const buyer = req.user.id;  // Assuming the buyer is the authenticated user
        const cart = await Cart.findOneAndDelete({ buyer });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
