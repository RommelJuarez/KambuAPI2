const categoryController = require('../../controllers/categoryControllers');
const Category = require('../../models/categorySchema');
const mongoose = require('mongoose');

jest.mock('../../models/categorySchema');

describe('Category Controller (Unit Tests)', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  // GET all categories
  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const mockCategories = [{ name: 'Test', description: 'Desc' }];
      Category.find.mockResolvedValue(mockCategories);

      await categoryController.getAllCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCategories);
    });

    it('should handle errors in getAllCategories', async () => {
      const error = new Error('DB error');
      Category.find.mockRejectedValue(error);

      await categoryController.getAllCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error loading categories from database',
        error: error.message
      });
    });
  });

  // GET one category by ID
  describe('getOneCategory', () => {
    it('should return one category by ID', async () => {
      const mockCategory = { _id: '123', name: 'Books', description: 'Reading' };
      req.params = { id: '123' };
      Category.findById.mockResolvedValue(mockCategory);

      await categoryController.getOneCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCategory);
    });

    it('should return 404 if category not found', async () => {
      req.params = { id: '999' };
      Category.findById.mockResolvedValue(null);

      await categoryController.getOneCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith('Category not found');
    });

    it('should handle errors in getOneCategory', async () => {
      req.params = { id: 'error' };
      const error = new Error('Database error');
      Category.findById.mockRejectedValue(error);

      await categoryController.getOneCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error loading categories from database',
        error: error.message
      });
    });
  });

  // POST create category
  describe('createCategory', () => {
    it('should create a new category', async () => {
      req.body = { name: 'Tech', description: 'Tech desc' };
      const mockSave = jest.fn().mockResolvedValue(req.body);
      Category.mockImplementation(() => ({ ...req.body, save: mockSave }));

      await categoryController.createCategory(req, res);

      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Category created successfully'
      });
    });

    it('should handle error in createCategory', async () => {
      req.body = {};
      const mockSave = jest.fn().mockRejectedValue(new Error('Validation error'));
      Category.mockImplementation(() => ({ save: mockSave }));

      await categoryController.createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating category',
        error: 'Validation error'
      });
    });
  });

  // PUT update category
  describe('updateCategory', () => {
    it('should update a category successfully', async () => {
      req.params = { id: '123' };
      req.body = { name: 'Updated', description: 'Updated desc' };
      const updatedCategory = { _id: '123', ...req.body };
      Category.findByIdAndUpdate.mockResolvedValue(updatedCategory);

      await categoryController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedCategory);
    });

    it('should return 404 if category not found', async () => {
      req.params = { id: '999' };
      req.body = { name: 'Does not exist', description: 'Nada' };
      Category.findByIdAndUpdate.mockResolvedValue(null);

      await categoryController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Category updated successfully'
      }); // Esto está así en tu controlador
    });

    it('should handle error in updateCategory', async () => {
      req.params = { id: 'error' };
      req.body = { name: 'Bad', description: 'Data' };
      Category.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

      await categoryController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error updating category',
        error: 'Update failed'
      });
    });
  });

  // DELETE category
  describe('deleteCategory', () => {
    it('should delete a category successfully', async () => {
      req.params = { id: '123' };
      Category.findByIdAndDelete.mockResolvedValue({ _id: '123', name: 'To Delete' });

      await categoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Category deleted successfully' });
    });

    it('should return 404 if category not found', async () => {
      req.params = { id: '999' };
      Category.findByIdAndDelete.mockResolvedValue(null);

      await categoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith('Category not found');
    });

    it('should handle error in deleteCategory', async () => {
      req.params = { id: 'error' };
      Category.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

      await categoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error deleting category',
        error: 'Delete failed'
      });
    });
  });
});
