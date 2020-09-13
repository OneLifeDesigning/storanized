const mongoose = require('mongoose');
const Chat = require("../models/chat.model")


const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  },
  owner: {
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


// messageSchema.pre('save', function (next) {
//   if (this.unread) {
//     Chat.findById(this.chatId.toString())
//       .then(chat => {
//         if (!chat.unread) {
//           chat.unread = true
//           chat.save()
//             .then(next)
//             .catch(next)
//         }
//       })
//       .catch(next)
//   }
// })

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;