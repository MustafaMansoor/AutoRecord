const express = require("express");
// Initialize the router with mergeParams: true
const router = express.Router({ mergeParams: true });

const {addPurchaseToCompany,getAllPurchasesByCompany,editPurchaseForCompany,deletePurchaseForCompany,getAllPurchaseCategories,updatePurchaseCategoryForCompany} = require("../controller/PurchaseController");

router.post("/:companyId/purchases", addPurchaseToCompany);
router.get("/:companyId/purchases", getAllPurchasesByCompany);
router.get("/purchases/categories", getAllPurchaseCategories);
router.put("/:companyId/purchases/:purchaseId", editPurchaseForCompany);
router.delete("/:companyId/purchases/:purchaseId", deletePurchaseForCompany);
router.patch("/:companyId/purchases/:purchaseId/categories/update", updatePurchaseCategoryForCompany);

module.exports = router;
