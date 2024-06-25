const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
  status: { type: String, required: false },
  invoiceNumber: { type: String },
  date: { type: Date, required: false },
  supplierName: { type: String, required: false },
  supplierAccount: { type: String, required: false },
  category: { type: String, required: false },
  vatCode: { type: String, required: false },
  currency: { type: String, required: false },
  net: { type: Number, required: false },
  vat: { type: Number, required: false },
  total: { type: Number, required: false },
  imageURL: { type: String, required: true },
  reason: { type: String, required: false },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
