const routes=require('express').Router();
const productsRoutes=require('./productsRoutes');
const customersRoutes=require('./customersRoutes');
const categoriesRoutes=require('./categoryRoutes');
const reviewsRoutes=require('./reviewsRoutes');
const passport = require('passport');

routes.use('/',require('./swagger'));
routes.use('/products',productsRoutes);
routes.use('/customers', customersRoutes);
routes.use('/categories',categoriesRoutes);
routes.use('/reviews', reviewsRoutes);

routes.get('/login', passport.authenticate('github'), (req, res) => {});

routes.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err) }
    res.redirect('/');
  });
});

module.exports=routes;