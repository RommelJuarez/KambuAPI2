const request = require('supertest');
const express = require('express');
const app = express();
const categoryController = require('../controllers/categoryControllers');
const Category = require('../models/categorySchema');

jest.mock('../models/categorySchema');

app.use(express.json());

//routes for testing
app.get('/api/categories', categoryController.getAllCategories);
app.get('/api/categories/:id', categoryController.getOneCategory);
app.post('/api/categories', categoryController.createCategory);
app.put('/api/categories/:id', categoryController.updateCategory);
app.delete('/api/categories/:id', categoryController.deleteCategory);

describe('Category Controller', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // GET ALL
  it('should return all categories', async () => {
    const mockCategories = [
      { _id: '1', name: 'Health', description: 'Health-related' },
      { _id: '2', name: 'Fitness', description: 'Fitness programs' }
    ];
    Category.find.mockResolvedValue(mockCategories);

    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockCategories);
  });

  // GET ONE
  it('should return one category by ID', async () => {
    const mockCategory = { _id: '123', name: 'Books', description: 'Reading material' };
    Category.findById.mockResolvedValue(mockCategory);

    const res = await request(app).get('/api/categories/123');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockCategory);
  });

  it('should return 404 if category not found', async () => {
    Category.findById.mockResolvedValue(null);

    const res = await request(app).get('/api/categories/999');
    expect(res.status).toBe(404);
    expect(res.body).toBe('Category not found');
  });

  // POST
  it('should create a category successfully', async () => {
    const mockCategory = {
      name: 'Technology',
      description: 'Tech stuff',
      save: jest.fn().mockResolvedValue({ _id: '456', name: 'Technology', description: 'Tech stuff' })
    };
    Category.mockImplementation(() => mockCategory);

    const res = await request(app)
      .post('/api/categories')
      .send({ name: 'Technology', description: 'Tech stuff' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Category created successfully');
    expect(mockCategory.save).toHaveBeenCalled();
  });

  it('should handle error on category creation', async () => {
    Category.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Validation error'))
    }));

    const res = await request(app)
      .post('/api/categories')
      .send({ name: '', description: '' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Error creating category');
  });

  // PUT
  it('should update a category successfully', async () => {
    const updatedCategory = { _id: '123', name: 'Updated', description: 'Updated desc' };
    Category.findByIdAndUpdate.mockResolvedValue(updatedCategory);

    const res = await request(app)
      .put('/api/categories/123')
      .send({ name: 'Updated', description: 'Updated desc' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedCategory);
  });

  it('should return 404 when updating a non-existent category', async () => {
    Category.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/categories/999')
      .send({ name: 'Something', description: 'Nothing' });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Category updated successfully'); // according to your controller
  });

  // DELETE
  it('should delete a category successfully', async () => {
    Category.findByIdAndDelete.mockResolvedValue({ _id: '123', name: 'To Delete' });

    const res = await request(app).delete('/api/categories/123');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Category deleted successfully');
  });

  it('should return 404 if category to delete does not exist', async () => {
    Category.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app).delete('/api/categories/999');

    expect(res.status).toBe(404);
    expect(res.body).toBe('Category not found');
  });

  it('should return 500 if an error occurs during deletion', async () => {
    Category.findByIdAndDelete.mockRejectedValue(new Error('DB error'));

    const res = await request(app).delete('/api/categories/123');

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Error deleting category');
    expect(res.body.error).toBe('DB error');
  });

});
