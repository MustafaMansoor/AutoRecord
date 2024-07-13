const express = require("express");
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
  getAllSuppliersByCompany,
  getAllFoldersByCompany,
  editPurchaseForCompany,
  editSaleForCompany,
  editSupplierForCompany,
  deletePurchaseForCompany,
  deleteSaleForCompany,
  deleteSupplierForCompany
} = require("../controller/CompanyController.js");

// Routes for managing companies
router.route("/").post(createCompany).get(getAllCompanies);

router
  .route("/:id")
  .get(getCompanyById)
  .put(updateCompany)
  .delete(deleteCompany);

// routes for adding purchases, sales, and suppliers to a company
router.post("/:companyId/purchases", addPurchaseToCompany);
router.post("/:companyId/sales", addSaleToCompany);
router.post("/:companyId/suppliers", addSupplierToCompany);

//routes for editing purchases, sales, and suppliers for a company
router.put("/:companyId/purchases/:purchaseId", editPurchaseForCompany);
router.put("/:companyId/sales/:saleId", editSaleForCompany);
router.put("/:companyId/suppliers/:supplierId", editSupplierForCompany);

// routes for getting purchases, sales, suppliers, and folders for a company
router.get("/:companyId/purchases", getAllPurchasesByCompany);
router.get("/:companyId/sales", getAllSalesByCompany);
router.get("/:companyId/suppliers", getAllSuppliersByCompany);
router.get("/:companyId/folders", getAllFoldersByCompany);

//routes for editing purchases, sales, and suppliers for a company
router.delete("/:companyId/purchases/:purchaseId", deletePurchaseForCompany);
router.delete("/:companyId/sales/:saleId", deleteSaleForCompany);
router.delete("/:companyId/suppliers/:supplierId", deleteSupplierForCompany);

module.exports = router;
