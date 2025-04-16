
const { getAllCustomers, getCustomerById } = require('../controllers/customersControllers');
const { Customer } = require('../models/customerSchema');

jest.mock('../models/customerSchema');

describe('Customers Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  describe('getAllCustomers', () => {
    it('should return all customers with status 200', async () => {
      const mockCustomers = ['Zack', 'Anna'];
      Customer.find.mockResolvedValue(mockCustomers);

      await getAllCustomers(req, res);

      expect(Customer.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCustomers.sort());
    });

    it('should return 404 if no customers found', async () => {
      Customer.find.mockResolvedValue([]);

      await getAllCustomers(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('The database contains no customer records.');
    });
  });

  describe('getCustomerById', () => {
    it('should return a customer by id with status 200', async () => {
      const mockCustomer = { name: 'John Doe' };
      req.params = { id: '123' };
      Customer.findById.mockResolvedValue(mockCustomer);

      await getCustomerById(req, res);

      expect(Customer.findById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCustomer);
    });

    it('should return 404 if customer not found', async () => {
      req.params = { id: '456' };
      Customer.findById.mockResolvedValue(null);

      await getCustomerById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Customer not found.');
    });
  });
});
