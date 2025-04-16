const { body, param, validationResult } = require('express-validator');


const validateID = [
    param('id').isMongoId().withMessage('Invalid ID format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateCategoryUpdateBody = [
    param('id').isMongoId().withMessage('Invalid userId format'),
    body('name').optional().isString().notEmpty().withMessage('Name is required'),
    body('description').optional().isString().notEmpty().withMessage('Description is required'),
    
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


const validateCreateCategoryBody = [
    body('name').notEmpty().withMessage('name cannot be empty'),
    body('description').notEmpty().withMessage('description cannot be empty'),
    body().notEmpty().withMessage('The body is empty'),
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

module.exports = {validateID,validateCategoryUpdateBody,validateCreateCategoryBody};
