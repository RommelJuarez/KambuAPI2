const { body, validationResult } = require('express-validator');

const validateTextInput = (value) => {
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
  return regex.test(value);
};

const convertToLowerCase = (value) => {
  return value.toLowerCase();
};

const customerRules = [
  body('firstName')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('First name is required.')
    .custom(validateTextInput)
    .withMessage('First name must only contain letters and spaces.')
    .customSanitizer(convertToLowerCase)
    .bail(),
  body('lastName')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('Last name is required.')
    .custom(validateTextInput)
    .withMessage('Last name must only contain letters and spaces.')
    .customSanitizer(convertToLowerCase)
    .bail(),
  body('email')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please enter a valid email address that includes \'@\' symbol.')
    .bail(),
  body('phone')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('Phone is required.')
    .isNumeric()
    .withMessage('Phone must only contain numbers.')
    .isInt()
    .withMessage('Phone only accepts integer values.')
    .bail(),
  body('address.street')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('Street name is required.')
    .custom(validateTextInput)
    .withMessage('Street name must only contain letters and spaces.')
    .customSanitizer(convertToLowerCase)
    .bail(),
  body('address.number')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('Street number is required.')
    .isNumeric()
    .withMessage('Street number must only contain numbers.')
    .isInt()
    .withMessage('Street number only accepts integer values.')
    .bail(),
  body('address.neighborhood')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('Neighborhood name is required.')
    .custom(validateTextInput)
    .withMessage('Neighborhood name must only contain letters and spaces.')
    .customSanitizer(convertToLowerCase)
    .bail(),
  body('address.provinceOrState')
    .escape()
    .trim()
    .notEmpty()
    .withMessage('Province or state name is required.')
    .custom(validateTextInput)
    .withMessage('Province or state name must only contain letters and spaces.')
    .customSanitizer(convertToLowerCase)
    .bail(),
  body('address.country')
    .trim()
    .notEmpty()
    .withMessage('Country name is required.')
    .custom(validateTextInput)
    .withMessage('Country name must only contain letters and spaces.')
    .customSanitizer(convertToLowerCase)
    .bail(),
  body('address.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required.')
    .isNumeric()
    .withMessage('Zip code must only contain numbers.')
    .isInt()
    .withMessage('Zip code only accepts integer values.')
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

module.exports = { customerRules, validate };