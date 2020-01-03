const mongoose = require("mongoose");

const PromptSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  title: {
    type: String,
    required: true,
    
  },
  response: {
    type: String,
  },
  date: {
    type: String,
    default: Date.now()
  }
});

module.exports = mongoose.model("prompt", PromptSchema);