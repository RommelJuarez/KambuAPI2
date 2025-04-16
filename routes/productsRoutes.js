const routes=require('express').Router();
const products=require('../controllers/productsControllers');
const productsValidators=require('../middlewares/productsValidators');
const idValidate=require('../middlewares/categoriesValidators');
const { isAuthenticated } = require('../oauth/authenticate');

routes.get('/',products.getAllProducts);
routes.get('/:id',idValidate.validateID,products.getOneProduct);
routes.post('/',isAuthenticated,productsValidators.validateProductsCreateteBody,products.createProduct);
routes.put('/:id',isAuthenticated,productsValidators.validateProductsUpdateBody,products.updateProduct);
routes.delete('/:id',isAuthenticated,idValidate.validateID,products.deleteProduct);

module.exports=routes;