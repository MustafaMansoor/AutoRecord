const express = require('express');
const router = express.Router();
const {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
} = require('../controller/PurchaseController.js');

router.route('/')
  .post(createPurchase)
  .get(getAllPurchases);

router.route('/:id')
  .get(getPurchaseById)
  .put(updatePurchase)
  .delete(deletePurchase);

module.exports = router;
