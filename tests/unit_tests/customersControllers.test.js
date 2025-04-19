const customerController = require('../../controllers/customersControllers');
const { Customer } = require('../../models/customerSchema');

jest.mock('../../models/customerSchema');

describe('Customer Controller (Unit Tests)', () => {
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

  // GET all customers
  describe('getAllCustomers', () => {
    it('should return all customers', async () => {
      const mockCustomers = [{ firstName: 'Ana' }, { firstName: 'Luis' }];
      Customer.find.mockResolvedValue(mockCustomers);

      await customerController.getAllCustomers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCustomers.sort());
    });

    it('should return 404 if no customers found', async () => {
      Customer.find.mockResolvedValue([]);

      await customerController.getAllCustomers(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('The database contains no customer records.');
    });

    it('should handle errors in getAllCustomers', async () => {
      const error = new Error('DB error');
      Customer.find.mockRejectedValue(error);

      await customerController.getAllCustomers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error fetching customers.');
    });
  });

  // GET customer by ID
  describe('getCustomerById', () => {
    it('should return one customer by ID', async () => {
      const mockCustomer = { _id: '123', firstName: 'Ana' };
      req.params = { id: '123' };
      Customer.findById.mockResolvedValue(mockCustomer);

      await customerController.getCustomerById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCustomer);
    });

    it('should return 404 if customer not found', async () => {
      req.params = { id: '999' };
      Customer.findById.mockResolvedValue(null);

      await customerController.getCustomerById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Customer not found.');
    });

    it('should handle errors in getCustomerById', async () => {
      req.params = { id: 'error' };
      const error = new Error('DB error');
      Customer.findById.mockRejectedValue(error);

      await customerController.getCustomerById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error fetching a customer.');
    });
  });

  // POST add customer
  describe('addCustomer', () => {
    it('should create a new customer', async () => {
      req.body = {
        firstName: 'Ana',
        lastName: 'Pérez',
        email: 'ana@example.com',
        phone: '123456789',
        address: {
          street: 'Calle 1',
          number: '100',
          neighborhood: 'Centro',
          provinceOrState: 'Madrid',
          country: 'España',
          zipCode: '28001'
        }
      };

      const mockSave = jest.fn().mockResolvedValue(req.body);
      Customer.mockImplementation(() => ({ ...req.body, save: mockSave }));

      await customerController.addCustomer(req, res);

      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith('Customer successfully added.');
    });

    it('should handle error in addCustomer', async () => {
      req.body = {};
      const mockSave = jest.fn().mockRejectedValue(new Error('Validation error'));
      Customer.mockImplementation(() => ({ save: mockSave }));

      await customerController.addCustomer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Error adding customer.');
    });
  });

  // PUT update customer
  describe('updateCustomer', () => {
    it('should update a customer successfully', async () => {
      req.params = { id: '123' };
      req.body = {
        firstName: 'Luis',
        lastName: 'González',
        email: 'luis@example.com',
        phone: '987654321',
        address: {
          street: 'Calle 2',
          number: '200',
          neighborhood: 'Norte',
          provinceOrState: 'Barcelona',
          country: 'España',
          zipCode: '08001'
        }
      };

      Customer.updateOne.mockResolvedValue({});

      await customerController.updateCustomer(req, res);

      expect(Customer.updateOne).toHaveBeenCalledWith({ _id: '123' }, { $set: expect.any(Object) });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Customer successfully updated.');
    });

    it('should handle error in updateCustomer', async () => {
      req.params = { id: '456' };
      req.body = {};
      Customer.updateOne.mockRejectedValue(new Error('Update error'));

      await customerController.updateCustomer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Error updating customer.');
    });
  });

  // DELETE customer
  describe('deleteCustomer', () => {
    it('should delete a customer successfully', async () => {
      req.params = { id: '123' };
      Customer.findById.mockResolvedValue({ _id: '123' });
      Customer.deleteOne.mockResolvedValue({});

      await customerController.deleteCustomer(req, res);

      expect(Customer.findById).toHaveBeenCalledWith('123');
      expect(Customer.deleteOne).toHaveBeenCalledWith({ _id: '123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Customer successfully deleted.');
    });

    it('should return 404 if customer not found', async () => {
      req.params = { id: '999' };
      Customer.findById.mockResolvedValue(null);

      await customerController.deleteCustomer(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Customer not found.');
    });

    it('should handle error in deleteCustomer', async () => {
      req.params = { id: 'error' };
      Customer.findById.mockRejectedValue(new Error('Delete error'));

      await customerController.deleteCustomer(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error deleting customer.');
    });
  });
});
