const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salesSchema = new Schema({
  status: { type: String, required: true },
  invoiceNumber: { type: String, required: true },
  date: { type: Date, required: true },
  customerName: { type: String, required: true },
  customerAccount: { type: String, required: true },
  category: { type: String, required: true },
  vatCode: { type: String, required: true },
  currency: { type: String, required: true },
  net: { type: Number, required: true },
  vat: { type: Number, required: true },
  total: { type: Number, required: true },
  imageLink: { type: String, required: false },
  reason: { type: String, required: false }
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;