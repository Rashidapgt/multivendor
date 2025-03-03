const Category=require('../models/categorymodel')


// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const newCategory = new Category({ name, description });
        
        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};