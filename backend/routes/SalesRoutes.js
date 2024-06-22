const express = require('express');
const router = express.Router();
const {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
} = require('../controller/SalesController'); // Adjust the path as necessary

// Routes for sales
router.route('/')
  .post(createSale)
  .get(getAllSales);

router.route('/:id')
  .get(getSaleById)
  .put(updateSale)
  .delete(deleteSale);

module.exports = router;
