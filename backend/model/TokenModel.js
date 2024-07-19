const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  token: { type: String, required: true },
  role: { type: String, enum: ['admin', 'people'], required: true },
  email: { type: String, required: true }, // To link the token to an email
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: false }, // Link token to a company (for people)
  expiresAt: { type: Date, required: true, default: Date.now, expires: '12h' }, // Token expiry time
});

const Token = mongoose.model('Token', TokenSchema);
module.exports = Token;
