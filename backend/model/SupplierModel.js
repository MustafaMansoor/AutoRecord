const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
  date: { type: Date, required: false },
  supplierName: { type: String, required: false },
  supplierAccount: { type: String, required: false },
  currency: { type: String, required: false },
  dateRange: { type: String, required: false },
  status: { type: String, required: false },
  statementNumber: { type: String, required: false },
  imageURL: { type: String, required: true },
  reason: { type: String, required: false },
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
