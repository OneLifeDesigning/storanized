const mongoose = require("mongoose")
const Message = require("../models/message.model");
const Chat = require("../models/chat.model");
const { populate } = require("../models/chat.model");


module.exports.all = (req, res, next) => {
  Chat.find({user: req.currentUser.id.toString()})
  .sort({unread: -1, createdAt: -1})
  .populate('user')
  .populate('product')
  .populate('owner')
  .then(received => {
    Chat.find({owner: req.currentUser.id.toString()})
    .sort({unread: -1})
    .populate('user')
    .populate('product')
    .populate('owner') 
    .then(sent => {
      res.render("chats/all", { 
        title: 'View all chats',
        breadcrumbs: req.breadcrumbs,
        chats: {sent, received}
      })
    })
    .catch()
  })
  .catch()
}

module.exports.apiNewMessage = (req, res, next) => {
  const chatId = req.body.chatId.toString()
  const text = req.body.text.toString()
  Chat.findById(chatId)
    .then(chat => {
      const message = new Message({
        chatId: chatId,
        text: text,
        to: chat.owner.toString(),
        from: req.currentUser.id.toString(),
        unread: true
      })
      if (req.currentUser.id.toString() === chat.owner.toString()) {
        message.to = chat.user.toString()
      }
      message.save()
        .then(message => {
          res.json(message)
        })
        .catch()
    })
    .catch()
};


module.exports.newChat = (req, res, next) => {
  console.log(req.params);
  const chat = new Chat({
    ...req.params,
    owner: req.currentUser.id.toString()
  })
  chat.save()
  .then(chat => {
    res.redirect(`/junglesales/chats/${chat.id}`);
  })
  .catch()
};

module.exports.show = (req, res, next) => {
  const ordering = { sort: { updatedAt: 1 } }
  Chat.findById(req.params.id)
  .populate({
    options: ordering,
    path: 'messages',
    model: 'Message',
    populate: {
      path: 'from',
      model: 'User'
    }
  })
  .populate('user')
  .populate([
    {
      path: 'product',
      model: 'Product',
      populate: {
        path: 'attachments',
        model: 'Attachment'
      }
    },
    {
      path: 'product',
      model: 'Product',
      populate: {
        path: 'user',
        model: 'User'
      }
    },
  ])
  .then(chat => {
    Message.updateMany({chatId: chat._id.toString()}, {$set:{unread: false}}, {multi: true})
      .then(() => {
        chat.unread = false
        chat.save()
          .then(chat => {
            res.render("chats/show", { 
              title: 'Chat',
              breadcrumbs: req.breadcrumbs,
              user: req.currentUser,
              chat
            })
          })
          .catch()
      })
      .catch()
  })
  .catch()
}

module.exports.apiGetUnreadMessages = (req, res, next) => {
  Message.find({to: req.currentUser.id, unread: true})
  .populate('from')
  .then(messages => {
    res.json(messages)
  })
  .catch()
};
module.exports.apiMarkReadedMessage = (req, res, next) => {
  Message.findByIdAndUpdate(req.body.id, {unread: false})
  .then(message => {
    res.json(message)
  })
  .catch()
};
