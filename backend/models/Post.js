const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String, // Author's name
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User who created the post
    ref: 'User', // Refers to the 'User' model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', PostSchema);