const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
  status: { type: String, required: true },
  date: { type: Date, required: true },
  supplierName: { type: String, required: true },
  category: { type: String, required: true },
  vatCode: { type: String, required: true },
  currency: { type: String, required: true },
  net: { type: Number, required: true },
  vat: { type: Number, required: true },
  total: { type: Number, required: true },
  imageURL: { type: String, required: false },
  reason: { type: String, required: false }
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;