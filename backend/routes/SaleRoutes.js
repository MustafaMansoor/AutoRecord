const express = require("express");
// Initialize the router with mergeParams: true
const router = express.Router({ mergeParams: true });

const {addSaleToCompany,getAllSalesByCompany,editSaleForCompany,deleteSaleForCompany,getAllSalesCategories,updateSaleCategoryForCompany} = require("../controller/SalesController");

router.post("/:companyId/sales", addSaleToCompany);
router.get("/:companyId/sales", getAllSalesByCompany);
router.get("/sales/categories", getAllSalesCategories);
router.put("/:companyId/sales/:saleId", editSaleForCompany);
router.delete("/:companyId/sales/:saleId", deleteSaleForCompany);
router.patch("/:companyId/sales/:saleId/categories/update", updateSaleCategoryForCompany);

module.exports = router;
