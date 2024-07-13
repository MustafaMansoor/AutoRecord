const express = require("express");
// Initialize the router with mergeParams: true
const router = express.Router({ mergeParams: true });

const {addSupplierToCompany,getAllSuppliersByCompany,editSupplierForCompany,deleteSupplierForCompany} = require("../controller/SupplierController");

router.post("/", addSupplierToCompany);
router.get("/", getAllSuppliersByCompany);
router.put("/:supplierId", editSupplierForCompany);
router.delete("/:supplierId", deleteSupplierForCompany);

module.exports = router;


