const mongoose = require("mongoose");
const Company = require("../model/CompanyModel");
const Purchase = require("../model/PurchaseModel");





const addPurchaseToCompany = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { companyId } = req.params;
      const purchase = req.body;
  
      // Validate purchase data
      const validatedPurchase = {
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
      console.error("Error adding purchase to company:", error);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  };
  


  const getAllPurchasesByCompany = async (req, res) => {
    try {
      const { companyId } = req.params;
  
      // Find the company by ID and populate the purchases field
      const company = await Company.findById(companyId).populate("purchases");
  
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
  
      res.status(200).json({ purchases: company.purchases });
    } catch (error) {
      console.error("Error fetching purchases of company:", error);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  };

  
const editPurchaseForCompany = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { companyId, purchaseId } = req.params;
      const purchaseUpdates = req.body;
  
      // Validate purchase data
      const validatedPurchaseUpdates = {
        status: purchaseUpdates.status || "",
        invoiceNumber: purchaseUpdates.invoiceNumber || "",
        date: purchaseUpdates.date || new Date(),
        supplierName: purchaseUpdates.supplierName || "",
        supplierAccount: purchaseUpdates.supplierAccount || "",
        category: purchaseUpdates.category || "",
        vatCode: purchaseUpdates.vatCode || "",
        currency: purchaseUpdates.currency || "",
        net: purchaseUpdates.net || 0,
        vat: purchaseUpdates.vat || 0,
        total: purchaseUpdates.total || 0,
        imageURL: purchaseUpdates.imageURL || "",
        reason: purchaseUpdates.reason || "",
      };
  
      // Update the purchase
      const updatedPurchase = await Purchase.findByIdAndUpdate(
        purchaseId,
        validatedPurchaseUpdates,
        { new: true, session }
      );
  
      if (!updatedPurchase) {
        throw new Error("Purchase not found");
      }
  
      // Ensure the purchase belongs to the company
      const company = await Company.findOne({ _id: companyId, purchases: purchaseId }).session(session);
      if (!company) {
        throw new Error("Company not found or purchase does not belong to the company");
      }
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({ updatedPurchase });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error updating purchase for company:", error);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  };
  
const deletePurchaseForCompany = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { companyId, purchaseId } = req.params;
  
      // Delete the purchase
      const deletedPurchase = await Purchase.findByIdAndDelete(purchaseId).session(session);
  
      if (!deletedPurchase) {
        throw new Error("Purchase not found");
      }
  
      // Remove the purchase reference from the company
      await Company.findByIdAndUpdate(companyId, {
        $pull: { purchases: purchaseId }
      }).session(session);
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({ deletedPurchase });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error deleting purchase for company:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };

    module.exports = { addPurchaseToCompany, getAllPurchasesByCompany, editPurchaseForCompany, deletePurchaseForCompany };