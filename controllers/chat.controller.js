const mongoose = require("mongoose")
const Message = require("../models/message.model");
const Chat = require("../models/chat.model")


module.exports.all = (req, res, next) => {
  Chat.find({user: req.currentUser.id.toString()})
  .sort({unread: -1})
  .populate('user')
  .populate('product')
  .populate('owner')
  .then(received => {
    console.log(received);
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
  const owner = req.body.owner.toString()
  const text = req.body.text.toString()
  Chat.findById(chatId)
    .then(chat => {
      const message = new Message({
        to: chat.user,
        chatId: chatId,
        text: text,
        owner: owner
      })
      message.save()
        .then(message => {
          res.json(message)
        })
        .catch()
    })
    .catch()
};

module.exports.apiGetUnreadChats = (req, res, next) => {
  Chat.find({$or: {user: rep.currentUser.id, owner: rep.currentUser.id}, unread: true})
  .then(chats => {
    res.json(chats.length)
  })
  .catch()
};

module.exports.apiGetUnreadMessages = (req, res, next) => {
  Message.find({chatId: req.params.chatId, unread: true})
  .sort({updatedAt: 1})
  .then(chats => {
    res.json(chats)
  })
  .catch()
};

module.exports.newChat = (req, res, next) => {
  const chat = new Chat({
    ...req.body,
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
      path: 'owner',
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
              title: 'View all chats',
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
