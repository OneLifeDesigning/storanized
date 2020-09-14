const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: [true, 'Text is required'],
    trim: true
  },
  unread: {
    type: Boolean,
    default: true
  }
},{ timestamps: true, toJSON: { virtuals: true } });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;