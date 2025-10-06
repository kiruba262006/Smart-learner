const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For pre-save password hashing

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure emails are unique
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash password before saving a new user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // Only hash if the password field is being modified
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);