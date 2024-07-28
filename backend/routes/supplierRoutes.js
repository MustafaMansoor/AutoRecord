const express = require("express");
// Initialize the router with mergeParams: true
const router = express.Router({ mergeParams: true });

const {addSupplierToCompany,getAllSuppliersByCompany,editSupplierForCompany,deleteSupplierForCompany,getAllSupplierCategories,updateSupplierCategoryForCompany} = require("../controller/SupplierController");

router.post("/:companyId/suppliers", addSupplierToCompany);
router.get("/:companyId/suppliers", getAllSuppliersByCompany);
router.get("/suppliers/categories", getAllSupplierCategories);
router.put("/:companyId/suppliers/:supplierId", editSupplierForCompany);
router.delete("/:companyId/suppliers/:supplierId", deleteSupplierForCompany);
router.patch("/:companyId/suppliers/:supplierId/categories/update", updateSupplierCategoryForCompany);
module.exports = router;


