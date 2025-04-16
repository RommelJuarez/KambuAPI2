const productController = require('../../controllers/productsControllers');
const Product = require('../../models/productsSchema');

jest.mock('../../models/productsSchema');

describe('Product Controller (Unit Tests)', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  // GET all products
  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const mockProducts = [{ name: 'Laptop', price: 1000 }];
      Product.find.mockResolvedValue(mockProducts);

      await productController.getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it('should handle error in getAllProducts', async () => {
      const error = new Error('DB fail');
      Product.find.mockRejectedValue(error);

      await productController.getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error loading products from database',
        error: error.message
      });
    });
  });

  // GET one product
  describe('getOneProduct', () => {
    it('should return one product by ID', async () => {
      req.params = { id: 'abc123' };
      const mockProduct = { _id: 'abc123', name: 'Phone', price: 500 };
      Product.findById.mockResolvedValue(mockProduct);

      await productController.getOneProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 404 if product not found', async () => {
      req.params = { id: 'not-found' };
      Product.findById.mockResolvedValue(null);

      await productController.getOneProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should handle error in getOneProduct', async () => {
      req.params = { id: 'error-id' };
      const error = new Error('Something went wrong');
      Product.findById.mockRejectedValue(error);

      await productController.getOneProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error loading products from database',
        error: error.message
      });
    });
  });

  // POST create product
  describe('createProduct', () => {
    it('should create a new product', async () => {
      req.body = {
        name: 'Tablet',
        description: 'A new tablet',
        price: 300,
        stock: 50,
        categoryId: 'cat1'
      };

      const mockSave = jest.fn().mockResolvedValue(req.body);
      Product.mockImplementation(() => ({ ...req.body, save: mockSave }));

      await productController.createProduct(req, res);

      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product created successfully'
      });
    });

    it('should handle error in createProduct', async () => {
      req.body = {};
      const error = new Error('Validation failed');
      const mockSave = jest.fn().mockRejectedValue(error);
      Product.mockImplementation(() => ({ save: mockSave }));

      await productController.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating product ',
        error: error.message
      });
    });
  });

  // PUT update product
  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      req.params = { id: 'abc123' };
      req.body = {
        name: 'Updated Product',
        description: 'Updated desc',
        price: 120,
        stock: 20,
        categoryId: 'cat1'
      };

      Product.findByIdAndUpdate.mockResolvedValue({ ...req.body });

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product update successfully'
      });
    });

    it('should return 404 if product not found', async () => {
      req.params = { id: 'not-exist' };
      req.body = {
        name: 'Updated Product',
        description: 'Updated desc',
        price: 120,
        stock: 20,
        categoryId: 'cat1'
      };

      Product.findByIdAndUpdate.mockResolvedValue(null);

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should handle error in updateProduct', async () => {
      req.params = { id: 'error-id' };
      req.body = {};
      const error = { errmsg: 'Update failed' };
      Product.findByIdAndUpdate.mockRejectedValue(error);

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error updating one Product from database',
        message: error.errmsg
      });
    });
  });

  // DELETE product
  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      req.params = { id: 'abc123' };
      Product.findByIdAndDelete.mockResolvedValue({ _id: 'abc123', name: 'Old Product' });

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted successfully' });
    });

    it('should return 404 if product not found', async () => {
      req.params = { id: 'not-found' };
      Product.findByIdAndDelete.mockResolvedValue(null);

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should handle error in deleteProduct', async () => {
      req.params = { id: 'error-id' };
      const error = new Error('Delete failed');
      Product.findByIdAndDelete.mockRejectedValue(error);

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error deleting Product:',
        error: error.message
      });
    });
  });
});
