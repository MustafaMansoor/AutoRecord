const Supplier = require("../model/SupplierModel"); // Adjust the path as necessary

const createSupplier = async (req, res) => {
  try {
    const {
      date,
      supplierName,
      supplierAccount,
      currency,
      dateRange,
      status,
      statementNumber,
      imageURL,
      reason,
    } = req.body;

    const newSupplier = await Supplier.create({
      date,
      supplierName,
      supplierAccount,
      currency,
      dateRange,
      status,
      statementNumber,
      imageURL,
      reason,
    });

    res.status(201).json({ supplier: newSupplier });
  } catch (error) {
    console.error("Error creating supplier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.json({ suppliers });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json({ supplier });
  } catch (error) {
    console.error("Error fetching supplier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const {
      date,
      supplierName,
      supplierAccount,
      currency,
      dateRange,
      status,
      statementNumber,
      imageURL,
      reason,
    } = req.body;

    const supplier = await Supplier.findByIdAndUpdate(
      supplierId,
      {
        date,
        supplierName,
        supplierAccount,
        currency,
        dateRange,
        status,
        statementNumber,
        imageURL,
        reason,
      },
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json({ supplier });
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const supplier = await Supplier.findByIdAndDelete(supplierId);

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
