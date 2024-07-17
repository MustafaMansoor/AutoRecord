const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  token: { type: String, required: true },
  role: { type: String, enum: ['admin', 'people'], required: true },
  email: { type: String, required: true }, // To link the token to an email
  expiresAt: { type: Date, required: true, default: Date.now, expires: '1h' }, // Token expiry time
});

const Token = mongoose.model('Token', TokenSchema);
module.exports = Token;
