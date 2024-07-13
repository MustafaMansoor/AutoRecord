const express = require("express");
// Initialize the router with mergeParams: true
const router = express.Router({ mergeParams: true });

const {addPurchaseToCompany,getAllPurchasesByCompany,editPurchaseForCompany,deletePurchaseForCompany} = require("../controller/PurchaseController");

router.post("/", addPurchaseToCompany);
router.get("/", getAllPurchasesByCompany);
router.put("/:purchaseId", editPurchaseForCompany);
router.delete("/:purchaseId", deletePurchaseForCompany);

module.exports = router;
