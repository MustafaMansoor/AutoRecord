const express = require("express");
// Initialize the router with mergeParams: true
const router = express.Router({ mergeParams: true });

const {addSaleToCompany,getAllSalesByCompany,editSaleForCompany,deleteSaleForCompany} = require("../controller/SalesController");

router.post("/", addSaleToCompany);
router.get("/", getAllSalesByCompany);
router.put("/:saleId", editSaleForCompany);
router.delete("/:saleId", deleteSaleForCompany);

module.exports = router;
