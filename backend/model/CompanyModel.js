const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
  companyName: { type: String, required: true },
  country: { type: String, required: true },
  currency: { type: String, required: true },
  dateFormat: { type: String, required: true }
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
