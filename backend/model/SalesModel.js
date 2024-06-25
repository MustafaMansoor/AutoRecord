const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesSchema = new Schema({
  status: { type: String, required: false },
  invoiceNumber: { type: String, required: false },
  date: { type: Date, required: false },
  customerName: { type: String, required: false },
  customerAccount: { type: String, required: false },
  category: { type: String, required: false },
  vatCode: { type: String, required: false },
  currency: { type: String, required: false },
  net: { type: Number, required: false },
  vat: { type: Number, required: false },
  total: { type: Number, required: false },
  imageURL: { type: String, required: true },
  reason: { type: String, required: false },
});

const Sales = mongoose.model("Sales", salesSchema);

module.exports = Sales;
