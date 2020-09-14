const mongoose = require('mongoose');
const Message = require("../models/message.model");

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  unread: {
    type: Boolean,
    default: true
  }
},{ timestamps: true, toJSON: { virtuals: true } });

chatSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "chatId",
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;