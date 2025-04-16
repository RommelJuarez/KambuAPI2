const { body, validationResult } = require('express-validator');

const convertToLowerCase = (value) => {
  return value.toLowerCase();
};

const reviewRules = [
  body('customerId')
    .escape()
    .notEmpty()
    .withMessage('Customer id is required.')
    .isHexadecimal()
    .withMessage('Customer id must be a valid hexadecimal string.')
    .isLength({ min: 24, max: 24 })
    .withMessage('Customer id must be exactly 24 hexadecimal characters.')
    .bail(),
  body('productId')
    .escape()
    .notEmpty()
    .withMessage('Product id is required.')
    .isHexadecimal()
    .withMessage('Product id must be a valid hexadecimal string.')
    .isLength({ min: 24, max: 24 })
    .withMessage('Product id must be exactly 24 hexadecimal characters.')
    .bail(),
  body('review')
    .escape()
    .notEmpty()
    .withMessage('Review is required.')
    .custom(convertToLowerCase)
    .isLength({ max: 100 })
    .withMessage('Review must be at least 10 characters long.')
    .bail(),
  body('rating')
    .escape()
    .notEmpty()
    .withMessage('Rating is required.')
    .isNumeric()
    .withMessage('Rating must only contain numbers.')
    .isInt()
    .withMessage('Rating only accepts integer values.')
    .isIn([0, 1, 2, 3, 4, 5])
    .withMessage('Rating only accepts integer values between 0 to 5.')
    .bail()
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  } else {
    res.status(400).json({ errors: errors.array() });
  }
};

module.exports = { reviewRules, validate };