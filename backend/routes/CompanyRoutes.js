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
const { authMiddleware } = require("../Middleware/auth.js");


// Routes for managing companies
router.route("/").post(authMiddleware,createCompany).get(authMiddleware,getAllCompanies);

router
  .route("/:id")
  .get(getCompanyById)
  .put(updateCompany)
  .delete(deleteCompany);

router.get("/:companyId/folders", getAllFoldersByCompany);


module.exports = router;
