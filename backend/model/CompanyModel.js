const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  companyName: { type: String, required: true },
  country: { type: String, required: true },
  currency: { type: String, required: true },
  purchases: [{ type: Schema.Types.ObjectId, ref: 'Purchase' }],
  sales: [{ type: Schema.Types.ObjectId, ref: 'Sales' }],
  suppliers: [{ type: Schema.Types.ObjectId, ref: 'Supplier' }],
  people: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  admin: { type: Schema.Types.ObjectId, ref: 'User', required: false }
});

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;
