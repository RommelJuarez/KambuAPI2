const express = require('express');
const router = express.Router();
const reviewsControllers = require('../controllers/reviewsControllers');
const { reviewRules, validate } = require('../middlewares/reviewsValidators');
const { isAuthenticated } = require('../oauth/authenticate');

router.get('/', reviewsControllers.getAllReviews);

router.get('/:id', reviewsControllers.getReviewById);

router.post('/', isAuthenticated, reviewRules, validate, reviewsControllers.addReview);

router.put('/:id', isAuthenticated, reviewRules, validate, reviewsControllers.updateReview);

router.delete('/:id', isAuthenticated, reviewsControllers.deleteReview);

module.exports = router;