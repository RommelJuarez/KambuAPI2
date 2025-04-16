const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'KambuAPI',
    description: 'This API allows the administrators of our e-commerce platform to perform CRUD operations to manipulate their database.'
  },
  host: 'kambuapi.onrender.com',
  schemes:['https','http'],
  tags:[{name:'Customers'},{name:'Products'},{name:'Categories'},{name:'Reviews'}]
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);
