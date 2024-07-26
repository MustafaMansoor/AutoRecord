const mongoose = require("mongoose");
const Company = require("../model/CompanyModel");
const Purchase = require("../model/PurchaseModel");
const Sale = require("../model/SalesModel");
const Supplier = require("../model/SupplierModel");
const jwt = require('jsonwebtoken');


const createCompany = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {const authHeader = req.headers.authorization;
    
    // Check if token is provided
    if (!authHeader) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
   
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const userRole = decodedToken.role;

    // Check if the user is an admin
    if (userRole !== 'admin') {
      return res.status(403).json({ error: "Access denied. Only admins can create companies." });
    }

    const {
      purchases = [],
      sales = [],
      suppliers = [],
      currency,
      country,
      companyName,
      ...companyData
    } = req.body;

    // Check if required fields are provided
    if (!currency || !country || !companyName) {
      throw new Error(
        "Missing required fields: currency, country, or companyName"
      );
    }

    // Ensure each purchase has all required fields
    const validatedPurchases = purchases.map((purchase) => ({
      status: purchase.status || "",
      invoiceNumber: purchase.invoiceNumber || "",
      date: purchase.date || new Date(),
      supplierName: purchase.supplierName || "",
      supplierAccount: purchase.supplierAccount || "",
      category: purchase.category || "",
      vatCode: purchase.vatCode || "",
      currency: purchase.currency || "",
      net: purchase.net || 0,
      vat: purchase.vat || 0,
      total: purchase.total || 0,
      imageURL: purchase.imageURL || "",
      reason: purchase.reason || "",
    }));

    // Ensure each sale has all required fields
    const validatedSales = sales.map((sale) => ({
      status: sale.status || "",
      invoiceNumber: sale.invoiceNumber || "",
      date: sale.date || new Date(),
      customerName: sale.customerName || "",
      customerAccount: sale.customerAccount || "",
      category: sale.category || "",
      vatCode: sale.vatCode || "",
      currency: sale.currency || "",
      net: sale.net || 0,
      vat: sale.vat || 0,
      total: sale.total || 0,
      imageURL: sale.imageURL || "",
      reason: sale.reason || "",
    }));

    // Ensure each supplier has all required fields
    const validatedSuppliers = suppliers.map((supplier) => ({
      date: supplier.date || new Date(),
      supplierName: supplier.supplierName || "",
      supplierAccount: supplier.supplierAccount || "",
      currency: supplier.currency || "",
      dateRange: supplier.dateRange || "",
      status: supplier.status || "",
      statementNumber: supplier.statementNumber || "",
      imageURL: supplier.imageURL || "",
      reason: supplier.reason || "",
    }));

    // Create purchases and get their ObjectIds
    const purchaseDocs =
      validatedPurchases.length > 0
        ? await Purchase.create(validatedPurchases, { session })
        : [];
    const purchaseIds = purchaseDocs.map((purchase) => purchase._id);

    // Create sales and get their ObjectIds
    const saleDocs =
      validatedSales.length > 0
        ? await Sale.create(validatedSales, { session })
        : [];
    const saleIds = saleDocs.map((sale) => sale._id);

    // Create suppliers and get their ObjectIds
    const supplierDocs =
      validatedSuppliers.length > 0
        ? await Supplier.create(validatedSuppliers, { session })
        : [];
    const supplierIds = supplierDocs.map((supplier) => supplier._id);

    // Create company with the referenced ObjectIds
    const newCompany = await Company.create(
      [
        {
          ...companyData,
          currency,
          country,
          companyName,
          purchases: purchaseIds,
          sales: saleIds,
          suppliers: supplierIds,
          admin: userId,
          people: [],
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ newCompany });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating company:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if token is provided
    if (!authHeader) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
   
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const userRole = decodedToken.role;

    let companies;

    // Fetch companies based on user role
    if (userRole === 'admin') {
      companies = await Company.find({ admin: userId });
    } else {
      companies = await Company.find({ people: userId });
    }

    res.status(200).json({ companies });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token has expired" });
    }
    
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId)
      .populate("purchases")
      .populate("sales")
      .populate("suppliers");
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json({ company });
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    Object.assign(company, req.body);
    await company.save();

    res.status(200).json({ company });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findByIdAndDelete(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const getAllFoldersByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Find the company by ID and populate the purchases, sales, and suppliers fields
    const company = await Company.findById(companyId)
      .populate("purchases")
      .populate("sales")
      .populate("suppliers");

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json({
      purchases: company.purchases,
      sales: company.sales,
      suppliers: company.suppliers,
    });
  } catch (error) {
    console.error("Error fetching folders of company:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};


const getAllCompanyPeople = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Find the company by ID and populate the people field
    const company = await Company.findById(companyId).populate("people");

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json({ people: company.people });
  } catch (error) {
    console.error("Error fetching people of company:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getAllFoldersByCompany,
  getAllCompanyPeople 
};