// ✅ Mock al middleware de autenticación ANTES de importar la app
jest.mock('../../oauth/authenticate', () => ({
  isAuthenticated: (req, res, next) => {
    req.session = req.session || {};
    req.session.user = { id: 'mockUserId', displayName: 'Mocked User' };
    next(); // pasa automáticamente la autenticación
  }
}));

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app'); // app sin listen()
const { Review } = require('../../models/reviewsSchema');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Review.deleteMany();
});

describe('Review Routes Integration Tests', () => {
  it('should create a new review', async () => {
    const res = await request(app)
      .post('/reviews')
      .send({
        customerId: new mongoose.Types.ObjectId(),
        productId: new mongoose.Types.ObjectId(),
        review: 'Muy bueno',
        rating: 5
      });

    expect(res.statusCode).toBe(201);
    expect(res.text).toBe('Review successfully added.');

    const reviews = await Review.find();
    expect(reviews.length).toBe(1);
    expect(reviews[0].review).toBe('Muy bueno');
  });

  it('should fetch all reviews', async () => {
    await Review.create({
      customerId: new mongoose.Types.ObjectId(),
      productId: new mongoose.Types.ObjectId(),
      review: 'Excelente',
      rating: 5
    });

    const res = await request(app).get('/reviews');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].review).toBe('Excelente');
  });

  it('should return 404 if no reviews exist', async () => {
    const res = await request(app).get('/reviews');

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('The database contains no reviews records.');
  });

  it('should delete a review', async () => {
    const review = await Review.create({
      customerId: new mongoose.Types.ObjectId(),
      productId: new mongoose.Types.ObjectId(),
      review: 'Para borrar',
      rating: 3
    });

    const res = await request(app).delete(`/reviews/${review._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Review successfully deleted.');
  });

  it('should return 404 if trying to delete non-existing review', async () => {
    const res = await request(app).delete('/reviews/000000000000000000000000');
    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('Review not found.');
  });
});
