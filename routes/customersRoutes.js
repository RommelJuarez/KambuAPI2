const express = require('express');
const router = express.Router();
const customersControllers = require('../controllers/customersControllers');
const { customerRules, validate } = require('../middlewares/customersValidators');
const { isAuthenticated } = require('../oauth/authenticate')

router.get('/', customersControllers.getAllCustomers);

router.get('/:id', customersControllers.getCustomerById);

router.post('/', isAuthenticated, customerRules, validate, customersControllers.addCustomer);

router.put('/:id', isAuthenticated, customerRules, validate, customersControllers.updateCustomer);

router.delete('/:id', isAuthenticated, customersControllers.deleteCustomer);

module.exports = router;