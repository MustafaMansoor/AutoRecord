const express = require('express');
const router = express.Router();
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  addPurchaseToCompany,
  addSaleToCompany,
  addSupplierToCompany,
  getAllPurchasesByCompany,
  getAllSalesByCompany,
  getAllSuppliersByCompany
} = require('../controller/CompanyController.js');

// Routes for managing companies
router.route('/')
  .post(createCompany)
  .get(getAllCompanies);

router.route('/:id')
  .get(getCompanyById)
  .put(updateCompany)
  .delete(deleteCompany);

// New routes for adding purchases, sales, and suppliers to a company
router.post('/:companyId/purchases', addPurchaseToCompany);
router.post('/:companyId/sales', addSaleToCompany);
router.post('/:companyId/suppliers', addSupplierToCompany);


router.get('/:companyId/purchases', getAllPurchasesByCompany);
router.get('/:companyId/sales', getAllSalesByCompany);
router.get('/:companyId/suppliers', getAllSuppliersByCompany);

module.exports = router;
