
const mongoose = require("mongoose");
const Company = require("../model/CompanyModel");
const Sale = require("../model/SalesModel");


const addSaleToCompany = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { companyId } = req.params;
      const sale = req.body;
  
      // Validate sale data
      const validatedSale = {
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
      console.error("Error adding sale to company:", error);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  };
  
  const editSaleForCompany = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { companyId, saleId } = req.params;
      const saleUpdates = req.body;
  
  
      // Validate sale data updates with default values
      const validatedSaleUpdates = {
        status: saleUpdates.status || "",
        invoiceNumber: saleUpdates.invoiceNumber || "",
        date: saleUpdates.date || new Date(),
        customerName: saleUpdates.customerName || "",
        customerAccount: saleUpdates.customerAccount || "",
        category: saleUpdates.category || "",
        vatCode: saleUpdates.vatCode || "",
        currency: saleUpdates.currency || "",
        net: saleUpdates.net || 0,
        vat: saleUpdates.vat || 0,
        total: saleUpdates.total || 0,
        imageURL: saleUpdates.imageURL || "",
        reason: saleUpdates.reason || "",
      };
  
      // Update the sale
      const updatedSale = await Sale.findByIdAndUpdate(
        saleId,
        { $set: validatedSaleUpdates },
        { new: true, session }
      );
  
      if (!updatedSale) {
        throw new Error("Sale not found");
      }
  
      // Ensure the sale belongs to the company
      const company = await Company.findOne({ _id: companyId, sales: saleId }).session(session);
      if (!company) {
        throw new Error("Company not found or sale does not belong to the company");
      }
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({ updatedSale });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error editing sale for company:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };
  const getAllSalesByCompany = async (req, res) => {
    try {
      const { companyId } = req.params;
  
      // Find the company by ID and populate the sales field
      const company = await Company.findById(companyId).populate("sales");
  
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
  
      res.status(200).json({ sales: company.sales });
    } catch (error) {
      console.error("Error fetching sales of company:", error);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  };
  
const deleteSaleForCompany = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { companyId, saleId } = req.params;
  
      // Delete the sale
      const deletedSale = await Sale.findByIdAndDelete(saleId).session(session);
  
      if (!deletedSale) {
        throw new Error("Sale not found");
      }
  
      // Optionally, remove the sale reference from the company if needed
      await Company.findByIdAndUpdate(companyId, {
        $pull: { sales: saleId }
      }).session(session);
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({ deletedSale });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error deleting sale for company:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };
  
  
  module.exports = { addSaleToCompany, editSaleForCompany, getAllSalesByCompany, deleteSaleForCompany };
  