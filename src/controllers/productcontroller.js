const Product = require('../models/productmodel');
const { cloudinary, uploadMiddleware } = require('../config/cloudinary'); // Import the uploadMiddleware
const Category=require('../models/categorymodel')
const mongoose = require("mongoose");

// Create Product (Vendor only)
exports.createProduct = async (req, res) => {
    try {
        uploadMiddleware.single('file')(req, res, async (err) => {  // Use uploadMiddleware here
            if (err) return res.status(400).json({ message: err.message });

            const { name, description, price, category, stock } = req.body;
            
            if (req.user.role !== 'vendor') {
                return res.status(403).json({ message: 'Only vendors can create products' });
            }

            // Check if category is an ObjectId and validate if it exists
            const categoryDoc = await Category.findById(category);
            if (!categoryDoc) {
                return res.status(400).json({ message: 'Category not found' });
            }

            let imageUrl = null;
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path, { folder: "products" });
                imageUrl = result.secure_url; // Save the Cloudinary URL to the product image
            }

            // Create new product and save
            const newProduct = new Product({
                name,
                description,
                price,
                category: categoryDoc._id,  // Make sure to use the ObjectId here
                stock,
                images: imageUrl,
                vendor: req.user._id  // Assuming req.user._id is the logged-in vendor's ID
            });

            await newProduct.save();
            res.status(201).json({ message: 'Product created successfully', product: newProduct });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// Get all Products (Public access)
exports.getAllProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let filter = {};

        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }
            filter.category = category; // Filtering by category ID
        }

        const products = await Product.find(filter)
            .populate("category", "name")
            .populate("vendor", "name")
            .exec();

        if (!products.length) {
            return res.status(404).json({ message: "No products found for this category" });
        }

        res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: error.message });
    }
};



// Get a Product by ID (Public access)
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)
            .populate('category', 'name')  // Populate category name
            .populate('vendor', 'name')    // Populate vendor name (optional)
            .exec();

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// Update Product (Vendor/Admin)
exports.updateProduct = async (req, res) => {
    try {
        uploadMiddleware.single('file')(req, res, async (err) => { // Use uploadMiddleware here
            if (err) return res.status(400).json({ message: err.message });

            const { id } = req.params;
            const { name, description, price, category, stock } = req.body;

            const product = await Product.findById(id);
            if (!product) return res.status(404).json({ message: 'Product not found' });

            if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Unauthorized to update this product' });
            }

            let categoryId = product.category; // Default to current category if not updated
            if (category) {
                const categoryDoc = await category.findOne({ name: category });
                if (!categoryDoc) {
                    return res.status(400).json({ message: 'Category not found' });
                }
                categoryId = categoryDoc._id; // Use the ObjectId of the category
            }

            let newImageUrl = product.images;
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path, { folder: "products" });
                newImageUrl = result.secure_url; // Save the new Cloudinary URL
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

// Delete Product (Admin only)
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
