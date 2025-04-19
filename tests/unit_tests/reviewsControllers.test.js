const reviewController = require('../../controllers/reviewsControllers');
const { Review } = require('../../models/reviewsSchema');

jest.mock('../../models/reviewsSchema');

describe('Review Controller (Unit Tests)', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  // GET all reviews
  describe('getAllReviews', () => {
    it('should return all reviews', async () => {
      const mockReviews = [{ review: 'Great!', rating: 5 }];
      Review.find.mockResolvedValue(mockReviews);

      await reviewController.getAllReviews(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockReviews);
    });

    it('should return 404 if no reviews found', async () => {
      Review.find.mockResolvedValue([]);

      await reviewController.getAllReviews(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('The database contains no reviews records.');
    });

    it('should handle error in getAllReviews', async () => {
      Review.find.mockRejectedValue(new Error());

      await reviewController.getAllReviews(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error fetching reviews.');
    });
  });

  // GET one review by ID
  describe('getReviewById', () => {
    it('should return one review by ID', async () => {
      const mockReview = { _id: '1', review: 'Awesome', rating: 5 };
      req.params = { id: '1' };
      Review.findById.mockResolvedValue(mockReview);

      await reviewController.getReviewById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockReview);
    });

    it('should return 404 if review not found', async () => {
      req.params = { id: '1' };
      Review.findById.mockResolvedValue(null);

      await reviewController.getReviewById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Review not found.');
    });

    it('should handle error in getReviewById', async () => {
      req.params = { id: '1' };
      Review.findById.mockRejectedValue(new Error());

      await reviewController.getReviewById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error fetching a review.');
    });
  });

  // POST create review
  describe('addReview', () => {
    it('should create a new review', async () => {
      req.body = {
        customerId: 'cust1',
        productId: 'prod1',
        review: 'Nice!',
        rating: 4
      };
      const mockSave = jest.fn().mockResolvedValue(req.body);
      Review.mockImplementation(() => ({ ...req.body, save: mockSave }));

      await reviewController.addReview(req, res);

      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith('Review successfully added.');
    });

    it('should handle error in addReview', async () => {
      req.body = {};
      const mockSave = jest.fn().mockRejectedValue(new Error());
      Review.mockImplementation(() => ({ save: mockSave }));

      await reviewController.addReview(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Error adding review.');
    });
  });

  // PUT update review
  describe('updateReview', () => {
    it('should update a review successfully', async () => {
      req.params = { id: '1' };
      req.body = {
        customerId: 'cust1',
        productId: 'prod1',
        review: 'Updated review',
        rating: 5
      };
      Review.updateOne.mockResolvedValue({ acknowledged: true });

      await reviewController.updateReview(req, res);

      expect(Review.updateOne).toHaveBeenCalledWith(
        { _id: '1' },
        { $set: req.body }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Review successfully updated.');
    });

    it('should handle error in updateReview', async () => {
      req.params = { id: '1' };
      req.body = {
        customerId: 'cust1',
        productId: 'prod1',
        review: 'Oops',
        rating: 2
      };
      Review.updateOne.mockRejectedValue(new Error());

      await reviewController.updateReview(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Error adding review.');
    });
  });

  // DELETE review
  describe('deleteReview', () => {
    it('should delete a review successfully', async () => {
      req.params = { id: '1' };
      Review.findById.mockResolvedValue({ _id: '1' });
      Review.deleteOne.mockResolvedValue({ acknowledged: true });

      await reviewController.deleteReview(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Review successfully deleted.');
    });

    it('should return 404 if review not found', async () => {
      req.params = { id: '1' };
      Review.findById.mockResolvedValue(null);

      await reviewController.deleteReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Review not found.');
    });

    it('should handle error in deleteReview', async () => {
      req.params = { id: '1' };
      Review.findById.mockRejectedValue(new Error());

      await reviewController.deleteReview(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error deleting review.');
    });
  });
});
