const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'people'], default: 'people' },
  companies: [{ type: Schema.Types.ObjectId, ref: 'Company' }]
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
