const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewsSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

const Review = mongoose.model('reviews', reviewsSchema);

module.exports = { Review };