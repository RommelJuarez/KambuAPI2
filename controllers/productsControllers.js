const productModel=require('../models/productsSchema');
const mongoose=require('mongoose');

const getAllProducts=async(req,res)=>{
    try {
        const product=await productModel.find();
        res.status(200).json(product);
        if(!product){
            return res.status(404).json({message:'Products is empty'});
        }
        console.log('--Get All Products--');
        console.log('Database:',mongoose.connection.name);
        console.log('Collection:',productModel.collection.name);
    } catch (error) {
        console.error('Error loading products from database',error);
        res.status(500).json({message:'Error loading products from database',error:error.message});
    }
};


const getOneProduct=async(req,res)=>{
    try {
        const productId=req.params.id;
        const product=await productModel.findById(productId);
        if(!product){
            return res.status(404).json({message:'Product not found'});
        }
        res.status(200).json(product);
        console.log('--Get One Product--');
        console.log('Database:',mongoose.connection.name);
        console.log('Collection:',productModel.collection.name);
    } catch (error) {
        console.error('Error loading products from database',error);
        res.status(500).json({message:'Error loading products from database',error:error.message});
    }
};

const createProduct=async(req,res)=>{
    try {
        const newProduct= new productModel({
            name:req.body.name,
            description:req.body.description,
            price:req.body.price,
            stock:req.body.stock,
            categoryId:req.body.categoryId
        });
        await newProduct.save();
        res.status(200).json({message:'Product created successfully'});
        console.log('--Create Product--');
        console.log('Database:',mongoose.connection.name);
        console.log('Collection:',productModel.collection.name);
    } catch (error) {
        console.error('Error creating product ',error);
        res.status(500).json({message:'Error creating product ',error:error.message});
    }
};

const updateProduct=async(req,res)=>{
    try {
        const productData= {
            name:req.body.name,
            description:req.body.description,
            price:req.body.price,
            stock:req.body.stock,
            categoryId:req.body.categoryId
        };
        const updateProduct=await productModel.findByIdAndUpdate(
            req.params.id,
            {$set:productData},
            {new:true}
        );
        if(!updateProduct){
            return res.status(404).json({message:'Product not found'});
        }
        res.status(200).json({message:'Product update successfully'});
        console.log('--Update Product--');
        console.log('Database:',mongoose.connection.name);
        console.log('Collection:',productModel.collection.name);
    } catch (error) {
        console.error("Error updating one Product from database:", error);
        res.status(500).json({ error: "Error updating one Product from database",message:error.errmsg  });
    }
};

const deleteProduct=async(req,res)=>{
    try {
        const productId=req.params.id;
        const deleteProduct=await productModel.findByIdAndDelete(productId);
        if(!deleteProduct){
            return res.status(404).json({message:'Product not found'});
        }
        res.status(200).json({message:'Product deleted successfully'});
        console.log('--Delete Product--');
        console.log('Database:',mongoose.connection.name);
        console.log('Collection:',productModel.collection.name);
    } catch (error) {
        console.error("Error deleting Product:", error);
        res.status(500).json({message:'Error deleting Product:',error:error.message});
    }
};


module.exports={
    getAllProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};