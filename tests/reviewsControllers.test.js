const { getAllReviews, getReviewById } = require('../controllers/reviewsControllers');
const { Review } = require('../models/reviewsSchema');

jest.mock('../models/reviewsSchema');

describe('Reviews Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  describe('getAllReviews', () => {
    it('should return all reviews with status 200', async () => {
      const mockReviews = [{ text: 'Great!' }, { text: 'Awesome!' }];
      Review.find.mockResolvedValue(mockReviews);

      await getAllReviews(req, res);

      expect(Review.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockReviews);
    });

    it('should return 404 if no reviews found', async () => {
      Review.find.mockResolvedValue([]);

      await getAllReviews(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('The database contains no reviews records.');
    });
  });

  describe('getReviewById', () => {
    it('should return a review by id with status 200', async () => {
      const mockReview = { text: 'Nice!' };
      req.params = { id: '123' };
      Review.findById.mockResolvedValue(mockReview);

      await getReviewById(req, res);

      expect(Review.findById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockReview);
    });

    it('should return 404 if review not found', async () => {
      req.params = { id: '456' };
      Review.findById.mockResolvedValue(null);

      await getReviewById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Review not found.');
    });
  });
});
