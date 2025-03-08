const Product=require('../models/productmodel')
const {cloudinary}=require('../config/cloudinary')
const multer = require('multer');



// Create Product (Vendor only)
exports.createProduct = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) return res.status(400).json({ message: err.message });

            const { name, description, price, category, stock } = req.body;
            if (req.user.role !== 'vendor') {
                return res.status(403).json({ message: 'Only vendors can create products' });
            }

            let imageUrl = null;
            if (req.file) {
                const result = await cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
                    if (error) return res.status(500).json({ error: error.message });
                    imageUrl = result.secure_url;
                }).end(req.file.buffer);
            }

            const newProduct = new Product({
                name, description, price, category, stock,
                images: imageUrl,
                vendor: req.user._id
            });

            await newProduct.save();
            res.status(201).json({ message: 'Product created successfully', product: newProduct });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category').populate('vendor', 'name email');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category').populate('vendor', 'name email');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update product (Vendor/Admin)
exports.updateProduct = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) return res.status(400).json({ message: err.message });

            const { id } = req.params;
            const { name, description, price, category, stock } = req.body;

            const product = await Product.findById(id);
            if (!product) return res.status(404).json({ message: 'Product not found' });

            if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Unauthorized to update this product' });
            }

            let newImageUrl = product.images;
            if (req.file) {
                const result = await cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
                    if (error) return res.status(500).json({ error: error.message });
                    newImageUrl = result.secure_url;
                }).end(req.file.buffer);
            }

            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            product.images = newImageUrl;

            await product.save();
            res.status(200).json({ message: 'Product updated successfully', product });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to delete this product' });
        }

        if (product.images) {
            const publicId = product.images.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await product.remove();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};