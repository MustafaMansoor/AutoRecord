const express = require("express");
const router = express.Router();
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getAllFoldersByCompany
} = require("../controller/CompanyController.js");

// Routes for managing companies
router.route("/").post(createCompany).get(getAllCompanies);

router
  .route("/:id")
  .get(getCompanyById)
  .put(updateCompany)
  .delete(deleteCompany);

router.get("/:companyId/folders", getAllFoldersByCompany);


module.exports = router;
