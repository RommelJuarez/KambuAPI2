// tests/productController.test.js
const request = require('supertest');
const express = require('express');
const app = express();
const productController = require('../controllers/productsControllers');
const Product = require('../models/productsSchema');

jest.mock('../models/productsSchema');

app.use(express.json());

// Rutas para probar
app.get('/api/products', productController.getAllProducts);
app.get('/api/products/:id', productController.getOneProduct);
app.post('/api/products', productController.createProduct);
app.put('/api/products/:id', productController.updateProduct);
app.delete('/api/products/:id', productController.deleteProduct);

describe('Product Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // GET ALL
  it('should return all products', async () => {
    const mockProducts = [
      { _id: '1', name: 'Protein', description: 'Muscle', price: 50, stock: 10, categoryId: 'a1' },
      { _id: '2', name: 'Vitamin', description: 'Health', price: 20, stock: 5, categoryId: 'a2' }
    ];
    Product.find.mockResolvedValue(mockProducts);

    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockProducts);
  });

  // GET ONE
  it('should return one product by ID', async () => {
    const mockProduct = { _id: '123', name: 'Whey', description: 'Isolate', price: 60, stock: 3, categoryId: 'a3' };
    Product.findById.mockResolvedValue(mockProduct);

    const res = await request(app).get('/api/products/123');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockProduct);
  });

  it('should return 404 if product not found', async () => {
    Product.findById.mockResolvedValue(null);

    const res = await request(app).get('/api/products/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Product not found');
  });

  // POST
  it('should create a product successfully', async () => {
    const mockProduct = {
      name: 'Creatine',
      description: 'For energy',
      price: 30,
      stock: 15,
      categoryId: 'c123',
      save: jest.fn().mockResolvedValue({ _id: '456', name: 'Creatine' })
    };
    Product.mockImplementation(() => mockProduct);

    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'Creatine',
        description: 'For energy',
        price: 30,
        stock: 15,
        categoryId: 'c123'
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Product created successfully');
    expect(mockProduct.save).toHaveBeenCalled();
  });

  it('should return 500 if product creation fails', async () => {
    Product.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Save error'))
    }));

    const res = await request(app)
      .post('/api/products')
      .send({
        name: '',
        description: '',
        price: -10,
        stock: -5,
        categoryId: ''
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Error creating product ');
  });

  // PUT
  it('should update a product successfully', async () => {
    const updatedProduct = {
      _id: '789',
      name: 'Updated Name',
      description: 'Updated desc',
      price: 100,
      stock: 20,
      categoryId: 'c789'
    };
    Product.findByIdAndUpdate.mockResolvedValue(updatedProduct);

    const res = await request(app)
      .put('/api/products/789')
      .send({
        name: 'Updated Name',
        description: 'Updated desc',
        price: 100,
        stock: 20,
        categoryId: 'c789'
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Product update successfully');
  });

  it('should return 404 when updating non-existent product', async () => {
    Product.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/products/999')
      .send({
        name: 'X',
        description: 'Y',
        price: 0,
        stock: 0,
        categoryId: 'none'
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Product not found');
  });

  // DELETE
  it('should delete a product successfully', async () => {
    Product.findByIdAndDelete.mockResolvedValue({ _id: '123', name: 'To Delete' });

    const res = await request(app).delete('/api/products/123');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Product deleted successfully');
  });

  it('should return 404 if product to delete does not exist', async () => {
    Product.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app).delete('/api/products/999');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Product not found');
  });

  it('should return 500 if an error occurs during deletion', async () => {
    Product.findByIdAndDelete.mockRejectedValue(new Error('DB error'));

    const res = await request(app).delete('/api/products/123');

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Error deleting Product:');
    expect(res.body.error).toBe('DB error');
  });

});
