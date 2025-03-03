const Product=require('../models/productmodel')



exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, images } = req.body;
        
        // Ensure the user is logged in and is a vendor
        if (req.user.role !== 'vendor') {
            return res.status(403).json({ message: 'Only vendors can create products' });
        }

        // Create new product and associate with logged-in vendor
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stock,
            images,
            vendor: req.user._id // Use logged-in user's ID as vendor
        });
        
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category')
            .populate('vendor', 'name email');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category')
            .populate('vendor', 'name email');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the logged-in user is the vendor who created the product or is an admin
        if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this product' });
        }

        // Update the product fields
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ensure the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this product' });
        }

        // Delete the product
        await product.remove();

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
