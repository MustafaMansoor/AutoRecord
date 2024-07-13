const mongoose = require("mongoose");
const Company = require("../model/CompanyModel");
const Supplier = require("../model/SupplierModel");



const getAllSuppliersByCompany = async (req, res) => {
    try {
      const { companyId } = req.params;
  
      // Find the company by ID and populate the suppliers field
      const company = await Company.findById(companyId).populate("suppliers");
  
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
  
      res.status(200).json({ suppliers: company.suppliers });
    } catch (error) {
      console.error("Error fetching suppliers of company:", error);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  };
  
  const editSupplierForCompany = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { companyId, supplierId } = req.params;
      const supplierUpdates = req.body;
  
      // Validate supplier data updates with default values
      const validatedSupplierUpdates = {
        date: supplierUpdates.date || new Date(),
        supplierName: supplierUpdates.supplierName || "",
        supplierAccount: supplierUpdates.supplierAccount || "",
        currency: supplierUpdates.currency || "",
        dateRange: supplierUpdates.dateRange || { start: new Date(), end: new Date() },
        status: supplierUpdates.status || "",
        statementNumber: supplierUpdates.statementNumber || "",
        imageURL: supplierUpdates.imageURL || "",
        reason: supplierUpdates.reason || "",
      };
  
      // Update the supplier
      const updatedSupplier = await Supplier.findByIdAndUpdate(
        supplierId,
        { $set: validatedSupplierUpdates },
        { new: true, session }
      );
  
      if (!updatedSupplier) {
        throw new Error("Supplier not found");
      }
  
      // Ensure the supplier belongs to the company
      const company = await Company.findOne({ _id: companyId, suppliers: supplierId }).session(session);
      if (!company) {
        throw new Error("Company not found or supplier does not belong to the company");
      }
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({ updatedSupplier });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error editing supplier for company:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };

  
const addSupplierToCompany = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { companyId } = req.params;
      const supplier = req.body;
  
      // Validate supplier data
      const validatedSupplier = {
        date: supplier.date || new Date(),
        supplierName: supplier.supplierName || "",
        supplierAccount: supplier.supplierAccount || "",
        currency: supplier.currency || "",
        dateRange: supplier.dateRange || "",
        status: supplier.status || "",
        statementNumber: supplier.statementNumber || "",
        imageURL: supplier.imageURL || "",
        reason: supplier.reason || "",
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
      console.error("Error adding supplier to company:", error);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  };

  const deleteSupplierForCompany = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { companyId, supplierId } = req.params;
  
      // Delete the supplier
      const deletedSupplier = await Supplier.findByIdAndDelete(supplierId).session(session);
  
      if (!deletedSupplier) {
        throw new Error("Supplier not found");
      }
  
      // Optionally, remove the supplier reference from the company if needed
      await Company.findByIdAndUpdate(companyId, {
        $pull: { suppliers: supplierId }
      }).session(session);
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({ deletedSupplier });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error deleting supplier for company:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };
    
module.exports = {
    addSupplierToCompany,
    getAllSuppliersByCompany,
    editSupplierForCompany,
    deleteSupplierForCompany
};
