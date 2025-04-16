const { body, param, validationResult } = require('express-validator');


const validateProductsUpdateBody = [
    param('id').isMongoId().withMessage('Invalid userId format'),
    body('name').optional().isString().notEmpty().withMessage('Name is required'),
    body('description').optional().isString().notEmpty().withMessage('Description is required'),
    body('price').optional().isNumeric().notEmpty().withMessage('Price is required'),
    body('stock').optional().isNumeric().notEmpty().withMessage('Stock is required'),
    body('categoryId').optional().isMongoId().notEmpty().withMessage('A valid category Id is required'),
    
    (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ errors: [{ msg: 'The body is empty' }] });
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


const validateProductsCreateteBody = [
    body('name').optional().isString().notEmpty().withMessage('Name is required'),
    body('description').optional().isString().notEmpty().withMessage('Description is required'),
    body('price').optional().isNumeric().notEmpty().withMessage('Price is required'),
    body('stock').optional().isNumeric().notEmpty().withMessage('Stock is required'),
    body('categoryId').optional().isMongoId().notEmpty().withMessage('A valid category Id is required'),
    
    (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ errors: [{ msg: 'The body is empty' }] });
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateProductsCreateteBody,
    validateProductsUpdateBody};
