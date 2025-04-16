const routes=require('express').Router();
const categories=require('../controllers/categoryControllers');
const categoryValidators=require('../middlewares/categoriesValidators');
const { isAuthenticated } = require('../oauth/authenticate');

routes.get('/',categories.getAllCategories);
routes.get('/:id',categoryValidators.validateID,categories.getOneCategory);
routes.post('/',isAuthenticated,categoryValidators.validateCreateCategoryBody,categories.createCategory);
routes.put('/:id',isAuthenticated,categoryValidators.validateCategoryUpdateBody,categories.updateCategory);
routes.delete('/:id',isAuthenticated,categoryValidators.validateID,categories.deleteCategory);

module.exports=routes;