const mongoose=require('mongoose');

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Category Name is required'],
        trim:true,
        unique:true,
        minlength: [3, 'Category name must be at least 3 characters long'],
        maxlength: [20, 'Category name must not exceed 20 characters']
    },
    description:{
        type:String,
        required:[true,'A description is required'],
        trim:true,
        minlength: [3, 'description  must be at least 3 characters long'],
        maxlength: [60, 'description  must not exceed 60 characters']
    }
});

const Category=mongoose.model('Categories',categorySchema);
module.exports=Category;