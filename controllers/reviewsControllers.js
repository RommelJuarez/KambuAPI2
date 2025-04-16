const { Review } = require('../models/reviewsSchema');

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    if (reviews.length > 0) {
      res.status(200).json(reviews);
    } else {
      res.status(404).send('The database contains no reviews records.');
    }
  } catch (error) {
    res.status(500).send('Error fetching reviews.');
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).send('Review not found.');
    }
  } catch (error) {
    res.status(500).send('Error fetching a review.')
  }
};

const addReview = async (req, res) => {
  try {
    const newReview = new Review({
      customerId: req.body.customerId,
      productId: req.body.productId,
      review: req.body.review,
      rating: req.body.rating
    });
    await newReview.save();
    res.status(201).send('Review successfully added.');
  } catch (error) {
    res.status(400).send('Error adding review.');
  }
};

const updateReview = async (req, res) => {
  try {
    const review = {
      customerId: req.body.customerId,
      productId: req.body.productId,
      review: req.body.review,
      rating: req.body.rating
    }
    await Review.updateOne({ _id: req.params.id }, { $set: review });
    res.status(200).send('Review successfully updated.');
  } catch (error) {
    res.status(400).send('Error adding review.');
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      await Review.deleteOne({_id: req.params.id});
      res.status(200).send('Review successfully deleted.');
    } else {
      res.status(404).send('Review not found.');
    }
  } catch (error) {
    res.status(500).send('Error deleting review.');
  }
};

module.exports = { getAllReviews, getReviewById, addReview, updateReview, deleteReview };