const express = require("express");
const router = express.Router();
const {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} = require("../controller/SupplierController"); // Adjust the path as necessary

// Routes for suppliers
router.route("/").post(createSupplier).get(getAllSuppliers);

router
  .route("/:id")
  .get(getSupplierById)
  .put(updateSupplier)
  .delete(deleteSupplier);

module.exports = router;
