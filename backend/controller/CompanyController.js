const mongoose = require('mongoose');
const Company = require('../model/CompanyModel');
const Purchase = require('../model/PurchaseModel'); 
const Sale = require('../model/SalesModel'); 
const Supplier = require('../model/SupplierModel'); 


const createCompany = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { purchases = [], sales = [], suppliers = [], currency, country, companyName, ...companyData } = req.body;

    // Check if required fields are provided
    if (!currency || !country || !companyName) {
      throw new Error('Missing required fields: currency, country, or companyName');
    }

    // Ensure each purchase has all required fields
    const validatedPurchases = purchases.map(purchase => ({
      status: purchase.status || '',
      invoiceNumber: purchase.invoiceNumber || '',
      date: purchase.date || new Date(),
      supplierName: purchase.supplierName || '',
      supplierAccount: purchase.supplierAccount || '',
      category: purchase.category || '',
      vatCode: purchase.vatCode || '',
      currency: purchase.currency || '',
      net: purchase.net || 0,
      vat: purchase.vat || 0,
      total: purchase.total || 0,
      imageURL: purchase.imageURL || '',
      reason: purchase.reason || ''
    }));

    // Ensure each sale has all required fields
    const validatedSales = sales.map(sale => ({
      status: sale.status || '',
      invoiceNumber: sale.invoiceNumber || '',
      date: sale.date || new Date(),
      customerName: sale.customerName || '',
      customerAccount: sale.customerAccount || '',
      category: sale.category || '',
      vatCode: sale.vatCode || '',
      currency: sale.currency || '',
      net: sale.net || 0,
      vat: sale.vat || 0,
      total: sale.total || 0,
      imageURL: sale.imageURL || '',
      reason: sale.reason || ''
    }));

    // Ensure each supplier has all required fields
    const validatedSuppliers = suppliers.map(supplier => ({
      date: supplier.date || new Date(),
      supplierName: supplier.supplierName || '',
      supplierAccount: supplier.supplierAccount || '',
      currency: supplier.currency || '',
      dateRange: supplier.dateRange || '',
      status: supplier.status || '',
      statementNumber: supplier.statementNumber || '',
      imageURL: supplier.imageURL || '',
      reason: supplier.reason || ''
    }));

    // Create purchases and get their ObjectIds
    const purchaseDocs = validatedPurchases.length > 0 ? await Purchase.create(validatedPurchases, { session }) : [];
    const purchaseIds = purchaseDocs.map(purchase => purchase._id);

    // Create sales and get their ObjectIds
    const saleDocs = validatedSales.length > 0 ? await Sale.create(validatedSales, { session }) : [];
    const saleIds = saleDocs.map(sale => sale._id);

    // Create suppliers and get their ObjectIds
    const supplierDocs = validatedSuppliers.length > 0 ? await Supplier.create(validatedSuppliers, { session }) : [];
    const supplierIds = supplierDocs.map(supplier => supplier._id);

    // Create company with the referenced ObjectIds
    const newCompany = await Company.create(
      [{ ...companyData, currency, country, companyName, purchases: purchaseIds, sales: saleIds, suppliers: supplierIds }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ newCompany });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};


const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({})
    res.status(200).json({ companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId)
      .populate('purchases')
      .populate('sales')
      .populate('suppliers');
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.status(200).json({ company });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    Object.assign(company, req.body);
    await company.save();

    res.status(200).json({ company });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findByIdAndDelete(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addPurchaseToCompany = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { companyId } = req.params;
    const purchase = req.body; // Access the purchase directly from req.body
    console.log("Request params:", req.params);  // Ensure companyId is defined
    console.log("Request body:", req.body);      // Ensure purchase object is correctly structured
  
    // Validate purchase data
    const validatedPurchase = {
      status: purchase.status || '',
      invoiceNumber: purchase.invoiceNumber || '',
      date: purchase.date || new Date(),
      supplierName: purchase.supplierName || '',
      supplierAccount: purchase.supplierAccount || '',
      category: purchase.category || '',
      vatCode: purchase.vatCode || '',
      currency: purchase.currency || '',
      net: purchase.net || 0,
      vat: purchase.vat || 0,
      total: purchase.total || 0,
      imageURL: purchase.imageURL || '',
      reason: purchase.reason || ''
    };

    // Create the new purchase
    const newPurchase = await Purchase.create([validatedPurchase], { session });

    // Add the new purchase to the company's purchase list
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { $push: { purchases: newPurchase[0]._id } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ updatedCompany });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error adding purchase to company:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};



const getAllPurchasesByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Find the company by ID and populate the purchases field
    const company = await Company.findById(companyId).populate('purchases');

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.status(200).json({ purchases: company.purchases });
  } catch (error) {
    console.error('Error fetching purchases of company:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};



const addSaleToCompany = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { companyId } = req.params;
    const { sale } = req.body;

    // Validate sale data
    const validatedSale = {
      status: sale.status || '',
      invoiceNumber: sale.invoiceNumber || '',
      date: sale.date || new Date(),
      customerName: sale.customerName || '',
      customerAccount: sale.customerAccount || '',
      category: sale.category || '',
      vatCode: sale.vatCode || '',
      currency: sale.currency || '',
      net: sale.net || 0,
      vat: sale.vat || 0,
      total: sale.total || 0,
      imageURL: sale.imageURL || '',
      reason: sale.reason || ''
    };

    // Create the new sale
    const newSale = await Sale.create([validatedSale], { session });

    // Add the new sale to the company's sale list
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { $push: { sales: newSale[0]._id } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ updatedCompany });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error adding sale to company:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

const addSupplierToCompany = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { companyId } = req.params;
    const { supplier } = req.body;

    // Validate supplier data
    const validatedSupplier = {
      date: supplier.date || new Date(),
      supplierName: supplier.supplierName || '',
      supplierAccount: supplier.supplierAccount || '',
      currency: supplier.currency || '',
      dateRange: supplier.dateRange || '',
      status: supplier.status || '',
      statementNumber: supplier.statementNumber || '',
      imageURL: supplier.imageURL || '',
      reason: supplier.reason || ''
    };

    // Create the new supplier
    const newSupplier = await Supplier.create([validatedSupplier], { session });

    // Add the new supplier to the company's supplier list
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { $push: { suppliers: newSupplier[0]._id } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ updatedCompany });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error adding supplier to company:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

const getAllSalesByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Find the company by ID and populate the sales field
    const company = await Company.findById(companyId).populate('sales');

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.status(200).json({ sales: company.sales });
  } catch (error) {
    console.error('Error fetching sales of company:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
const getAllSuppliersByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Find the company by ID and populate the suppliers field
    const company = await Company.findById(companyId).populate('suppliers');

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.status(200).json({ suppliers: company.suppliers });
  } catch (error) {
    console.error('Error fetching suppliers of company:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  addPurchaseToCompany,
  addSaleToCompany,
  addSupplierToCompany,
  getAllPurchasesByCompany,
  getAllSalesByCompany,
  getAllSuppliersByCompany,
};
