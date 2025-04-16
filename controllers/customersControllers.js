const { Customer } = require('../models/customerSchema');

const getAllCustomers = async (req, res) => {
  try {
    // 📌 find() - https://mongoosejs.com/docs/api/model.html#Model.find()
    const customers = await Customer.find();
    if (customers.length > 0) {
      res.status(200).json(customers.sort());
    }  else {
      res.status(404).send('The database contains no customer records.');
    }
  } catch (error) {
    res.status(500).send('Error fetching customers.');
  }
};

const getCustomerById = async (req, res) => {
  try {
    // 📌 findById() - https://mongoosejs.com/docs/api/model.html#Model.findById()
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).send('Customer not found.');
    }
  } catch (error) {
    res.status(500).send('Error fetching a customer.');
  }
};

const addCustomer = async (req, res) => {
  try {
    const customer = new Customer({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: {
        street: req.body.address.street,
        number: req.body.address.number,
        neighborhood: req.body.address.neighborhood,
        provinceOrState: req.body.address.provinceOrState,
        country: req.body.address.country,
        zipCode: req.body.address.zipCode
      }
    });
    // 📌 save() - https://mongoosejs.com/docs/api/document.html#Document.prototype.save()
    await customer.save();
    res.status(201).send('Customer successfully added.');
  } catch (error) {
    res.status(400).send('Error adding customer.');
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customer = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: {
        street: req.body.address.street,
        number: req.body.address.number,
        neighborhood: req.body.address.neighborhood,
        provinceOrState: req.body.address.provinceOrState,
        country: req.body.address.country,
        zipCode: req.body.address.zipCode
      }
    }
    // 📌 updateOne() - https://mongoosejs.com/docs/api/query.html#Query.prototype.updateOne()
    await Customer.updateOne({ _id: req.params.id }, { $set: customer });
    res.status(200).send('Customer successfully updated.');
  } catch (error) {
    res.status(400).send('Error updating customer.');
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customerId = await Customer.findById(req.params.id);
    if (customerId) {
      // 📌 deleteOne() - https://mongoosejs.com/docs/api/model.html#Model.prototype.deleteOne()
      await Customer.deleteOne({ _id: req.params.id });
      res.status(200).send('Customer successfully deleted.');
    } else {
      res.status(404).send('Customer not found.')
    }
  } catch (error) {
    res.status(500).send('Error deleting customer.');
  }
};

module.exports = { getAllCustomers, getCustomerById, addCustomer, updateCustomer, deleteCustomer };
