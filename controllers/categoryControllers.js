const mongoose = require('mongoose');
const Category = require('../models/categorySchema'); 

// GET all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
        console.log('--Get All Categories--');
        console.log('Database:', mongoose.connection.name);
        console.log('Collection:', Category.collection.name);
    } catch (error) {
        console.error('Error loading categories from database', error);
        res.status(500).json({message:'Error loading categories from database',error:error.message});
    }
};

// GET one category by ID
const getOneCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json('Category not found');
        }
        res.status(200).json(category);
        console.log('--Get One Category--');
        console.log('Database:', mongoose.connection.name);
        console.log('Collection:', Category.collection.name);
    } catch (error) {
        console.error('Error loading category from database', error);
        res.status(500).json({message:'Error loading categories from database',error:error.message});
    }
};

// POST create a new category
const createCategory = async (req, res) => {
    try {
        const newCategory = new Category({
            name:req.body.name,
            description:req.body.description
        });
        const savedCategory = await newCategory.save();
        res.status(201).json({message:'Category created successfully'});
        console.log('--Category Created--');
        console.log('Database:', mongoose.connection.name);
        console.log('Collection:', Category.collection.name);
    } catch (error) {
        console.error('Error creating category', error);
        res.status(400).json({message:'Error creating category',error:error.message});
    }
};

// PUT update a category by ID
const updateCategory = async (req, res) => {
    try {
        const categoryData = {
            name:req.body.name,
            description:req.body.description
        };
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {$set:categoryData},
            {new:true}
        );
        if (!updatedCategory) {
            return res.status(404).json({message:'Category updated successfully'});
        }
        res.status(200).json(updatedCategory);
        console.log('--Category Updated--');
        console.log('Database:', mongoose.connection.name);
        console.log('Collection:', Category.collection.name);
    } catch (error) {
        console.error('Error updating category', error);
        res.status(400).json({message:'Error updating category',error:error.message});
    }
};

// DELETE category by ID
const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json('Category not found');
        }
        res.status(200).json({ message: 'Category deleted successfully' });
        console.log('--Category Deleted--');
        console.log('Database:', mongoose.connection.name);
        console.log('Collection:', Category.collection.name);
    } catch (error) {
        console.error('Error deleting category', error);
        res.status(500).json({message:'Error deleting category',error:error.message});
    }
};

module.exports = {
    getAllCategories,
    getOneCategory,
    createCategory,
    updateCategory,
    deleteCategory
};
