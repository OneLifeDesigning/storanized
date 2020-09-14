require('dotenv').config();
require("../config/db.config");
const faker = require("faker");

const User = require("../models/user.model");
const Address = require("../models/address.model");
const Storage = require("../models/storage.model");
const Box = require("../models/box.model");
const Product = require("../models/product.model");
const Message = require("../models/message.model");
const Chat = require("../models/chat.model");
const Attachment = require("../models/attachment.model");

const usersProducts = []

const productType = ['Motorcycles',' Motor and Accessories', 'Fashion and Accessories',' TV, Audio and Photo ',' Mobile Phones and Telephony ',' Computers and Electronics', 'Sports and Leisure', 'Bicycles',' Consoles and Videogames ',' Home and Garden ',' Household appliances', 'Cinema, Books and Music', 'Children and Babies',' Collecting ',' Building materials', 'Industry and Agriculture', 'Others'] 

const genre = ['Female', 'Male', 'Other']
const bool = [true, false]

const getRanElem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
} 



const generateRandomToken = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

function createUser() {
  const user = new User({
    name: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 12345678,
    username: faker.internet.userName(),
    avatar: faker.image.avatar(),
    genre: getRanElem(genre),
    phoneNumber: faker.phone.phoneNumber(),
    activation: {
      active: true,
      token: generateRandomToken()
    },
    role: 'client',
    terms: true
  })

  return user.save()
}

function createAddress(userId) {
  const address = new Address({
    name: faker.name.title(),
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    country: faker.address.country(),
    postalCode: faker.address.zipCode(),
    longitude: faker.address.longitude(),
    latitude: faker.address.latitude(),
    defaultAddress: true,
    user: userId
  })
  return address.save()
}

function createStorage(userId, addressId) {
  const storage = new Storage({
    name: faker.name.title(),
    description: faker.lorem.paragraph(),
    user: userId,
    address: addressId
  })
  return storage.save()
}

function createBox(userId, storageId) {
  const box = new Box({
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    location: faker.lorem.words(4),
    qrCode: faker.internet.url(),
    user: userId,
    storage: storageId
  })
  return box.save()
}
function createProduct(userId, boxId) {
  const product = new Product({
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    tags: [faker.lorem.word()],
    category: getRanElem(productType),
    price: faker.commerce.price(),
    isPublic: getRanElem(bool),
    isSold: false,
    user: userId,
    box: boxId,
  })
  return product.save()
}

function createChat(userId, ownerId, productId) {
  const chat = new Chat({
    user: userId,
    owner: ownerId,
    product: productId,
    unread: false
  })
  return chat.save()
}
function createMessage(chatId, fromId, userId, createdAt, unread) {
  const messages = new Message({
    chatId: chatId,
    from: fromId,
    to: userId,
    text: faker.lorem.paragraph(),
    unread: unread,
    createdAt: createdAt
  })
  return messages.save()
}

function createAttachment(userId, productId) {
  const attachment = new Attachment({
    target: 'mainImage',
    url: faker.image.image(),
    product: productId,
    user: userId
  })
  return attachment.save()
}


const users = []

function restoreDatabase() {
  return Promise.all([
    User.deleteMany({}),
    Address.deleteMany({}),
    Storage.deleteMany({}),
    Box.deleteMany({}),
    Attachment.deleteMany({}),
    Product.deleteMany({}),
    Chat.deleteMany({}),
    Message.deleteMany({})
  ])
}
function seeds() {
  restoreDatabase()
    .then(() => {
      console.log('Database restored!')
      for (let i = 0; i < 30; i++) {
        createUser()
          .then(user => {
            console.log(user.email)
            users.push(user)
            createAddress(user.id)
              .then(address => {
                console.log('address', address.name)
                  for (let i = 0; i < 2; i++) {
                    createStorage(user.id, address.id)
                    .then(storage => {
                      console.log('storage', storage.name)
                      for (let i = 0; i < 4; i++) {
                        createBox(user.id, storage.id)
                        .then(box => {
                          console.log('box', box.name);
                          for (let i = 0; i < 10; i++) {
                            createProduct(user.id, box.id)
                              .then(product => {
                                createAttachment(user.id, product.id)
                                .then(attachment => {
                                  product.image = attachment.id
                                  product.save()
                                  .then(product => {
                                    if (usersProducts.length >= 6) {
                                      for (let i = 0; i < Math.floor(Math.random() * 2); i++) {
                                        const ownerData = getRanElem(usersProducts)
                                        if (user.id !== ownerData.ownerId) {
                                          createChat(user.id, ownerData.ownerId, ownerData.productId)
                                            .then(chat => {
                                              const maxMesages = Math.floor(Math.random() * 4)
                                              for (let i = 0; i < maxMesages; i++) {
                                                const time = new Date()
                                                createMessage(chat.id, ownerData.ownerId, user.id, time, false)
                                                .then(() => {
                                                  let unread = false
                                                  if (maxMesages === i+1) {
                                                    console.log('last message');
                                                    unread = getRanElem(bool)
                                                  }
                                                  console.log(unread);
                                                  createMessage(chat.id, user.id, ownerData.ownerId, time.setMinutes( time.getMinutes() + Math.floor(Math.random() * 10)), unread)
                                                  .then(() => {
                                                    if (unread) {
                                                      chat.unread = unread
                                                      chat.save()
                                                      .then(() => {
                                                        console.log('chat update')
                                                      })
                                                      .catch()
                                                      console.log('chat no update')
                                                    }
                                                  })
                                                  .catch()
                                                })
                                                .catch()
                                              }
                                            })
                                            .catch()
                                        }
                                      }
                                    }
                                    usersProducts.push({ownerId: user.id, productId: product.id })
                                    console.log('product', product.name);
                                  })
                                  .catch()
                                })
                                .catch()
                            })
                            .catch()
                          }
                        })
                        .catch()
                      }
                    })
                    .catch()
                  }
                })
              .catch()
        })
      }
    })
    .catch()
}

seeds()